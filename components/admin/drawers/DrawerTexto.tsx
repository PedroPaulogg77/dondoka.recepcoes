"use client";
import { Drawer } from "../Drawer";
import { EditableTextField } from "../EditableTextField";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  label: string;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
  rows?: number;
};

export function DrawerTexto({
  open,
  onClose,
  title,
  subtitle,
  label,
  value,
  defaultValue,
  onChange,
  rows,
}: Props) {
  return (
    <Drawer open={open} onClose={onClose} title={title} subtitle={subtitle}>
      <EditableTextField
        label={label}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        rows={rows}
      />
    </Drawer>
  );
}
