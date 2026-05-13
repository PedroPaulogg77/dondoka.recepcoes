"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CriarExemploButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/admin/orcamentos/exemplo", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      alert("Erro ao criar exemplo. Verifique se você está logado.");
      return;
    }
    const data = await res.json();
    router.push(`/admin/${data.id}`);
    router.refresh();
  }

  return (
    <Button size="lg" variant="outline" onClick={handleClick} disabled={loading} type="button">
      {loading ? "Criando..." : "Criar orçamento de exemplo"}
    </Button>
  );
}
