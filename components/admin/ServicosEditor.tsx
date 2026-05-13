"use client";
import { iconForServico, SERVICOS_KEYWORDS } from "@/components/ui/Icons";
import type { ServicosOpcionaisDados } from "@/types/orcamento";

type Props = {
  value: ServicosOpcionaisDados;
  onChange: (v: ServicosOpcionaisDados) => void;
  isCustom?: boolean;
  onResetDefault?: () => void;
};

const PillBtn =
  "inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-oliva/30 text-oliva text-xs font-medium hover:bg-oliva/5 transition";
const IconBtn =
  "w-8 h-8 inline-flex items-center justify-center rounded-full text-carvao/40 hover:bg-rose-50 hover:text-rose-500 transition shrink-0";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ServicosEditor({ value, onChange, isCustom, onResetDefault }: Props) {
  function updateItem(idx: number, v: string) {
    const lista = [...value.lista];
    lista[idx] = v;
    onChange({ ...value, lista });
  }
  function addItem() {
    onChange({ ...value, lista: [...value.lista, ""] });
  }
  function removeItem(idx: number) {
    onChange({ ...value, lista: value.lista.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-5">
      {onResetDefault && (
        <div className="flex items-center justify-end gap-2">
          {isCustom ? (
            <>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-bronze/15 text-bronze">
                Customizado
              </span>
              <button
                type="button"
                onClick={onResetDefault}
                className="text-[11px] text-oliva hover:text-bronze underline-offset-4 hover:underline"
              >
                ↺ Voltar ao padrão
              </button>
            </>
          ) : (
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-oliva/10 text-oliva">
              Padrão
            </span>
          )}
        </div>
      )}

      <label className="block">
        <span className="eyebrow text-bronze">Texto introdutório</span>
        <textarea
          rows={3}
          value={value.intro}
          onChange={(e) => onChange({ ...value, intro: e.target.value })}
          className="form-input mt-1.5"
          placeholder="Aparece logo abaixo do título da seção..."
        />
      </label>

      <section className="bg-white border border-areia/50 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="eyebrow text-bronze block">Lista de serviços</span>
          <details className="text-[11px] text-oliva">
            <summary className="cursor-pointer hover:underline">Quais ícones existem?</summary>
            <div className="mt-2 -mx-1 p-3 rounded-xl bg-creme/70 border border-areia/50 text-carvao/70 leading-relaxed">
              O sistema detecta o ícone automaticamente pelo nome. Use palavras-chave como:
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                {SERVICOS_KEYWORDS.map((k) => {
                  const Icon = k.icon;
                  return (
                    <li key={k.iconName} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-oliva/10 text-oliva inline-flex items-center justify-center shrink-0">
                        <Icon className="w-3 h-3" />
                      </span>
                      <span className="truncate">{k.keywords[0]}…</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-[10px] text-carvao/55">
                Não reconhecido vira ⭐ estrela genérica.
              </p>
            </div>
          </details>
        </div>
        {value.lista.map((s, i) => {
          const Icon = iconForServico(s);
          return (
            <div key={i} className="flex gap-2 items-center">
              <span className="w-10 h-10 rounded-full bg-oliva/10 text-oliva inline-flex items-center justify-center shrink-0" aria-hidden>
                <Icon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={s}
                onChange={(e) => updateItem(i, e.target.value)}
                className="form-input flex-1"
                placeholder="Nome do serviço"
              />
              <button type="button" onClick={() => removeItem(i)} className={IconBtn} aria-label="Remover">
                <TrashIcon />
              </button>
            </div>
          );
        })}
        <button type="button" onClick={addItem} className={PillBtn}>
          <PlusIcon /> Adicionar serviço
        </button>
      </section>

      <label className="block">
        <span className="eyebrow text-bronze">Aviso final</span>
        <textarea
          rows={2}
          value={value.disclaimer}
          onChange={(e) => onChange({ ...value, disclaimer: e.target.value })}
          className="form-input mt-1.5"
          placeholder="Pequeno disclaimer abaixo da lista..."
        />
      </label>
    </div>
  );
}
