"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const DialogContext = createContext<{ onClose: () => void } | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog component used outside of Dialog.");
  return ctx;
}

export function Dialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <DialogContext.Provider value={{ onClose }}>{children}</DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { onClose } = useDialogContext();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        {...props}
        className={cn(
          "relative mx-4 w-full max-w-lg rounded-xl bg-warm-white shadow-xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-secondary-text/60 hover:text-charcoal"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="border-b px-6 py-4">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold text-charcoal">{children}</h3>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1 text-sm text-secondary-text">{children}</p>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-2 border-t px-6 py-4">
      {children}
    </div>
  );
}
