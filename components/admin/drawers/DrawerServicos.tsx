"use client";
import { Drawer } from "../Drawer";
import { ServicosEditor } from "../ServicosEditor";
import type { ServicosOpcionaisDados } from "@/types/orcamento";

type Props = {
  open: boolean;
  onClose: () => void;
  value: ServicosOpcionaisDados;
  defaultValue: ServicosOpcionaisDados;
  onChange: (v: ServicosOpcionaisDados) => void;
  onUndo?: () => void;
};

function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function DrawerServicos({ open, onClose, value, defaultValue, onChange, onUndo }: Props) {
  const isCustom = !deepEqual(value, defaultValue);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Serviços opcionais"
      subtitle="Lista de extras (segurança, garçons etc) com ícones automáticos"
      onUndo={onUndo}
    >
      <ServicosEditor
        value={value}
        onChange={onChange}
        isCustom={isCustom}
        onResetDefault={() => onChange(defaultValue)}
      />
    </Drawer>
  );
}
