"use client";

import { type RefObject, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface BodyScrollSnapshot {
  overflow: string;
  overscrollBehavior: string;
  paddingRight: string;
}

let bodyScrollLockCount = 0;
let bodyScrollSnapshot: BodyScrollSnapshot | null = null;

function lockBodyScroll(): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const body = document.body;

  if (bodyScrollLockCount === 0) {
    bodyScrollSnapshot = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      paddingRight: body.style.paddingRight,
    };

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(
        window.getComputedStyle(body).paddingRight,
      );
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "contain";
  }

  bodyScrollLockCount += 1;
  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);

    if (bodyScrollLockCount === 0 && bodyScrollSnapshot) {
      body.style.overflow = bodyScrollSnapshot.overflow;
      body.style.overscrollBehavior = bodyScrollSnapshot.overscrollBehavior;
      body.style.paddingRight = bodyScrollSnapshot.paddingRight;
      bodyScrollSnapshot = null;
    }
  };
}

function isFocusable(element: HTMLElement): boolean {
  return (
    !element.hasAttribute("disabled") &&
    !element.hasAttribute("hidden") &&
    element.getAttribute("aria-hidden") !== "true" &&
    !element.closest("[hidden], [aria-hidden='true']")
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(isFocusable);
}

function focusElement(element: HTMLElement | null | undefined): boolean {
  if (!element || !element.isConnected) {
    return false;
  }

  element.focus({ preventScroll: true });
  return document.activeElement === element;
}

export interface UseFocusTrapOptions {
  active: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  lockScroll?: boolean;
  onEscape?: () => void;
  returnFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  active,
  initialFocusRef,
  lockScroll = false,
  onEscape,
  returnFocus = true,
}: UseFocusTrapOptions): RefObject<T | null> {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const releaseScrollLock = lockScroll
      ? lockBodyScroll()
      : () => undefined;

    const focusFirstAvailable = () => {
      if (focusElement(initialFocusRef?.current)) {
        return;
      }

      const autoFocusElement = container.querySelector<HTMLElement>("[autofocus]");

      if (focusElement(autoFocusElement)) {
        return;
      }

      if (focusElement(getFocusableElements(container)[0])) {
        return;
      }

      focusElement(container);
    };

    const animationFrame = window.requestAnimationFrame(focusFirstAvailable);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        event.preventDefault();
        focusElement(container);
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstElement || !container.contains(activeElement))
      ) {
        event.preventDefault();
        focusElement(lastElement);
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement || !container.contains(activeElement))
      ) {
        event.preventDefault();
        focusElement(firstElement);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!container.contains(event.target as Node)) {
        focusFirstAvailable();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("focusin", handleFocusIn);
      releaseScrollLock();

      if (returnFocus) {
        focusElement(previouslyFocused);
      }
    };
  }, [active, initialFocusRef, lockScroll, onEscape, returnFocus]);

  return containerRef;
}
