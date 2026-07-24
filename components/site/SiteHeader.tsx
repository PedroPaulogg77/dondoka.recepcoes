"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/format";
import { NAV, NAV_EVENTOS, whatsappUrl } from "@/lib/site-config";

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function SiteHeader() {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [eventosAberto, setEventosAberto] = useState(false);
  const pathname = usePathname();
  const reduz = useReducedMotion();

  /**
   * No topo da página o header é transparente e fica sobre o hero, que é uma
   * foto escurecida. Então tudo nele precisa ser claro: logo invertido para
   * branco, links brancos, CTA em branco sólido.
   *
   * Ao rolar, o fundo creme entra e tudo volta à cor normal.
   *
   * Isso exige que TODA página do site comece com um hero escuro — inclusive
   * /guias. Se alguma página nova começar com fundo claro no topo, o header
   * fica ilegível nela.
   */
  const sobreHero = !rolou;

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao navegar — sem isso o drawer fica aberto por cima da
  // página nova no mobile.
  useEffect(() => {
    setMenuAberto(false);
    setEventosAberto(false);
  }, [pathname]);

  // Trava o scroll do body enquanto o drawer está aberto.
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuAberto]);

  const ativo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "no-print fixed top-0 inset-x-0 z-50 transition-all duration-300",
          rolou ? "bg-creme/90 backdrop-blur border-b border-areia/50 shadow-soft" : "bg-transparent"
        )}
      >
        {/* Véu escuro sob o header enquanto ele é transparente: garante contraste
            do texto branco mesmo quando a foto do hero tem uma área clara logo
            abaixo (céu, parede branca). Some assim que o fundo creme entra. */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-carvao/55 to-transparent transition-opacity duration-300",
            rolou ? "opacity-0" : "opacity-100"
          )}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-5 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="Dondoka Recepções — início">
            <Image
              src="/logos/logo-1.webp"
              alt="Dondoka Recepções"
              width={1200}
              height={341}
              priority
              sizes="160px"
              className={cn(
                "h-8 md:h-10 w-auto transition-[filter] duration-300",
                // O logo é escuro (oliva). Sobre a foto do hero ele some, então
                // vira branco sólido; com o fundo creme, volta ao original.
                sobreHero && "brightness-0 invert"
              )}
            />
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            <div
              className="relative"
              onMouseEnter={() => setEventosAberto(true)}
              onMouseLeave={() => setEventosAberto(false)}
            >
              <button
                type="button"
                onClick={() => setEventosAberto((v) => !v)}
                aria-expanded={eventosAberto}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-full transition",
                  sobreHero
                    ? "text-white/90 hover:text-white"
                    : pathname.startsWith("/eventos")
                      ? "text-oliva"
                      : "text-carvao/70 hover:text-oliva"
                )}
              >
                Tipos de evento
                <IconChevron className={cn("w-3.5 h-3.5 transition-transform", eventosAberto && "rotate-180")} />
              </button>

              <AnimatePresence>
                {eventosAberto && (
                  <motion.div
                    initial={{ opacity: 0, y: reduz ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduz ? 0 : 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full pt-2 w-64"
                  >
                    <div className="rounded-2xl bg-white border border-areia/60 shadow-premium p-2">
                      {NAV_EVENTOS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "block px-3 py-2.5 rounded-xl text-sm transition",
                            ativo(item.href) ? "bg-oliva/10 text-oliva" : "text-carvao/75 hover:bg-areia/30 hover:text-oliva"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-full transition",
                  sobreHero
                    ? "text-white/90 hover:text-white"
                    : ativo(item.href)
                      ? "text-oliva"
                      : "text-carvao/70 hover:text-oliva"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "hidden sm:inline-flex h-10 md:h-11 px-5 md:px-6 items-center justify-center rounded-full text-sm font-medium shadow-soft transition",
                sobreHero
                  ? "bg-white text-oliva hover:bg-creme"
                  : "bg-oliva text-white hover:bg-bronze"
              )}
            >
              Solicitar orçamento
            </a>

            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              className={cn(
                "lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition",
                sobreHero ? "text-white hover:bg-white/15" : "text-carvao hover:bg-areia/40"
              )}
              aria-label="Abrir menu"
            >
              <IconMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="absolute inset-0 bg-carvao/40 backdrop-blur-sm" onClick={() => setMenuAberto(false)} />

            <motion.nav
              initial={{ x: reduz ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduz ? 0 : "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 inset-y-0 w-[86%] max-w-sm bg-creme shadow-premium flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-areia/50">
                <Image src="/logos/logo-1.webp" alt="" width={1200} height={341} className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuAberto(false)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-carvao hover:bg-areia/40 transition"
                  aria-label="Fechar menu"
                >
                  <IconClose className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 px-5 py-6">
                <p className="eyebrow">Tipos de evento</p>
                <div className="mt-3 space-y-1">
                  {NAV_EVENTOS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block py-2.5 font-serif text-lg transition",
                        ativo(item.href) ? "text-oliva" : "text-carvao hover:text-oliva"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="my-6 h-px bg-areia/60" />

                <div className="space-y-1">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block py-2.5 font-serif text-lg transition",
                        ativo(item.href) ? "text-oliva" : "text-carvao hover:text-oliva"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-5 pb-8">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 items-center justify-center rounded-full bg-oliva text-white font-medium hover:bg-bronze transition shadow-soft"
                >
                  Solicitar orçamento
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
