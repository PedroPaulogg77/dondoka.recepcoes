export function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function dataBR(iso: string | null | undefined) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function dataExtenso(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ===== Faixas de preço por dia da semana ===== */

export type TierDia = "seg_qui" | "sex" | "sab_dom";

export const TIER_LABELS: Record<TierDia, string> = {
  seg_qui: "Segunda a quinta",
  sex: "Sexta-feira",
  sab_dom: "Sábado ou domingo",
};

export const TIER_LABELS_CURTO: Record<TierDia, string> = {
  seg_qui: "Seg–Qui",
  sex: "Sex",
  sab_dom: "Sáb/Dom",
};

/**
 * Mapeia uma data ISO (YYYY-MM-DD) para a faixa de preço correspondente.
 * Usa T12:00:00 pra evitar bugs de fuso horário negativo.
 * Retorna `null` quando não há data.
 */
export function tierFromDate(isoDate: string | null | undefined): TierDia | null {
  if (!isoDate) return null;
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const dow = d.getDay(); // 0=dom, 1=seg ... 5=sex, 6=sáb
  if (dow === 5) return "sex";
  if (dow === 0 || dow === 6) return "sab_dom";
  return "seg_qui";
}

export function tempoRelativo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return "agora";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "agora";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 14) return `há ${days} dia${days > 1 ? "s" : ""}`;

  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;

  const months = Math.floor(days / 30);
  return `há ${months} ${months > 1 ? "meses" : "mês"}`;
}
