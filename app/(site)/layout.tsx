import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd, schemaNegocio, schemaWebSite } from "@/lib/schema";

/**
 * Layout do site institucional.
 *
 * Vive num route group `(site)` para envolver só as páginas públicas de
 * marketing. `/admin`, `/orcamento/[slug]` e `/links` ficam de fora e seguem
 * usando apenas o layout raiz — o header e o footer daqui não podem vazar
 * para a proposta do cliente nem para o painel.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Identidade do negócio em toda página do site — é o que amarra as
          páginas a uma única entidade aos olhos de quem indexa. */}
      <JsonLd data={[schemaNegocio(), schemaWebSite()]} />

      <SiteHeader />
      {/* O header é fixed; o padding evita que o conteúdo entre por baixo dele.
          Seções de hero que devem começar no topo da tela usam -mt-16/-mt-20. */}
      <main className="pt-16 md:pt-20">{children}</main>
      <SiteFooter />
    </>
  );
}
