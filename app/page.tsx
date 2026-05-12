import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center bg-creme">
      <div className="absolute inset-0 pattern-claro opacity-40" aria-hidden />
      <div className="relative max-w-xl">
        <Image
          src="/logos/logo-1.png"
          alt="Dondoka Recepções"
          width={260}
          height={260}
          className="mx-auto h-36 w-auto"
        />
        <p className="eyebrow mt-8">Sistema de propostas</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-serif text-carvao leading-tight">
          Celebre o <span className="italic text-oliva">essencial</span>
        </h1>
        <p className="mt-5 text-carvao/70">
          Este é o sistema interno de propostas da Dondoka Recepções. Cada cliente recebe
          um link único com sua proposta personalizada.
        </p>
        <div className="mt-10">
          <Link
            href="/admin"
            className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-oliva text-white hover:bg-bronze transition font-medium text-sm"
          >
            Acessar painel
          </Link>
        </div>
      </div>
    </main>
  );
}
