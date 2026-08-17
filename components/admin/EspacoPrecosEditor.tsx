"use client";
import { useRef, useState } from "react";
import type { PrecosEspacoPorDia } from "@/types/orcamento";
import { TIER_LABELS, type TierDia } from "@/lib/format";
import { FAIXAS_DESLIGADAS, temFaixasAtivas, valorUnicoEspaco } from "@/lib/orcamento-helpers";

type Modo = "unico" | "porDia";

type Props = {
  value: PrecosEspacoPorDia | null;
  onChange: (v: PrecosEspacoPorDia | null) => void;
  /** Quando `true`, mostra o badge "Padrão / Customizado" + botão restaurar */
  showResetVsDefault?: boolean;
  /** Valor padrão (do config global) — só usado se `showResetVsDefault` */
  defaultValue?: PrecosEspacoPorDia | null;
};

const TIERS: TierDia[] = ["seg_qui", "sex", "sab_dom"];

function deepEqual(a: PrecosEspacoPorDia | null, b: PrecosEspacoPorDia | null): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function EspacoPrecosEditor({
  value,
  onChange,
  showResetVsDefault = false,
  defaultValue = null,
}: Props) {
  // Guarda o último valor preenchido, pra restaurar se desligar e religar.
  const lastFilled = useRef<PrecosEspacoPorDia | null>(
    temFaixasAtivas(value) ? value : null
  );
  if (temFaixasAtivas(value)) lastFilled.current = value;

  /**
   * O ligado/desligado é estado local, não derivado do valor.
   *
   * Derivar de "tem algum valor preenchido" faria o toggle pular sozinho para
   * desligado no instante em que ele apagasse os três campos para redigitar.
   * Derivar de "não é null" não funciona mais, porque desligado agora grava um
   * objeto de faixas nulas em vez de null.
   */
  const [ativo, setAtivo] = useState(() => temFaixasAtivas(value));
  /** Começa em "único" quando o que está salvo tem os três dias iguais. */
  const [modo, setModo] = useState<Modo>(() =>
    valorUnicoEspaco(value) != null || !temFaixasAtivas(value) ? "unico" : "porDia"
  );
  const isCustom = showResetVsDefault && !deepEqual(value, defaultValue);

  function toggle() {
    if (ativo) {
      if (temFaixasAtivas(value)) lastFilled.current = value;
      setAtivo(false);
      // FAIXAS_DESLIGADAS em vez de null: null quer dizer "herdar o padrão".
      onChange(FAIXAS_DESLIGADAS);
    } else {
      setAtivo(true);
      onChange(lastFilled.current ?? FAIXAS_DESLIGADAS);
    }
  }

  function parse(raw: string): number | null {
    const num = raw.trim() === "" ? null : Number(raw.replace(",", "."));
    return num != null && Number.isFinite(num) ? num : null;
  }

  function updateTier(tier: TierDia, raw: string) {
    const next: PrecosEspacoPorDia = {
      seg_qui: value?.seg_qui ?? null,
      sex: value?.sex ?? null,
      sab_dom: value?.sab_dom ?? null,
      [tier]: parse(raw),
    };
    onChange(next);
  }

  /** Valor único escreve o mesmo número nos três campos. */
  function updateUnico(raw: string) {
    const num = parse(raw);
    onChange({ seg_qui: num, sex: num, sab_dom: num });
  }

  function trocarModo(novo: Modo) {
    setModo(novo);
    if (novo === "unico") {
      // Leva o primeiro valor preenchido para os três, sem inventar número.
      const primeiro =
        value?.seg_qui ?? value?.sex ?? value?.sab_dom ?? null;
      onChange({ seg_qui: primeiro, sex: primeiro, sab_dom: primeiro });
    }
  }

  return (
    <div className="rounded-2xl border border-areia/60 bg-areia/20 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base md:text-lg text-carvao">
              Aluguel do espaço
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
            {modo === "unico"
              ? "Um valor só, igual em qualquer dia. Entra no total geral da proposta como qualquer outro item."
              : "O cliente vê as 3 faixas como informação, escolhe o dia e soma o valor correspondente. Nesse modo o aluguel não entra no total geral."}
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
          {/* Escolha entre cobrar o mesmo todo dia ou variar por dia da semana */}
          <div className="flex gap-1 p-1 rounded-full bg-white/70 w-fit">
            {([
              { key: "unico" as const, label: "Mesmo valor todo dia" },
              { key: "porDia" as const, label: "Varia por dia" },
            ]).map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => trocarModo(m.key)}
                className={`px-3 h-8 rounded-full text-xs transition ${
                  modo === m.key
                    ? "bg-oliva text-white font-medium"
                    : "text-carvao/60 hover:text-carvao"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {modo === "unico" ? (
            <label className="flex items-center gap-3">
              <span className="flex-1 text-sm text-carvao/80">Aluguel do espaço</span>
              <div className="relative shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-carvao/40 pointer-events-none">
                  R$
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={50}
                  value={value.seg_qui ?? ""}
                  onChange={(e) => updateUnico(e.target.value)}
                  placeholder="0"
                  className="form-input w-32 pl-9 tabular-nums text-right"
                  autoFocus={false}
                />
              </div>
            </label>
          ) : (
            TIERS.map((tier) => (
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
            ))
          )}

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
