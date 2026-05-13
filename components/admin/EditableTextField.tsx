"use client";

type Props = {
  label: string;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
};

export function EditableTextField({ label, value, defaultValue, onChange, rows = 6, hint }: Props) {
  const isUsingDefault = value === (defaultValue || "");
  const isCustom = !isUsingDefault && value.trim().length > 0;

  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="eyebrow text-bronze">{label}</span>
        <div className="flex items-center gap-2">
          {isUsingDefault ? (
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-oliva/10 text-oliva">
              Padrão
            </span>
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-bronze/15 text-bronze">
                Customizado
              </span>
              <button
                type="button"
                onClick={() => onChange(defaultValue || "")}
                className="text-[11px] text-oliva hover:text-bronze underline-offset-4 hover:underline"
              >
                ↺ Voltar ao padrão
              </button>
            </>
          )}
        </div>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input min-h-[140px]"
      />
      {hint && <p className="mt-1 text-[11px] text-carvao/50">{hint}</p>}
      {/* Sinal visual sutil de customização */}
      <span className="sr-only">
        {isCustom ? "Conteúdo personalizado neste orçamento" : "Usando o texto padrão das configurações"}
      </span>
    </label>
  );
}
