"use client";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { ConfigGlobal } from "@/types/orcamento";

/* ===== Ícones ===== */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ===== Card de link ===== */

type LinkItem = {
  label: string;
  sub: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
};

function LinkCard({ item, delay = 0 }: { item: LinkItem; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer" : undefined}
        className="group relative flex items-center gap-4 w-full px-4 py-4 md:px-5 md:py-5 rounded-2xl bg-white border border-areia/60 shadow-soft hover:shadow-premium hover:-translate-y-0.5 hover:border-oliva/40 transition-all"
      >
        {/* Ícone */}
        <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-oliva/10 text-oliva group-hover:bg-oliva group-hover:text-white transition-colors">
          {item.icon}
        </span>

        {/* Texto */}
        <span className="flex-1 min-w-0 text-left">
          <span className="block font-serif text-base md:text-lg text-carvao truncate">
            {item.label}
          </span>
          <span className="block text-xs md:text-sm text-carvao/55 truncate">
            {item.sub}
          </span>
        </span>

        {/* Seta */}
        <ChevronIcon className="shrink-0 w-4 h-4 text-bronze/60 group-hover:text-oliva group-hover:translate-x-0.5 transition-all" />
      </a>
    </Reveal>
  );
}

/* ===== Página ===== */

export function LinksPage({ config }: { config: ConfigGlobal }) {
  const items: LinkItem[] = [];

  if (config.contato_whatsapp) {
    items.push({
      label: "WhatsApp",
      sub: config.contato_telefone || "Fale com a gente agora",
      href: `https://wa.me/${config.contato_whatsapp}?text=${encodeURIComponent(
        "Olá! Tenho interesse no espaço da Dondoka Recepções."
      )}`,
      icon: <WhatsAppIcon className="w-6 h-6" />,
      external: true,
    });
  }

  if (config.contato_instagram) {
    items.push({
      label: "Instagram",
      sub: `@${config.contato_instagram}`,
      href: `https://instagram.com/${config.contato_instagram}`,
      icon: <InstagramIcon className="w-6 h-6" />,
      external: true,
    });
  }

  if (config.contato_endereco) {
    items.push({
      label: "Como chegar",
      sub: config.contato_endereco,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        config.contato_endereco
      )}`,
      icon: <MapPinIcon className="w-6 h-6" />,
      external: true,
    });
  }

  if (config.contato_telefone) {
    const digits = config.contato_telefone.replace(/\D/g, "");
    items.push({
      label: "Ligar",
      sub: config.contato_telefone,
      href: `tel:${digits}`,
      icon: <PhoneIcon className="w-6 h-6" />,
    });
  }

  if (config.contato_email) {
    items.push({
      label: "E-mail",
      sub: config.contato_email,
      href: `mailto:${config.contato_email}`,
      icon: <MailIcon className="w-6 h-6" />,
    });
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-creme px-5 py-12 md:py-16 overflow-hidden">
      {/* Padrão de fundo sutil */}
      <div className="absolute inset-0 pattern-claro opacity-30 pointer-events-none" aria-hidden />

      {/* Halo oliva no topo */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at center, rgba(127,121,87,0.18) 0%, rgba(127,121,87,0) 60%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        {/* Cabeçalho */}
        <Reveal>
          <div className="text-center">
            <Image
              src="/logos/logo-1.png"
              alt="Dondoka Recepções"
              width={260}
              height={260}
              priority
              className="mx-auto h-24 md:h-28 w-auto"
            />
            <p className="eyebrow mt-6">Dondoka Recepções</p>
            <h1 className="mt-3 font-serif text-3xl md:text-4xl text-carvao leading-tight">
              Celebre o <span className="italic text-oliva">essencial</span>
            </h1>

            {/* Ornamento */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="block h-px w-10 bg-bronze/40" />
              <span className="text-bronze text-sm" aria-hidden>◆</span>
              <span className="block h-px w-10 bg-bronze/40" />
            </div>

            <p className="mt-5 text-carvao/65 text-sm md:text-base max-w-xs mx-auto">
              Espaço premium para celebrações em Belo Horizonte. Escolha por onde prefere falar com a gente.
            </p>
          </div>
        </Reveal>

        {/* Lista de links */}
        <div className="mt-10 space-y-3">
          {items.map((item, i) => (
            <LinkCard key={item.label} item={item} delay={0.05 + i * 0.05} />
          ))}
        </div>

        {/* Rodapé */}
        <Reveal delay={0.4}>
          <footer className="mt-12 text-center">
            <p className="text-[11px] text-carvao/40 tracking-wider uppercase">
              © {new Date().getFullYear()} Dondoka Recepções
            </p>
          </footer>
        </Reveal>
      </div>
    </main>
  );
}
