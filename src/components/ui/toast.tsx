"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, X } from "lucide-react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast used outside of ToastProvider.");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t !== undefined && t.id !== id)),
      3500
    );
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <X className="h-5 w-5 text-red-500" />,
    info: <CheckCircle className="h-5 w-5 text-aydin-red" />,
  };
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border-soft bg-warm-white px-4 py-3 text-sm shadow-md"
      )}
    >
      {icons[toast.type]}
      <span>{toast.message}</span>
      <button onClick={onRemove} className="ml-2 text-secondary-text/50 hover:text-charcoal">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
