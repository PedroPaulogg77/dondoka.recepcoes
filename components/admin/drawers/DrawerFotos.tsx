"use client";
import { Drawer } from "../Drawer";
import { FotosPicker } from "../FotosPicker";

type Props = {
  open: boolean;
  onClose: () => void;
  selecionadas: string[];
  onChange: (v: string[]) => void;
  onUndo?: () => void;
};

export function DrawerFotos({ open, onClose, selecionadas, onChange, onUndo }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Galeria de fotos"
      subtitle="Toque pra marcar/desmarcar. As marcadas aparecem na proposta."
      onUndo={onUndo}
    >
      <FotosPicker selecionadas={selecionadas} onChange={onChange} />
    </Drawer>
  );
}
