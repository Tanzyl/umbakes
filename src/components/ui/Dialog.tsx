"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Native <dialog> opened with showModal(): the browser handles Escape, focus trapping,
 * inert background and returning focus. We add a backdrop click-to-close and scroll lock.
 */
export function Dialog({ open, onClose, label, children, className = "" }: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto max-h-[100dvh] w-full max-w-none bg-transparent p-0 backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:motion-safe:animate-[dialog-in_220ms_cubic-bezier(.22,1,.36,1)] sm:max-h-[92dvh] sm:w-[min(1080px,calc(100vw-3rem))] ${className}`}
    >
      <div className="relative h-full">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-soft hover:bg-white"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
