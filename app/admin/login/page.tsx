"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      setErro("Email ou senha incorretos.");
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-creme relative">
      <div className="absolute inset-0 pattern-claro opacity-30" aria-hidden />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-white border border-areia/60 rounded-2xl p-8 md:p-10 shadow-premium"
      >
        <Image
          src="/logos/logo-1.png"
          alt="Dondoka"
          width={120}
          height={120}
          className="mx-auto h-20 w-auto mb-6"
        />
        <h1 className="text-2xl text-center font-serif">Painel administrativo</h1>
        <p className="text-center text-sm text-carvao/60 mt-1">Entre para gerenciar os orçamentos</p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="eyebrow text-bronze">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-11 px-4 rounded-lg border border-areia/70 bg-creme focus:border-oliva focus:outline-none"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="eyebrow text-bronze">Senha</span>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full h-11 px-4 rounded-lg border border-areia/70 bg-creme focus:border-oliva focus:outline-none"
              autoComplete="current-password"
            />
          </label>
        </div>

        {erro && <p className="mt-4 text-sm text-red-600 text-center">{erro}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </main>
  );
}
