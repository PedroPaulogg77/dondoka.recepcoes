"use client";
import { Drawer } from "../Drawer";
import { FotosPicker } from "../FotosPicker";

type Props = {
  open: boolean;
  onClose: () => void;
  selecionadas: string[];
  onChange: (v: string[]) => void;
};

export function DrawerFotos({ open, onClose, selecionadas, onChange }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Galeria de fotos"
      subtitle="Toque pra marcar/desmarcar. As marcadas aparecem na proposta."
    >
      <FotosPicker selecionadas={selecionadas} onChange={onChange} />
    </Drawer>
  );
}
