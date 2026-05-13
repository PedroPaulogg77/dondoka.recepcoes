"use client";
import { Drawer } from "../Drawer";

type Props = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onUndo?: () => void;
};

export function DrawerObservacoes({ open, onClose, value, onChange, onUndo }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Observações internas"
      subtitle="Anotações suas — não aparecem pro cliente"
      onUndo={onUndo}
    >
      <label className="block">
        <span className="eyebrow text-bronze">Notas</span>
        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Alergias, preferências, decisões de negociação, lembretes..."
          className="form-input mt-1.5 min-h-[180px]"
        />
      </label>
      <p className="mt-3 text-xs text-carvao/55">
        Os <b>contatos</b> (WhatsApp, Instagram, e-mail, endereço) que aparecem na seção Contato
        são globais — edite em <b>Configurações → Contato</b>.
      </p>
    </Drawer>
  );
}
