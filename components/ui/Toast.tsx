"use client";

import { Check, CircleAlert, Info, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ToastVariant = "default" | "success" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  action?: ToastAction;
  duration?: number;
  variant?: ToastVariant;
}

export interface ToastMessage extends ToastOptions {
  id: string;
  message: ReactNode;
}

export interface ToastProps extends ToastMessage {
  onDismiss: (id: string) => void;
}

export interface ToastApi {
  toast: (message: ReactNode, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

interface ToastContextValue extends ToastApi {
  toasts: ToastMessage[];
}

export interface ToastProviderProps {
  children: ReactNode;
  defaultDuration?: number;
  maxToasts?: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);
let toastSequence = 0;

function createToastId(): string {
  toastSequence += 1;
  return `toast-${Date.now()}-${toastSequence}`;
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return <Check aria-hidden="true" size={20} strokeWidth={2.25} />;
  }

  if (variant === "error") {
    return <CircleAlert aria-hidden="true" size={20} strokeWidth={2.25} />;
  }

  return <Info aria-hidden="true" size={20} strokeWidth={2.25} />;
}

export function Toast({
  id,
  message,
  action,
  duration = 5_000,
  variant = "default",
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [duration, id, onDismiss]);

  const handleAction = () => {
    action?.onClick();
    onDismiss(id);
  };

  return (
    <div
      className={`toast toast--${variant}`}
      data-variant={variant}
      data-state="open"
    >
      <span className="toast__icon">
        <ToastIcon variant={variant} />
      </span>
      <div className="toast__message">{message}</div>
      {action ? (
        <button className="toast__action" type="button" onClick={handleAction}>
          {action.label}
        </button>
      ) : null}
      <button
        className="icon-button toast__close"
        type="button"
        aria-label="Dispensar notificação"
        onClick={() => onDismiss(id)}
      >
        <X aria-hidden="true" size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts?: ToastMessage[];
  onDismiss?: (id: string) => void;
} = {}) {
  const context = useContext(ToastContext);
  const visibleToasts = toasts ?? context?.toasts ?? [];
  const dismiss = onDismiss ?? context?.dismissToast ?? (() => undefined);

  return (
    <div
      className="toast-viewport"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {visibleToasts.map((item) => (
        <Toast key={item.id} {...item} onDismiss={dismiss} />
      ))}
    </div>
  );
}

export function ToastProvider({
  children,
  defaultDuration = 5_000,
  maxToasts = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toastItem) => toastItem.id !== id),
    );
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (message: ReactNode, options: ToastOptions = {}) => {
      const id = createToastId();
      const nextToast: ToastMessage = {
        id,
        message,
        ...options,
        duration: options.duration ?? defaultDuration,
      };

      setToasts((currentToasts) =>
        [...currentToasts, nextToast].slice(-Math.max(1, maxToasts)),
      );

      return id;
    },
    [defaultDuration, maxToasts],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ clearToasts, dismissToast, toast, toasts }),
    [clearToasts, dismissToast, toast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast precisa ser usado dentro de ToastProvider.");
  }

  return context;
}
