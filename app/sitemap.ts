import type { MetadataRoute } from "next";
import { EVENTOS } from "@/content/eventos";
import { GUIAS } from "@/content/guias";
import { urlAbsoluta } from "@/lib/site-config";

/**
 * Sitemap.
 *
 * Só entra o que é público e indexável. Ficam de fora, deliberadamente:
 *   /admin              painel interno
 *   /orcamento/[slug]   proposta de cliente — conteúdo privado
 *   /links              bio do Instagram, duplica o contato da home
 *
 * `lastModified` sai da data de atualização real dos guias. Para as páginas
 * fixas usamos a data do build: elas mudam quando o site muda.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const fixas: Array<{ path: string; priority: number; changeFrequency: "monthly" | "yearly" }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/o-espaco", priority: 0.9, changeFrequency: "monthly" },
    { path: "/buffet", priority: 0.8, changeFrequency: "monthly" },
    { path: "/galeria", priority: 0.8, changeFrequency: "monthly" },
    { path: "/perguntas-frequentes", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contato", priority: 0.9, changeFrequency: "yearly" },
    { path: "/guias", priority: 0.6, changeFrequency: "monthly" },
  ];

  return [
    ...fixas.map((p) => ({
      url: urlAbsoluta(p.path),
      lastModified: agora,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...EVENTOS.map((e) => ({
      url: urlAbsoluta(`/eventos/${e.slug}`),
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...GUIAS.map((g) => ({
      url: urlAbsoluta(`/guias/${g.slug}`),
      lastModified: new Date(`${g.atualizadoEm}T12:00:00`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
