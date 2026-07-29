import Link from "next/link";
import Image from "next/image";
import { MAPS_URL, NAV, SITE, whatsappUrl } from "@/lib/site-config";
import { TIPOS_EVENTO } from "@/content/espaco";

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/**
 * O footer é a única coisa que aparece em 100% das páginas com o NAP completo.
 * Por isso ele carrega o endereço por extenso, o telefone e o link do mapa em
 * texto real (não só em ícone): é o que carimba a entidade a cada página
 * indexada.
 */
export function SiteFooter() {
  const { endereco, contato } = SITE;

  return (
    <footer className="no-print relative bg-oliva text-white overflow-hidden">
      <div className="absolute inset-0 pattern-claro opacity-10" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Marca + endereço */}
          <div>
            <Image
              src="/logos/logo-1.webp"
              alt="Dondoka Recepções"
              width={1200}
              height={341}
              sizes="160px"
              className="h-10 w-auto brightness-0 invert opacity-95"
            />
            <p className="mt-5 text-white/80 text-sm max-w-xs leading-relaxed">
              Espaço para eventos em Belo Horizonte, no Lindéia. Até {SITE.espaco.capacidadeMaxima} convidados,
              em dois ambientes climatizados e com cozinha equipada.
            </p>

            <address className="mt-6 not-italic text-sm text-white/80 space-y-1">
              <p>{endereco.logradouro}</p>
              <p>
                {endereco.bairro} — {endereco.cidade} / {endereco.estado}
              </p>
              <p>CEP {endereco.cep}</p>
            </address>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-white hover:text-creme transition"
            >
              <IconMapPin className="w-4 h-4" />
              Ver no mapa
            </a>
          </div>

          {/* Navegação.
              Os guias vivem só aqui: ficam fora do menu principal para não
              pesar na navegação, e seguem acessíveis para quem chega pelo
              Google. */}
          <nav aria-label="Rodapé — páginas">
            <p className="eyebrow text-white/85">Páginas</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/80 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guias" className="text-white/80 hover:text-white transition">
                  Guias
                </Link>
              </li>
            </ul>
          </nav>

          {/* Tipos de evento + contato */}
          <div>
            <nav aria-label="Rodapé — tipos de evento">
              <p className="eyebrow text-white/85">Tipos de evento</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {TIPOS_EVENTO.map((tipo) => (
                  <li key={tipo.id}>
                    <Link
                      href={`/eventos#${tipo.id}`}
                      className="text-white/80 hover:text-white transition"
                    >
                      {tipo.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="eyebrow text-white/85 mt-8">Fale com a gente</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition">
                  <IconWhatsApp className="w-4 h-4" />
                  {contato.telefone}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${contato.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition"
                >
                  <IconInstagram className="w-4 h-4" />@{contato.instagram}
                </a>
              </li>
              <li>
                <a href={`mailto:${contato.email}`} className="text-white/80 hover:text-white transition break-all">
                  {contato.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif italic text-white/90">{SITE.tagline}</p>
          <p className="text-[11px] tracking-wider uppercase text-white/60">
            © {new Date().getFullYear()} {SITE.nome}
          </p>
        </div>
      </div>
    </footer>
  );
}
