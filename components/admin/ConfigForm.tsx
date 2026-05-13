"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FotosPicker } from "./FotosPicker";
import { BuffetEditor } from "./BuffetEditor";
import { ServicosEditor } from "./ServicosEditor";
import { SectionHelp } from "./SectionHelp";
import {
  BUFFET_FALLBACK,
  SERVICOS_FALLBACK,
  type ConfigGlobal,
  type BuffetDados,
  type ServicosOpcionaisDados,
} from "@/types/orcamento";

export function ConfigForm({ config }: { config: ConfigGlobal }) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    sobre_texto: config.sobre_texto || "",
    decoracao_texto: config.decoracao_texto || "",
    condicoes_pagamento: config.condicoes_pagamento || "",
    contato_telefone: config.contato_telefone || "",
    contato_whatsapp: config.contato_whatsapp || "",
    contato_instagram: config.contato_instagram || "",
    contato_email: config.contato_email || "",
    contato_endereco: config.contato_endereco || "",
    fotos_default: config.fotos_default || [],
    buffet_dados: (config.buffet_dados ?? BUFFET_FALLBACK) as BuffetDados,
    servicos_opcionais_dados: (config.servicos_opcionais_dados ?? SERVICOS_FALLBACK) as ServicosOpcionaisDados,
  });

  function up<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setOk(false);
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSalvando(false);
    if (res.ok) {
      setOk(true);
      router.refresh();
      setTimeout(() => setOk(false), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="eyebrow">Configurações</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-serif text-carvao">Defaults da apresentação</h1>
        <p className="mt-1 text-sm text-carvao/60">
          Estes valores aparecem em todos os orçamentos a menos que você sobrescreva no orçamento específico.
        </p>
      </div>

      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft space-y-5">
        <h2 className="font-serif text-xl text-carvao">Textos padrão</h2>
        <SectionHelp title="O que são estes textos padrão?">
          <p>São os textos institucionais que aparecem na maioria dos orçamentos. Você escreve uma vez aqui e eles entram automaticamente em todo orçamento novo.</p>
          <p>Em cada orçamento específico, você pode <b>customizar</b> editando diretamente lá — sem mexer no padrão. Esses padrões são a base.</p>
          <p><b>Condições de pagamento</b>: escreva em <b>2 parágrafos separados por linha em branco</b>. Cada parágrafo vira um cartão na proposta pública (forma de pagamento + reserva da data).</p>
        </SectionHelp>
        <TextField label="Sobre o espaço" value={form.sobre_texto} onChange={(v) => up("sobre_texto", v)} rows={8} />
        <TextField label="Decoração" value={form.decoracao_texto} onChange={(v) => up("decoracao_texto", v)} rows={6} />
        <TextField
          label="Condições de pagamento"
          value={form.condicoes_pagamento}
          onChange={(v) => up("condicoes_pagamento", v)}
          rows={5}
        />
      </section>

      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <BuffetEditor value={form.buffet_dados} onChange={(v) => up("buffet_dados", v)} />
        <SectionHelp title="Como o cardápio do buffet é usado?">
          <p>O que você define aqui vira a <b>versão padrão</b> do cardápio. Quando criar um orçamento e ligar a seção Buffet, vem com este conteúdo pronto.</p>
          <p>Em cada orçamento você pode adaptar (ex: incluir vegetariano pra um cliente específico) sem alterar o padrão.</p>
        </SectionHelp>
      </section>

      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <ServicosEditor
          value={form.servicos_opcionais_dados}
          onChange={(v) => up("servicos_opcionais_dados", v)}
        />
        <SectionHelp title="Como os serviços opcionais aparecem?">
          <p>Lista padrão de extras (segurança, garçons etc) que aparece em todos os orçamentos com a seção <b>Serviços opcionais</b> ligada (default ligada).</p>
          <p>Cada serviço ganha um ícone automático no visual da proposta. Os nomes são usados pra identificar o ícone — se mudar muito o nome, o sistema cai num ícone genérico.</p>
        </SectionHelp>
      </section>

      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <h2 className="font-serif text-xl text-carvao mb-2">Contato</h2>
        <SectionHelp title="Onde aparecem estes contatos">
          <p>Aparecem na <b>última seção verde da proposta</b> (Contato) e no botão flutuante de WhatsApp.</p>
          <p><b>WhatsApp</b>: só dígitos, com código do país (55 = Brasil). Ex: <code>5531972519129</code>. Sem espaços, sem parênteses.</p>
          <p><b>Telefone</b>: é só pra exibição. Pode ter formatação humana: <code>(31) 97251-9129</code>.</p>
        </SectionHelp>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-5">
          <SimpleField label="Telefone (exibição)" value={form.contato_telefone} onChange={(v) => up("contato_telefone", v)} placeholder="(31) 97251-9129" />
          <SimpleField label="WhatsApp (só dígitos com DDI)" value={form.contato_whatsapp} onChange={(v) => up("contato_whatsapp", v)} placeholder="5531972519129" />
          <SimpleField label="Instagram (sem @)" value={form.contato_instagram} onChange={(v) => up("contato_instagram", v)} placeholder="dondokarecepcoes" />
          <SimpleField label="Email" value={form.contato_email} onChange={(v) => up("contato_email", v)} placeholder="recepcoesdondoka@gmail.com" />
          <div className="md:col-span-2">
            <SimpleField label="Endereço" value={form.contato_endereco} onChange={(v) => up("contato_endereco", v)} />
          </div>
        </div>
      </section>

      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <h2 className="font-serif text-xl text-carvao mb-1">Fotos padrão</h2>
        <p className="text-sm text-carvao/55 mb-3">
          Fotos que aparecem por default em orçamentos novos.
        </p>
        <SectionHelp title="Quais fotos selecionar como padrão">
          <p>Estas fotos vêm pré-selecionadas em todo orçamento <b>novo</b>. Em cada orçamento você pode ajustar a galeria sem mexer aqui.</p>
          <p>Sugestão: deixe selecionadas as fotos que melhor mostram o espaço pronto (estrutura, mobiliário, vista geral) — fotos de decoração específica fica melhor mudar caso a caso.</p>
        </SectionHelp>
        <div className="mt-4">
          <FotosPicker selecionadas={form.fotos_default} onChange={(v) => up("fotos_default", v)} />
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-4 bg-white/90 backdrop-blur border-t border-areia/60 flex gap-3 justify-end items-center">
        {ok && <span className="text-sm text-emerald-600">Salvo!</span>}
        <Button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>

    </form>
  );
}

function SimpleField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-bronze">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input mt-1.5"
      />
    </label>
  );
}

function TextField({
  label, value, onChange, rows,
}: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <label className="block">
      <span className="eyebrow text-bronze">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input mt-1.5 min-h-[120px]"
      />
    </label>
  );
}
