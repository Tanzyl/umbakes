import { Reveal } from "./Reveal";

export function SectionHeading({ eyebrow, title, subtitle, align = "center", action }: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
}) {
  const center = align === "center";
  return (
    <Reveal className={`mb-10 flex flex-col gap-4 sm:mb-14 ${center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-xl"}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-4xl font-semibold sm:text-5xl">{title}</h2>
        {subtitle && <p className="mt-4 text-[17px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  );
}
