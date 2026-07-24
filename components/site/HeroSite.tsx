import { Foto } from "@/components/site/Foto";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";
import { whatsappUrl } from "@/lib/site-config";

type Props = {
  eyebrow: string;
  /** O H1 da página. `destaque` sai em itálico oliva, o padrão da marca. */
  titulo: string;
  destaque?: string;
  subtitulo: string;
  foto: string;
  fotoAlt: string;
  /** `alto` = home (tela cheia). `medio` = páginas internas. */
  altura?: "alto" | "medio";
  ctaSecundario?: { href: string; label: string };
  mensagemWhatsapp?: string;
};

export function HeroSite({
  eyebrow,
  titulo,
  destaque,
  subtitulo,
  foto,
  fotoAlt,
  altura = "medio",
  ctaSecundario,
  mensagemWhatsapp,
}: Props) {
  return (
    <section
      className={cn(
        "relative -mt-16 flex items-center justify-center overflow-hidden md:-mt-20",
        altura === "alto" ? "min-h-[100svh]" : "min-h-[72svh] md:min-h-[68svh]"
      )}
    >
      <Foto
        src={foto}
        alt={fotoAlt}
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover"
      />
      {/* Escurecimento em gradiente: garante contraste AA do texto branco sobre
          qualquer parte da foto, e emenda no creme da seção seguinte. */}
      <div className="absolute inset-0 bg-gradient-to-b from-carvao/65 via-carvao/45 to-carvao/70" aria-hidden />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-28 text-center md:pt-32">
        <Reveal>
          <p className="eyebrow text-white/85">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-white md:text-6xl">
            {titulo}
            {destaque && (
              <>
                {" "}
                <span className="italic text-areia">{destaque}</span>
              </>
            )}
          </h1>

          <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="block h-px w-10 bg-areia/60" />
            <span className="text-sm text-areia">◆</span>
            <span className="block h-px w-10 bg-areia/60" />
          </div>

          <p className="mx-auto mt-6 max-w-xl text-base text-white/90 md:text-lg">{subtitulo}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl(mensagemWhatsapp)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-oliva px-8 py-4 font-medium text-white shadow-premium transition-all hover:-translate-y-0.5 hover:bg-bronze sm:w-auto"
            >
              Solicitar orçamento
            </a>
            {ctaSecundario && (
              <Link
                href={ctaSecundario.href}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/50 bg-white/5 px-8 py-4 text-sm text-white backdrop-blur-sm transition hover:border-white hover:bg-white/15 sm:w-auto"
              >
                {ctaSecundario.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
