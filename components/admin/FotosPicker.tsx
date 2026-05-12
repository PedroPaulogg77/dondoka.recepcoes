"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/format";

type Props = {
  selecionadas: string[];
  onChange: (next: string[]) => void;
};

const FOTOS_BUNDLED = [
  "img_5723", "img_5725", "img_5738", "img_5743", "img_5744",
  "img_5753", "img_5758", "img_5759", "img_5774", "img_5775",
  "img_5776", "img_5916", "img_5922", "img_5923", "img_5931", "img_5933",
].map((n) => `/fotos/${n}.webp`);

function resolveSrc(path: string) {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/fotos-espaco/${path}`;
}

export function FotosPicker({ selecionadas, onChange }: Props) {
  const [storage, setStorage] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createBrowserSupabase();
      const { data } = await supabase.storage.from("fotos-espaco").list("", { limit: 200 });
      if (!active || !data) return;
      setStorage(data.filter((f) => !f.name.startsWith(".")).map((f) => f.name));
    })();
    return () => {
      active = false;
    };
  }, []);

  const todas = [...FOTOS_BUNDLED, ...storage];

  function toggle(path: string) {
    if (selecionadas.includes(path)) {
      onChange(selecionadas.filter((p) => p !== path));
    } else {
      onChange([...selecionadas, path]);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    const supabase = createBrowserSupabase();
    const novos: string[] = [];
    for (const file of Array.from(files)) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from("fotos-espaco").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (!error) novos.push(path);
    }
    setStorage((prev) => [...novos, ...prev]);
    onChange([...selecionadas, ...novos]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-carvao/60">
          {selecionadas.length} selecionada{selecionadas.length === 1 ? "" : "s"}
        </p>
        <label className="inline-flex items-center gap-2 px-4 h-9 rounded-full border border-oliva/40 text-oliva hover:bg-oliva hover:text-white transition cursor-pointer text-sm">
          {uploading ? "Enviando..." : "+ Upload"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-[420px] overflow-y-auto p-2 bg-creme rounded-xl border border-areia/40">
        {todas.map((path) => {
          const isSel = selecionadas.includes(path);
          return (
            <button
              key={path}
              type="button"
              onClick={() => toggle(path)}
              className={cn(
                "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition",
                isSel ? "border-oliva ring-2 ring-oliva/30" : "border-transparent hover:border-areia"
              )}
            >
              <Image
                src={resolveSrc(path)}
                alt=""
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover"
              />
              {isSel && (
                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-oliva text-white text-xs flex items-center justify-center font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
