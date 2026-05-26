"use client";
import { useRef } from "react";
import type { PrecosEspacoPorDia } from "@/types/orcamento";
import { TIER_LABELS, type TierDia } from "@/lib/format";

type Props = {
  value: PrecosEspacoPorDia | null;
  onChange: (v: PrecosEspacoPorDia | null) => void;
  /** Quando `true`, mostra o badge "Padrão / Customizado" + botão restaurar */
  showResetVsDefault?: boolean;
  /** Valor padrão (do config global) — só usado se `showResetVsDefault` */
  defaultValue?: PrecosEspacoPorDia | null;
};

const TIERS: TierDia[] = ["seg_qui", "sex", "sab_dom"];

const EMPTY: PrecosEspacoPorDia = { seg_qui: null, sex: null, sab_dom: null };

function deepEqual(a: PrecosEspacoPorDia | null, b: PrecosEspacoPorDia | null): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function EspacoPrecosEditor({
  value,
  onChange,
  showResetVsDefault = false,
  defaultValue = null,
}: Props) {
  // Guarda último valor preenchido — pra restaurar se o usuário desligar e religar o toggle
  const lastFilled = useRef<PrecosEspacoPorDia | null>(value);
  if (value) lastFilled.current = value;

  const ativo = value !== null;
  const isCustom = showResetVsDefault && !deepEqual(value, defaultValue);

  function toggle() {
    if (ativo) {
      // Desligando — guarda o que tinha e seta null
      if (value) lastFilled.current = value;
      onChange(null);
    } else {
      // Ligando — restaura o último valor ou começa vazio
      onChange(lastFilled.current ?? EMPTY);
    }
  }

  function updateTier(tier: TierDia, raw: string) {
    const num = raw.trim() === "" ? null : Number(raw.replace(",", "."));
    const next: PrecosEspacoPorDia = {
      seg_qui: value?.seg_qui ?? null,
      sex: value?.sex ?? null,
      sab_dom: value?.sab_dom ?? null,
      [tier]: num != null && Number.isFinite(num) ? num : null,
    };
    onChange(next);
  }

  return (
    <div className="rounded-2xl border border-areia/60 bg-areia/20 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base md:text-lg text-carvao">
              Aluguel por dia da semana
            </h3>
            {showResetVsDefault && ativo && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase ${
                  isCustom
                    ? "bg-bronze/15 text-bronze"
                    : "bg-oliva/15 text-oliva"
                }`}
              >
                {isCustom ? "Customizado" : "Padrão"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-carvao/60 leading-relaxed">
            O cliente vê as 3 faixas como informação — escolhe o dia e soma o valor correspondente.
            Esses valores não entram no total geral.
          </p>
        </div>

        {/* Toggle ativo/inativo */}
        <button
          type="button"
          role="switch"
          aria-checked={ativo}
          onClick={toggle}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
            ativo ? "bg-oliva" : "bg-areia"
          }`}
          aria-label={ativo ? "Desativar faixas por dia" : "Ativar faixas por dia"}
        >
          <span
            className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition ${
              ativo ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {ativo && value && (
        <div className="mt-4 space-y-3">
          {TIERS.map((tier) => (
            <label key={tier} className="flex items-center gap-3">
              <span className="flex-1 text-sm text-carvao/80">{TIER_LABELS[tier]}</span>
              <div className="relative shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-carvao/40 pointer-events-none">
                  R$
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={50}
                  value={value[tier] ?? ""}
                  onChange={(e) => updateTier(tier, e.target.value)}
                  placeholder="0"
                  className="form-input w-32 pl-9 tabular-nums text-right"
                />
              </div>
            </label>
          ))}

          {showResetVsDefault && isCustom && defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className="text-xs text-bronze hover:text-oliva transition"
            >
              ↺ Restaurar padrão
            </button>
          )}
        </div>
      )}
    </div>
  );
}
