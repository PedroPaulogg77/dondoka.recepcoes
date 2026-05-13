"use client";
import { Drawer } from "../Drawer";
import { EditableTextField } from "../EditableTextField";
import { ItensEditor } from "../ItensEditor";
import type { ItemOrcamento } from "@/types/orcamento";

type Props = {
  open: boolean;
  onClose: () => void;
  texto: string;
  defaultTexto: string;
  itens: ItemOrcamento[];
  onChangeTexto: (v: string) => void;
  onChangeItens: (v: ItemOrcamento[]) => void;
  onUndo?: () => void;
};

export function DrawerDecoracao({
  open,
  onClose,
  texto,
  defaultTexto,
  itens,
  onChangeTexto,
  onChangeItens,
  onUndo,
}: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Decoração"
      subtitle="Texto descritivo + itens inclusos no pacote"
      onUndo={onUndo}
    >
      <div className="space-y-7">
        <EditableTextField
          label="Texto da seção"
          value={texto}
          defaultValue={defaultTexto}
          onChange={onChangeTexto}
          rows={5}
        />
        <ItensEditor titulo="Itens da decoração" itens={itens} onChange={onChangeItens} />
      </div>
    </Drawer>
  );
}
