"use client";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import type { ConfigGlobal } from "@/types/orcamento";

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

  return (
    <section id="contato" className="relative py-24 md:py-32 px-6 bg-oliva text-white overflow-hidden">
      <div className="absolute inset-0 pattern-claro opacity-10" aria-hidden />
      <div className="relative max-w-4xl mx-auto text-center">
        <Reveal>
          <Image
            src="/logos/icone-1.png"
            alt=""
            width={120}
            height={120}
            className="mx-auto h-20 w-auto brightness-0 invert opacity-95"
          />
          <p className="eyebrow mt-8 text-white/70">Obrigado pela escolha</p>
          <h2 className="mt-3 text-3xl md:text-5xl text-white font-serif italic">
            Celebre o essencial
          </h2>
          <p className="mt-4 text-white/85 max-w-lg mx-auto">
            Será um prazer fazer parte deste momento especial. Vamos conversar?
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="border border-white/25 rounded-2xl p-6 text-left hover:border-white/60 transition backdrop-blur-sm"
              >
                <div className="eyebrow text-white/60">{item.label}</div>
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
