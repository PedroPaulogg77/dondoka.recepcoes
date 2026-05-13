"use client";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SectionHelp({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs text-oliva hover:text-bronze transition"
      >
        <span
          className={`inline-block w-4 h-4 rounded-full bg-oliva/10 text-oliva text-[10px] leading-none flex items-center justify-center ${
            open ? "rotate-45" : ""
          } transition-transform`}
          aria-hidden
        >
          ?
        </span>
        <span className="underline-offset-4 hover:underline">
          {open ? "Ocultar ajuda" : title}
        </span>
      </button>
      {open && (
        <div className="mt-2.5 px-3.5 py-3 rounded-lg bg-creme border border-areia/60 text-xs md:text-[13px] text-carvao/75 leading-relaxed space-y-1.5">
          {children}
        </div>
      )}
    </div>
  );
}
