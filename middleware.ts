import { NextResponse, type NextRequest } from "next/server";

/**
 * Atalho de navegação, NÃO a barreira de segurança.
 *
 * A checagem aqui olha só o nome do cookie, sem ler o valor nem validar
 * assinatura, porque validar exigiria uma chamada ao Supabase em toda
 * requisição do painel. Serve para mandar quem não está logado direto pro
 * login sem renderizar a página à toa.
 *
 * Quem de fato barra é o `requirePageAuth()` na primeira linha de cada página
 * de /admin, que chama `getUser()` e valida o token contra o servidor. Se um
 * dia alguém confiar neste arquivo como proteção, o cookie forjado volta a
 * abrir o painel inteiro.
 */
export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (!pathname.startsWith("/admin")) {
      return NextResponse.next();
    }

    const isLogin = pathname === "/admin/login";
    let authenticated = false;
    try {
      const cookies = request.cookies.getAll();
      authenticated = cookies.some(
        (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
      );
    } catch {
      authenticated = false;
    }

    if (!isLogin && !authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    /**
     * Não existe o caminho inverso, mandar quem "parece logado" de /admin/login
     * para /admin.
     *
     * Com o cookie presente mas a sessão inválida, e é o que acontece quando
     * ele expira, o middleware mandaria para /admin, o `requirePageAuth()` da
     * página mandaria de volta para /admin/login, e o navegador ficaria
     * quicando entre os dois até desistir. A pessoa fica trancada do lado de
     * fora sem nem conseguir ver o formulário de entrada.
     *
     * Como aqui não dá para saber se a sessão vale, a regra é só barrar quem
     * claramente não tem cookie. Quem tem segue para a página, que decide.
     */
    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
