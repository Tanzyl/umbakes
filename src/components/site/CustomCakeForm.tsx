"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inquiryMessage, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

const schema = z.object({
  occasion: z.string().max(80).optional(),
  theme: z.string().max(120).optional(),
  design: z.string().max(300).optional(),
  size: z.string().max(80).optional(),
  flavor: z.string().max(80).optional(),
  date: z.string().optional(),
  notes: z.string().max(800).optional(),
});
type Values = z.infer<typeof schema>;

const field = "mt-1.5 block w-full rounded-xl border border-line bg-ivory px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

export function CustomCakeForm({ waNumber, businessName, occasions }: { waNumber: string; businessName: string; occasions: string[] }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = (v: Values) => {
    window.open(waLink(waNumber, inquiryMessage(v, businessName)), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
      <label className="text-sm font-medium text-ink">
        Occasion
        <input list="occasion-list" {...register("occasion")} className={field} placeholder="Birthday, wedding, bridal shower…" />
        <datalist id="occasion-list">{occasions.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <label className="text-sm font-medium text-ink">
        Cake theme
        <input {...register("theme")} className={field} placeholder="e.g. floral, pastel, cartoon character" />
      </label>
      <label className="text-sm font-medium text-ink">
        Size or servings
        <input {...register("size")} className={field} placeholder="e.g. 2 pounds, or about 20 people" />
      </label>
      <label className="text-sm font-medium text-ink">
        Flavour preference
        <input {...register("flavor")} className={field} placeholder="e.g. chocolate, vanilla, red velvet" />
      </label>
      <label className="text-sm font-medium text-ink">
        Desired date
        <input type="date" min={today} {...register("date")} className={field} />
      </label>
      <label className="text-sm font-medium text-ink">
        Preferred design
        <input {...register("design")} className={field} placeholder="Describe it, or mention a design from our gallery" />
      </label>
      <label className="text-sm font-medium text-ink sm:col-span-2">
        Additional instructions
        <textarea rows={4} {...register("notes")} className={field} placeholder="Name on the cake, colours, allergies, delivery or pickup…" />
        {errors.notes && <span className="mt-1 block text-sm text-red-700">Please keep this under 800 characters.</span>}
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">All fields are optional. Nothing is stored. Your details open in WhatsApp for you to send.</p>
        <button type="submit" className="btn-wa shrink-0">
          <WhatsAppIcon /> Send on WhatsApp
        </button>
      </div>
    </form>
  );
}
