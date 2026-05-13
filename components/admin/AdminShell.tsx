"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/format";
import { GuiaUso } from "./GuiaUso";

const NAV = [
  { href: "/admin", label: "Orçamentos" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-creme">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-areia/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo — shrink-0 para não ser comprimido pelos itens do nav */}
          <Link href="/admin" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logos/icone-1.png"
              alt="Dondoka"
              width={32}
              height={32}
              className="h-8 w-8 object-contain shrink-0"
            />
            <span className="font-serif text-base text-carvao hidden md:inline">Dondoka · Admin</span>
          </Link>

          <nav className="flex items-center gap-0.5 shrink-0">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
              const isActive = n.href === "/admin" ? pathname === "/admin" : active;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "px-2.5 md:px-4 h-9 inline-flex items-center rounded-full text-sm transition whitespace-nowrap",
                    isActive ? "bg-oliva text-white" : "text-carvao/70 hover:bg-areia/40"
                  )}
                >
                  {/* Label curto no mobile, completo no desktop */}
                  <span className="sm:hidden">
                    {n.href === "/admin" ? "Propostas" : "Config"}
                  </span>
                  <span className="hidden sm:inline">{n.label}</span>
                </Link>
              );
            })}
            <GuiaUso />
            <button
              onClick={logout}
              className="ml-0.5 px-2.5 md:px-3 h-9 text-sm text-carvao/60 hover:text-carvao whitespace-nowrap"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">{children}</div>
    </div>
  );
}
