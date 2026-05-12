import { slugify } from "./format";

export function generateSlugCandidates(name: string, evento: string | null) {
  const base = slugify(`${name}${evento ? `-${evento}` : ""}`).slice(0, 50) || "orcamento";
  return base;
}

export async function ensureUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let candidate = base;
  if (!(await exists(candidate))) return candidate;
  for (let i = 2; i < 200; i++) {
    candidate = `${base}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${base}-${Date.now()}`;
}
