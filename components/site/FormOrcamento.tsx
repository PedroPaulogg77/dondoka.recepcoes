"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { whatsappUrl } from "@/lib/site-config";

export type LeadForm = {
  nome: string;
  whatsapp: string;
  email?: string;
  tipo_evento: string;
  data_pretendida?: string;
  convidados?: string;
  mensagem?: string;
  /** Honeypot: invisível para gente, irresistível para bot. */
  website?: string;
};

const TIPOS = [
  "Aniversário",
  "Festa de 15 anos",
  "Casamento ou mini wedding",
  "Evento corporativo",
  "Batizado ou chá",
  "Outro",
];

export function FormOrcamento() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadForm>();
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Registra de qual página o lead veio — mostra o que converte de verdade.
  const pathname = usePathname();

  async function onSubmit(dados: LeadForm) {
    setErro(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, origem: pathname }),
      });
      if (!res.ok) throw new Error("falha");
      setEnviado(true);
    } catch {
      setErro(
        "Não conseguimos enviar agora. Chame no WhatsApp que a gente responde na hora por lá."
      );
    }
  }

  if (enviado) {
    const nome = watch("nome")?.split(" ")[0];
    return (
      <div className="rounded-2xl border border-oliva/30 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-oliva/10 text-oliva">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl">Recebemos, {nome || "tudo certo"}!</h3>
        <p className="mt-3 text-carvao/70">
          A gente volta com o orçamento em breve. Se quiser adiantar, chame no WhatsApp. Costuma ser
          mais rápido.
        </p>
        <a
          href={whatsappUrl("Olá! Acabei de enviar um pedido de orçamento pelo site.")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-oliva px-7 py-3 text-sm font-medium text-white transition hover:bg-bronze"
        >
          Continuar no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-areia/60 bg-white p-6 shadow-soft md:p-8">
      {/* Honeypot — fora da vista e fora da navegação por teclado */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nome" className="eyebrow block">
            Seu nome *
          </label>
          <input
            id="nome"
            className="form-input mt-2"
            placeholder="Como podemos te chamar?"
            aria-invalid={!!errors.nome}
            {...register("nome", { required: "Precisamos do seu nome." })}
          />
          {errors.nome && <p className="mt-1.5 text-xs text-bronze">{errors.nome.message}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className="eyebrow block">
            WhatsApp *
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            className="form-input mt-2"
            placeholder="(31) 90000-0000"
            aria-invalid={!!errors.whatsapp}
            {...register("whatsapp", {
              required: "Precisamos de um telefone para responder.",
              minLength: { value: 10, message: "Telefone parece incompleto." },
            })}
          />
          {errors.whatsapp && <p className="mt-1.5 text-xs text-bronze">{errors.whatsapp.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="eyebrow block">
            E-mail
          </label>
          <input id="email" type="email" className="form-input mt-2" placeholder="opcional" {...register("email")} />
        </div>

        <div>
          <label htmlFor="tipo_evento" className="eyebrow block">
            Tipo de evento *
          </label>
          <select
            id="tipo_evento"
            className="form-input mt-2"
            defaultValue=""
            aria-invalid={!!errors.tipo_evento}
            {...register("tipo_evento", { required: "Escolha o tipo de evento." })}
          >
            <option value="" disabled>
              Selecione
            </option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tipo_evento && <p className="mt-1.5 text-xs text-bronze">{errors.tipo_evento.message}</p>}
        </div>

        <div>
          <label htmlFor="data_pretendida" className="eyebrow block">
            Data pretendida
          </label>
          <input id="data_pretendida" type="date" className="form-input mt-2" {...register("data_pretendida")} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="convidados" className="eyebrow block">
            Quantos convidados
          </label>
          <input
            id="convidados"
            type="number"
            min={1}
            max={70}
            className="form-input mt-2"
            placeholder="O espaço comporta até 70"
            {...register("convidados")}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="mensagem" className="eyebrow block">
            Alguma observação?
          </label>
          <textarea
            id="mensagem"
            rows={4}
            className="form-input mt-2"
            placeholder="Tema, horário, se precisa de buffet…"
            {...register("mensagem")}
          />
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-5 rounded-xl bg-bronze/10 px-4 py-3 text-sm text-bronze">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-oliva py-4 font-medium text-white shadow-soft transition hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando…" : "Solicitar orçamento"}
      </button>

      <p className="mt-4 text-center text-xs text-carvao/50">
        Seus dados são usados só para responder este pedido.
      </p>
    </form>
  );
}
