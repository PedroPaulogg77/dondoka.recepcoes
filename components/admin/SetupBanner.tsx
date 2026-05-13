import Link from "next/link";
import type { ConfigGlobal } from "@/types/orcamento";

type CheckItem = { label: string; done: boolean };

function getChecklist(config: ConfigGlobal | null): CheckItem[] {
  if (!config) {
    return [
      { label: "Configurar dados de contato", done: false },
      { label: "Adicionar fotos do espaço", done: false },
      { label: "Escrever texto sobre o Dondoka", done: false },
      { label: "Definir condições de pagamento", done: false },
    ];
  }
  return [
    {
      label: "WhatsApp de contato",
      done: !!config.contato_whatsapp?.trim(),
    },
    {
      label: "Telefone de contato",
      done: !!config.contato_telefone?.trim(),
    },
    {
      label: "Fotos do espaço",
      done: (config.fotos_default?.length ?? 0) > 0,
    },
    {
      label: "Texto sobre o Dondoka",
      done: !!config.sobre_texto?.trim(),
    },
    {
      label: "Condições de pagamento",
      done: !!config.condicoes_pagamento?.trim(),
    },
    {
      label: "Endereço",
      done: !!config.contato_endereco?.trim(),
    },
  ];
}

export function SetupBanner({ config }: { config: ConfigGlobal | null }) {
  const checklist = getChecklist(config);
  const pending = checklist.filter((c) => !c.done);

  if (pending.length === 0) return null;

  const done = checklist.filter((c) => c.done).length;
  const total = checklist.length;

  return (
    <div className="rounded-2xl bg-oliva/10 border border-oliva/30 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
          {/* Settings gear icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-oliva">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-lg text-carvao">
            Configure o Dondoka antes de criar propostas
          </h2>
          <p className="mt-1 text-sm text-carvao/60">
            {done} de {total} itens configurados. Preencha tudo para que as
            propostas saiam completas.
          </p>

          <ul className="mt-4 space-y-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-oliva flex-shrink-0 inline-block">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-carvao/25 flex-shrink-0 inline-block" />
                )}
                <span className={item.done ? "text-carvao/50 line-through" : "text-carvao"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/admin/configuracoes"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-oliva text-white text-sm font-medium hover:bg-bronze transition"
          >
            Ir para Configurações
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
