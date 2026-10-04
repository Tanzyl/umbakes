"use client";
import Image from "next/image";
import { createContext, startTransition, useActionState, useContext, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import type { ActionState } from "@/lib/admin";

const ErrorsCtx = createContext<Record<string, string[] | undefined>>({});
const PendingCtx = createContext(false);

/**
 * Form bound to a server action; shows toasts and per-field errors.
 * Submits via onSubmit rather than the action prop, because React resets action-prop forms after
 * every submission, which would wipe what the owner typed whenever validation fails.
 */
export function ActionForm({ action, children, className = "space-y-6", resetOnSuccess = false }: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else if (state.ok) {
      toast.success(state.message ?? "Saved");
      if (resetOnSuccess) ref.current?.reset();
    }
  }, [state, resetOnSuccess]);
  return (
    <ErrorsCtx.Provider value={state?.fieldErrors ?? {}}>
      <PendingCtx.Provider value={pending}>
        <form
          ref={ref}
          className={className}
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(() => formAction(fd));
          }}
        >
          {children}
        </form>
      </PendingCtx.Provider>
    </ErrorsCtx.Provider>
  );
}

export const inputCls =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 aria-invalid:border-red-500";

function FieldShell({ name, label, hint, children, id }: { name: string; label: string; hint?: string; children: React.ReactNode; id: string }) {
  const err = useContext(ErrorsCtx)[name]?.[0];
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
      {children}
      {err ? <p className="mt-1 text-sm text-red-700" id={`${id}-err`}>{err}</p> : hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; hint?: string };
export function Field({ name, label, hint, ...rest }: InputProps) {
  const id = useId();
  const err = useContext(ErrorsCtx)[name];
  return (
    <FieldShell name={name} label={label} hint={hint} id={id}>
      <input id={id} name={name} aria-invalid={!!err || undefined} aria-describedby={err ? `${id}-err` : undefined} className={inputCls} {...rest} />
    </FieldShell>
  );
}

export function TextArea({ name, label, hint, rows = 4, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string; label: string; hint?: string }) {
  const id = useId();
  const err = useContext(ErrorsCtx)[name];
  return (
    <FieldShell name={name} label={label} hint={hint} id={id}>
      <textarea id={id} name={name} rows={rows} aria-invalid={!!err || undefined} className={inputCls} {...rest} />
    </FieldShell>
  );
}

export function Select({ name, label, hint, options, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string; label: string; hint?: string; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <FieldShell name={name} label={label} hint={hint} id={id}>
      <select id={id} name={name} className={inputCls} {...rest}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FieldShell>
  );
}

export function Toggle({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3.5 hover:border-brand/40">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 size-5 accent-[var(--brand)]" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function SubmitButton({ children = "Save changes", className = "btn-primary" }: { children?: React.ReactNode; className?: string }) {
  const status = useFormStatus();
  const ctxPending = useContext(PendingCtx);
  const pending = status.pending || ctxPending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,image/gif";

/** Drop zone + file picker with live previews. Files go to the server in `name`. */
function DropZone({ name, multiple, onFiles, label }: { name: string; multiple?: boolean; onFiles: (files: File[]) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const dt = new DataTransfer();
        const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith("image/"));
        (multiple ? files : files.slice(0, 1)).forEach((f) => dt.items.add(f));
        if (ref.current) ref.current.files = dt.files;
        onFiles([...dt.files]);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center text-sm transition-colors ${
        drag ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40"
      }`}
    >
      <Upload className="size-6 text-brand" aria-hidden />
      <span className="font-medium">{label}</span>
      <span className="text-xs text-muted">Drag photos here or tap to choose · JPG, PNG, WebP or HEIC · up to 8 MB each</span>
      <input ref={ref} type="file" name={name} accept={ACCEPT} multiple={multiple} className="sr-only" onChange={(e) => onFiles([...(e.target.files ?? [])])} />
    </label>
  );
}

/** Object URLs for picked files, created in the event handler (not an effect). */
function usePreviews() {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const pick = (next: File[]) => {
    urls.forEach(URL.revokeObjectURL); // ponytail: last batch leaks until page unload if the field unmounts; harmless for an admin form
    setFiles(next);
    setUrls(next.map((f) => URL.createObjectURL(f)));
  };
  return { files, urls, pick };
}

/** Single image: shows current, lets admin replace or remove it, and edit alt text. */
export function ImageField({ name, label, current, hint }: { name: string; label: string; current?: { src: string; alt: string } | null; hint?: string }) {
  const { files, urls: previews, pick } = usePreviews();
  const [remove, setRemove] = useState(false);
  const shown = previews[0] ?? (!remove ? current?.src : undefined);
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-brand-soft">
          {shown ? <Image src={shown} alt="" fill sizes="160px" className="object-cover" unoptimized={!!previews[0]} /> : (
            <span className="flex h-full items-center justify-center text-muted"><ImagePlus className="size-8" aria-hidden /></span>
          )}
        </div>
        <div className="space-y-3">
          <DropZone name={`${name}File`} onFiles={(f) => { pick(f); setRemove(false); }} label={current ? "Replace image" : "Upload image"} />
          <Field name={`${name}Alt`} label="Image description (alt text)" defaultValue={current?.alt ?? ""} hint="Describe the photo for screen readers and Google, e.g. “Three-tier white floral wedding cake”." />
          {current && !files.length && (
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name={`${name}Remove`} checked={remove} onChange={(e) => setRemove(e.target.checked)} className="size-4 accent-[var(--brand)]" /> Remove current image
            </label>
          )}
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
      </div>
    </fieldset>
  );
}

export type ExistingImage = { id: string; src: string; alt: string };

/**
 * Multiple images (products, gallery): reorder, remove, edit alt text, add new.
 * Submits `imagesState` (JSON of kept images in order with alt text) and `newImages` files.
 */
export function ImagesField({ existing, label = "Photos" }: { existing: ExistingImage[]; label?: string }) {
  const [items, setItems] = useState(existing);
  const { files, urls: previews, pick } = usePreviews();
  const move = (i: number, d: number) =>
    setItems((arr) => {
      const a = [...arr];
      const j = i + d;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium">{label}</legend>
      <input type="hidden" name="imagesState" value={JSON.stringify(items.map(({ id, alt }) => ({ id, alt })))} />
      {items.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((im, i) => (
            <li key={im.id} className="flex gap-3 rounded-2xl border border-line bg-white p-2.5">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
                <Image src={im.src} alt="" fill sizes="96px" className="object-cover" />
                {i === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">Cover</span>}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  aria-label={`Alt text for photo ${i + 1}`}
                  placeholder="Describe this photo"
                  value={im.alt}
                  onChange={(e) => setItems((a) => a.map((x) => (x.id === im.id ? { ...x, alt: e.target.value } : x)))}
                  className="w-full rounded-lg border border-line px-2.5 py-1.5 text-sm"
                />
                <div className="flex gap-1">
                  <IconBtn label="Move earlier" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="size-4" /></IconBtn>
                  <IconBtn label="Move later" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="size-4" /></IconBtn>
                  <IconBtn label="Remove photo" onClick={() => setItems((a) => a.filter((x) => x.id !== im.id))} danger><Trash2 className="size-4" /></IconBtn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DropZone name="newImages" multiple onFiles={pick} label="Add photos" />
      {previews.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Photos to upload">
          {previews.map((u, i) => (
            <li key={u} className="relative size-20 overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={files[i]?.name ?? ""} className="size-full object-cover" />
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted">The first photo is used as the cover. New photos are added after existing ones. Changes apply when you save.</p>
    </fieldset>
  );
}

export function IconBtn({ label, children, danger, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white disabled:opacity-35 ${danger ? "text-red-700 hover:bg-red-50" : "text-ink hover:bg-brand-soft"}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** A button that asks for confirmation in a modal before running a server action. */
export function ConfirmAction({ action, title, description, confirmLabel = "Delete", children, className, hidden = {} }: {
  action: (fd: FormData) => Promise<ActionState | void>;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  children: React.ReactNode;
  className?: string;
  hidden?: Record<string, string>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={className ?? "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-red-700 hover:bg-red-50"} onClick={() => ref.current?.showModal()}>
        {children}
      </button>
      <dialog ref={ref} className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl bg-ivory p-0 shadow-lift backdrop:bg-ink/50">
        <form
          action={async (fd) => {
            const res = await action(fd);
            ref.current?.close();
            if (res?.error) toast.error(res.error);
            else toast.success(res?.message ?? "Done");
          }}
          className="space-y-4 p-6"
        >
          {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <div className="text-[15px] text-muted">{description}</div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={() => ref.current?.close()}>Cancel</button>
            <SubmitButton className="btn bg-red-700 text-white hover:bg-red-800">{confirmLabel}</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}

/** Small inline form button for quick actions (move up/down, toggle visibility). */
export function QuickAction({ action, children, label, hidden = {}, className }: {
  action: (fd: FormData) => Promise<ActionState | void>;
  children: React.ReactNode;
  label: string;
  hidden?: Record<string, string>;
  className?: string;
}) {
  return (
    <form
      action={async (fd) => {
        const res = await action(fd);
        if (res?.error) toast.error(res.error);
      }}
    >
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <QuickSubmit label={label} className={className}>{children}</QuickSubmit>
    </form>
  );
}

function QuickSubmit({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" aria-label={label} title={label} disabled={pending} className={className ?? "inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-brand-soft disabled:opacity-40"}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  );
}
