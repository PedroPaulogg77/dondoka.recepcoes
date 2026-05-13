"use client";
import { Drawer } from "../Drawer";
import type { FormState } from "@/lib/orcamento-helpers";
import type { StatusOrcamento } from "@/types/orcamento";

const STATUS_OPTIONS: StatusOrcamento[] = ["rascunho", "enviado", "aceito", "recusado"];

type Props = {
  open: boolean;
  onClose: () => void;
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onUndo?: () => void;
};

export function DrawerCliente({ open, onClose, form, update, onUndo }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Dados do cliente e evento"
      subtitle="Aparecem no topo e na seção 'Dados do evento' da proposta"
      onUndo={onUndo}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Cliente" required>
          <input
            type="text"
            required
            value={form.cliente_nome}
            onChange={(e) => update("cliente_nome", e.target.value)}
            className="form-input"
            autoFocus
          />
        </Field>
        <Field label="Tipo de evento">
          <input
            type="text"
            placeholder="Aniversário, casamento, corporativo..."
            value={form.cliente_evento}
            onChange={(e) => update("cliente_evento", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Data">
          <input
            type="date"
            value={form.cliente_data}
            onChange={(e) => update("cliente_data", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Horário">
          <input
            type="text"
            placeholder="Ex: 19h às 23h"
            value={form.cliente_horario}
            onChange={(e) => update("cliente_horario", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Convidados">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={form.cliente_convidados || ""}
            onChange={(e) => update("cliente_convidados", Number(e.target.value) || 0)}
            className="form-input"
          />
        </Field>
        <Field label="Status (uso interno)">
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as StatusOrcamento)}
            className="form-input capitalize"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Drawer>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow text-bronze">
        {label}
        {required && <span className="text-rose-500 normal-case tracking-normal ml-1">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
