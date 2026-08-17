"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/format";
import { FOTOS } from "@/content/espaco";

type Props = {
  selecionadas: string[];
  onChange: (next: string[]) => void;
  /**
   * Fotos padrão do config global. Quando informado, aparece o botão
   * "usar as fotos padrão". Fica de fora na tela de Configurações, onde o que
   * está sendo editado É o padrão.
   */
  padrao?: string[];
};

/**
 * Fotos que vivem no repositório, em public/fotos.
 *
 * Vem de FOTOS (content/espaco.ts) em vez de uma lista escrita à mão aqui.
 * A lista à mão tinha 16 caminhos enquanto a pasta já tinha 19, então fachada
 * de dia, detalhe da fachada e cozinha existiam no site e eram invisíveis para
 * quem monta a proposta.
 *
 * espacoKids fica de fora: a área não está pronta e saiu da proposta.
 */
const FOTOS_BUNDLED = Object.entries(FOTOS)
  .filter(([chave]) => chave !== "espacoKids")
  .map(([, caminho]) => caminho as string);

/** O que todo navegador desenha. HEIC de iPhone fica de fora de propósito. */
const FORMATOS_ACEITOS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

function ehDoStorage(path: string) {
  return !path.startsWith("http") && !path.startsWith("/");
}

function resolveSrc(path: string) {
  if (!ehDoStorage(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/fotos-espaco/${path}`;
}

function mesmaLista(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function FotosPicker({ selecionadas, onChange, padrao }: Props) {
  const router = useRouter();
  const [storage, setStorage] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [apagando, setApagando] = useState<string | null>(null);
  const [limpando, setLimpando] = useState(false);
  /** Caminhos cujo <Image> disparou onError nesta sessão. */
  const [quebradas, setQuebradas] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
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
  const podeRestaurarPadrao =
    !!padrao && padrao.length > 0 && !mesmaLista(selecionadas, padrao);

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
    setErro(null);
    const supabase = createBrowserSupabase();
    const novos: string[] = [];
    const falhas: string[] = [];
    const recusadas: string[] = [];
    for (const file of Array.from(files)) {
      /**
       * Formato que o navegador não desenha vira quadro quebrado.
       *
       * O caso comum é foto de iPhone em HEIC: sobe sem erro, fica no bucket e
       * nenhum navegador consegue exibir. Barrar aqui é melhor do que deixar a
       * pessoa descobrir depois, olhando uma grade cheia de molduras vazias.
       */
      if (!FORMATOS_ACEITOS.includes(file.type)) {
        recusadas.push(file.name);
        continue;
      }
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from("fotos-espaco").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) falhas.push(file.name);
      else novos.push(path);
    }
    setStorage((prev) => [...novos, ...prev]);
    onChange([...selecionadas, ...novos]);
    const problemas: string[] = [];
    if (recusadas.length) {
      problemas.push(
        `${recusadas.join(", ")}: formato que o navegador não abre. Se veio de iPhone, exporte como JPG antes de enviar.`
      );
    }
    if (falhas.length) problemas.push(`Não subiu: ${falhas.join(", ")}`);
    if (problemas.length) setErro(problemas.join(" "));
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  /**
   * Apaga do bucket de vez.
   *
   * Só vale para foto enviada pelo painel. As de public/fotos vêm do
   * repositório e some-las daqui não apagaria arquivo nenhum, só sumiria com a
   * opção. Para essas, desmarcar já resolve.
   */
  async function apagarDoStorage(path: string) {
    if (
      !confirm(
        "Apagar esta foto de vez? Ela sai deste orçamento e de todos os outros que a estejam usando, inclusive propostas já enviadas."
      )
    ) {
      return;
    }

    setApagando(path);
    setErro(null);
    /**
     * Passa pela rota do servidor, não direto no Storage.
     *
     * Apagando direto o arquivo some e os caminhos continuam gravados em cada
     * orçamento, virando quadro quebrado na proposta do cliente. A rota apaga e
     * limpa as referências na mesma operação.
     */
    const res = await fetch("/api/admin/fotos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    setApagando(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setErro(body.error || "Não foi possível apagar a foto.");
      return;
    }
    setStorage((prev) => prev.filter((p) => p !== path));
    onChange(selecionadas.filter((p) => p !== path));
    router.refresh();
  }

  /** Limpa referências a fotos que já não existem mais no Storage. */
  async function limparQuebradas() {
    setLimpando(true);
    setErro(null);
    setAviso(null);
    const res = await fetch("/api/admin/fotos", { method: "POST" });
    setLimpando(false);
    if (!res.ok) {
      setErro("Não foi possível varrer as fotos quebradas.");
      return;
    }
    const body = (await res.json()) as {
      orfas: string[];
      orcamentosAtualizados: number;
    };
    if (body.orfas.length === 0) {
      setAviso("Nenhuma foto quebrada encontrada.");
    } else {
      setAviso(
        `${body.orfas.length} foto(s) que não existiam mais foram removidas de ${body.orcamentosAtualizados} orçamento(s).`
      );
      onChange(selecionadas.filter((p) => !body.orfas.includes(p)));
    }
    router.refresh();
    setTimeout(() => setAviso(null), 6000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm text-carvao/60">
          {selecionadas.length} selecionada{selecionadas.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          {podeRestaurarPadrao && (
            <button
              type="button"
              onClick={() => onChange(padrao!)}
              className="inline-flex items-center h-9 px-3 rounded-full text-sm text-oliva hover:bg-oliva/10 transition"
              title="Substitui a seleção deste orçamento pelas fotos padrão das Configurações"
            >
              ↺ Usar as fotos padrão
            </button>
          )}
          <label className="inline-flex items-center gap-2 px-4 h-9 rounded-full border border-oliva/40 text-oliva hover:bg-oliva hover:text-white transition cursor-pointer text-sm">
            {uploading ? "Enviando..." : "+ Upload"}
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={FORMATOS_ACEITOS.join(",")}
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {erro && (
        <p className="mb-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
          {erro}
        </p>
      )}
      {aviso && (
        <p className="mb-3 rounded-lg bg-oliva/10 border border-oliva/30 px-3 py-2 text-xs text-oliva">
          {aviso}
        </p>
      )}

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-[420px] overflow-y-auto p-2 bg-creme rounded-xl border border-areia/40">
        {todas.map((path) => {
          const isSel = selecionadas.includes(path);
          const doStorage = ehDoStorage(path);

          /**
           * Arquivo que existe no bucket mas o navegador não desenha.
           *
           * A varredura de órfãs não alcança estes: para o Storage eles estão
           * lá e inteiros. Em vez de moldura vazia sem explicação, mostra o
           * nome do arquivo e o botão de apagar, que é a única saída.
           */
          if (quebradas.includes(path)) {
            return (
              <div
                key={path}
                className="relative aspect-[3/4] rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/60 p-2 flex flex-col justify-between"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-rose-700">Não abre</p>
                  <p className="mt-0.5 text-[9px] text-rose-600/80 break-all line-clamp-4">
                    {path}
                  </p>
                </div>
                {doStorage && (
                  <button
                    type="button"
                    onClick={() => apagarDoStorage(path)}
                    disabled={apagando === path}
                    className="w-full h-7 rounded-full bg-rose-500 text-white text-[10px] font-medium hover:bg-rose-600 disabled:opacity-50 transition"
                  >
                    {apagando === path ? "..." : "Apagar"}
                  </button>
                )}
              </div>
            );
          }

          return (
            <div
              key={path}
              className={cn(
                "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition group",
                isSel ? "border-oliva ring-2 ring-oliva/30" : "border-transparent hover:border-areia"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(path)}
                className="absolute inset-0 w-full h-full"
                aria-label={isSel ? "Desmarcar foto" : "Marcar foto"}
                aria-pressed={isSel}
              >
                <Image
                  src={resolveSrc(path)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover"
                  onError={() =>
                    setQuebradas((prev) => (prev.includes(path) ? prev : [...prev, path]))
                  }
                />
              </button>

              {isSel && (
                <div className="pointer-events-none absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-oliva text-white text-xs flex items-center justify-center font-bold">
                  ✓
                </div>
              )}

              {/* Excluir: só para foto enviada pelo painel, e discreto até o
                  cursor chegar perto. No toque fica sempre visível. */}
              {doStorage && (
                <button
                  type="button"
                  onClick={() => apagarDoStorage(path)}
                  disabled={apagando === path}
                  aria-label="Apagar foto de vez"
                  title="Apagar foto de vez"
                  className="absolute bottom-1.5 left-1.5 w-7 h-7 inline-flex items-center justify-center rounded-full bg-white/90 text-carvao/60 shadow-soft hover:bg-rose-500 hover:text-white transition opacity-100 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-50"
                >
                  {apagando === path ? (
                    <span className="text-[10px]">...</span>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-carvao/50 max-w-md">
          As fotos do acervo da casa não podem ser apagadas por aqui, só desmarcadas. A lixeira
          aparece nas que você mesmo enviou, e apagar tira a foto de todas as propostas.
        </p>
        <button
          type="button"
          onClick={limparQuebradas}
          disabled={limpando}
          title="Procura fotos que já foram apagadas e ainda aparecem quebradas em alguma proposta"
          className="text-[11px] text-carvao/50 hover:text-carvao underline-offset-4 hover:underline disabled:opacity-50"
        >
          {limpando ? "Varrendo..." : "Limpar fotos quebradas"}
        </button>
      </div>
    </div>
  );
}
