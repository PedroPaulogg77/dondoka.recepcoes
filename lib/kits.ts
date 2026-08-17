import { BIBLIOTECA_SEED, KITS_SEED } from "@/content/kits";
import type {
  BibliotecaGrupo,
  CategoriaKit,
  ConfigGlobal,
  ItemOrcamento,
  Kit,
  KitGrupo,
} from "@/types/orcamento";

/** Mesmo gerador do ItensEditor: curto, legível e suficiente para chave local. */
export function novoId(prefixo = "id") {
  return `${prefixo}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * O que está salvo no config vence a semente.
 *
 * `null` significa "nunca foi salvo", e aí entra o catálogo do fornecedor.
 * Array vazio significa "o João apagou tudo de propósito", e aí fica vazio
 * mesmo. É a diferença que impede o catálogo de ressuscitar sozinho.
 */
export function resolveBiblioteca(config: ConfigGlobal | null): BibliotecaGrupo[] {
  return config?.biblioteca_itens ?? BIBLIOTECA_SEED;
}

export function resolveKits(config: ConfigGlobal | null): Kit[] {
  return config?.kits_catalogo ?? KITS_SEED;
}

export function kitsDaCategoria(kits: Kit[], categoria: CategoriaKit) {
  return kits.filter((k) => k.categoria === categoria);
}

export function bibliotecaDaCategoria(grupos: BibliotecaGrupo[], categoria: CategoriaKit) {
  return grupos.filter((g) => g.categoria === categoria);
}

/** Quantos itens um kit lista, somando todos os grupos. */
export function contarItens(kit: Kit) {
  return kit.grupos.reduce((acc, g) => acc + g.itens.length, 0);
}

export function kitVazio(categoria: CategoriaKit): Kit {
  return {
    id: novoId("kit"),
    categoria,
    nome: "",
    grupos: [{ id: novoId("g"), titulo: "", itens: [] }],
    observacoes: [],
    minimo_pessoas: null,
  };
}

/** Cópia com ids novos, para o botão Duplicar não gerar dois kits com o mesmo id. */
export function duplicarKit(kit: Kit): Kit {
  return {
    ...kit,
    id: novoId("kit"),
    nome: `${kit.nome} (cópia)`,
    grupos: kit.grupos.map((g) => ({ ...g, id: novoId("g"), itens: [...g.itens] })),
    observacoes: [...kit.observacoes],
  };
}

/**
 * Transforma um kit do catálogo numa linha de orçamento.
 *
 * Os grupos são copiados, não referenciados: editar o kit no catálogo depois
 * não mexe em proposta que já foi montada, e muito menos em proposta enviada.
 *
 * Nasce sem preço de propósito. O valor é a única coisa que o João digita.
 */
export function kitParaItem(kit: Kit, convidados: number): ItemOrcamento {
  return {
    id: novoId("item"),
    descricao: kit.nome,
    qtd: convidados > 0 ? convidados : 1,
    valor_unitario: 0,
    inclui: kit.grupos.map((g) => ({ ...g, itens: [...g.itens] })),
    observacoes: [...kit.observacoes],
    kit_id: kit.id,
    por_pessoa: true,
  };
}

/**
 * Mantém a quantidade dos itens "por pessoa" colada no número de convidados.
 *
 * A alternativa seria multiplicar na hora de exibir, mas o total do orçamento é
 * calculado em quatro lugares diferentes a partir de `qtd`. Escrever a
 * quantidade no próprio item mantém os quatro certos sem tocar em nenhum.
 *
 * Devolve o mesmo array quando nada muda, para não sujar o `dirty` do editor a
 * cada render.
 */
export function sincronizarPorPessoa(itens: ItemOrcamento[], convidados: number): ItemOrcamento[] {
  const alvo = convidados > 0 ? convidados : 1;
  let mudou = false;
  const next = itens.map((item) => {
    if (!item.por_pessoa || item.qtd === alvo) return item;
    mudou = true;
    return { ...item, qtd: alvo };
  });
  return mudou ? next : itens;
}

/** Um kit sem nenhum item listado não deve renderizar setinha de expandir. */
export function temInclusos(item: ItemOrcamento) {
  return (
    (item.inclui?.some((g) => g.itens.length > 0) ?? false) ||
    (item.observacoes?.length ?? 0) > 0
  );
}

/** Total de linhas que o cliente vai ver ao expandir. Usado na microcópia. */
export function contarInclusos(item: ItemOrcamento) {
  const doGrupo = item.inclui?.reduce((acc, g) => acc + g.itens.length, 0) ?? 0;
  return doGrupo + (item.observacoes?.length ?? 0);
}

export type { KitGrupo };
