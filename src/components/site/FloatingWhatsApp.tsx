import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-[#1f7a4d] text-white shadow-lift transition-transform duration-200 hover:scale-105 hover:bg-[#17603c] sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 rounded-full bg-[#1f7a4d] opacity-40 motion-safe:animate-[ping_2.4s_ease-out_3]" aria-hidden />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
