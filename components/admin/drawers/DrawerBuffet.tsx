"use client";
import { Drawer } from "../Drawer";
import { BuffetEditor } from "../BuffetEditor";
import type { BuffetDados } from "@/types/orcamento";

type Props = {
  open: boolean;
  onClose: () => void;
  value: BuffetDados;
  defaultValue: BuffetDados;
  onChange: (v: BuffetDados) => void;
};

function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function DrawerBuffet({ open, onClose, value, defaultValue, onChange }: Props) {
  const isCustom = !deepEqual(value, defaultValue);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Cardápio do buffet"
      subtitle="Edite os pratos, bebidas e descrição do serviço"
    >
      <BuffetEditor
        value={value}
        onChange={onChange}
        isCustom={isCustom}
        onResetDefault={() => onChange(defaultValue)}
      />
    </Drawer>
  );
}
