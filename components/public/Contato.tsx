"use client";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import type { ConfigGlobal } from "@/types/orcamento";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function Contato({ config }: { config: ConfigGlobal }) {
  const items = [
    {
      label: "WhatsApp",
      value: config.contato_telefone,
      href: config.contato_whatsapp ? `https://wa.me/${config.contato_whatsapp}` : null,
    },
    {
      label: "Instagram",
      value: config.contato_instagram ? `@${config.contato_instagram}` : null,
      href: config.contato_instagram ? `https://instagram.com/${config.contato_instagram}` : null,
    },
    {
      label: "E-mail",
      value: config.contato_email,
      href: config.contato_email ? `mailto:${config.contato_email}` : null,
    },
    { label: "Endereço", value: config.contato_endereco, href: null },
  ].filter((i) => i.value);

  const whatsappHref = config.contato_whatsapp ? `https://wa.me/${config.contato_whatsapp}` : null;

  return (
    <section id="contato" className="relative py-24 md:py-32 px-6 bg-oliva text-white overflow-hidden">
      <div className="absolute inset-0 pattern-claro opacity-10" aria-hidden />
      <div className="relative max-w-4xl mx-auto text-center">
        <Reveal>
          <Image
            src="/logos/icone-1.png"
            alt=""
            width={1656}
            height={2050}
            quality={95}
            className="mx-auto h-20 w-auto brightness-0 invert opacity-95"
          />
          <p className="eyebrow mt-8 text-white/85">Obrigado pela escolha</p>
          <h2 className="mt-3 text-3xl md:text-5xl text-white font-serif italic">
            Celebre o essencial
          </h2>
          <p className="mt-4 text-white text-base md:text-lg max-w-lg mx-auto">
            Será um prazer fazer parte deste momento especial.
            <br />
            Vamos conversar?
          </p>
        </Reveal>

        {/* CTA principal — botão grande */}
        {whatsappHref && (
          <Reveal delay={0.15}>
            <div className="mt-10 no-print">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full bg-white text-oliva font-serif text-lg md:text-xl shadow-premium hover:bg-creme hover:-translate-y-0.5 transition-all"
              >
                <WhatsAppIcon className="w-6 h-6" />
                Falar pelo WhatsApp
              </a>
              <p className="mt-4 text-white/80 text-xs md:text-sm">
                Responderemos com atenção ao seu evento.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.3}>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="border border-white/30 rounded-2xl p-6 text-left hover:border-white/70 transition backdrop-blur-sm bg-white/5"
              >
                <div className="eyebrow text-white/85">{item.label}</div>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block font-serif text-lg text-white hover:text-creme break-words"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 font-serif text-lg text-white break-words">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
