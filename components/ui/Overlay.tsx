"use client";

import { X } from "lucide-react";
import {
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useId,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { useFocusTrap } from "@/hooks/useFocusTrap";

export type OverlaySize = "sm" | "md" | "lg" | "full";

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  ariaLabel?: string;
  labelledBy?: string;
  describedBy?: string;
  className?: string;
  wrapperClassName?: string;
  size?: OverlaySize;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  showCloseButton?: boolean;
}

function joinClassNames(...classNames: Array<string | undefined | false>): string {
  return classNames.filter(Boolean).join(" ");
}

const subscribeToClient = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Overlay({
  open,
  onClose,
  children,
  title,
  description,
  ariaLabel,
  labelledBy,
  describedBy,
  className,
  wrapperClassName,
  size = "md",
  initialFocusRef,
  closeLabel = "Fechar",
  closeOnBackdrop = true,
  closeOnEscape = true,
  lockScroll = true,
  showCloseButton = true,
}: OverlayProps) {
  const canUseDom = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const generatedTitleId = useId();
  const generatedDescriptionId = useId();
  const titleId = labelledBy ?? (title ? generatedTitleId : undefined);
  const descriptionId =
    describedBy ?? (description ? generatedDescriptionId : undefined);
  const dialogRef = useFocusTrap<HTMLDivElement>({
    active: canUseDom && open,
    initialFocusRef,
    lockScroll,
    onEscape: closeOnEscape ? onClose : undefined,
  });

  if (!canUseDom || !open) {
    return null;
  }

  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={joinClassNames("overlay-root", wrapperClassName)}
      data-state="open"
    >
      <div
        className="overlay-backdrop"
        aria-hidden="true"
        onPointerDown={handleBackdropPointerDown}
      />
      <div
        ref={dialogRef}
        className={joinClassNames(
          "overlay-panel",
          `overlay-panel--${size}`,
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={!titleId ? (ariaLabel ?? "Janela de diálogo") : undefined}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {showCloseButton ? (
          <button
            className="icon-button overlay-close"
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        ) : null}

        {title ? (
          <h2 className="overlay-title" id={generatedTitleId}>
            {title}
          </h2>
        ) : null}

        {description ? (
          <div className="overlay-description" id={generatedDescriptionId}>
            {description}
          </div>
        ) : null}

        <div className="overlay-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
