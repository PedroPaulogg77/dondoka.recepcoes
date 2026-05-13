"use client";
import type { ServicosOpcionaisDados } from "@/types/orcamento";

type Props = {
  value: ServicosOpcionaisDados;
  onChange: (v: ServicosOpcionaisDados) => void;
  isCustom?: boolean;
  onResetDefault?: () => void;
};

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
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg text-carvao">Serviços opcionais</h3>
        {onResetDefault && (
          <div className="flex items-center gap-2">
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
      </div>

      <label className="block">
        <span className="eyebrow text-bronze">Texto introdutório</span>
        <textarea
          rows={3}
          value={value.intro}
          onChange={(e) => onChange({ ...value, intro: e.target.value })}
          className="form-input mt-1.5"
        />
      </label>

      <fieldset className="border border-areia/60 rounded-xl p-4 md:p-5">
        <legend className="px-2 eyebrow text-bronze">Lista de serviços</legend>
        <div className="space-y-2">
          {value.lista.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={s}
                onChange={(e) => updateItem(i, e.target.value)}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="px-3 text-rose-500 hover:text-rose-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-oliva hover:text-bronze"
          >
            + Adicionar serviço
          </button>
        </div>
      </fieldset>

      <label className="block">
        <span className="eyebrow text-bronze">Aviso final</span>
        <textarea
          rows={2}
          value={value.disclaimer}
          onChange={(e) => onChange({ ...value, disclaimer: e.target.value })}
          className="form-input mt-1.5"
        />
      </label>
    </div>
  );
}
