/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
      : null;
  } catch {
    return null;
  }
})();

// Um ano. Vale para assets de nome estável, que só mudam quando o arquivo é
// trocado (fotos, vídeos, logos, patterns). Para atualizar algum, troque o
// nome do arquivo em vez de sobrescrever o mesmo nome.
const UM_ANO = "public, max-age=31536000, immutable";

const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
    /**
     * WebP apenas, sem AVIF — decisão tomada com medição.
     *
     * Codificar AVIF leva de 2,5s a 3,3s por variante nesta máquina, contra
     * 0,45s do WebP, e o arquivo final fica só 5% menor (116 KB contra
     * 121 KB numa foto do acervo). Como cada tamanho de cada foto é otimizado
     * sob demanda na primeira vez que alguém pede, esse custo aparece para o
     * visitante como imagem que demora a surgir.
     *
     * Trocar 5% de peso por 6x de velocidade na primeira visita é o negócio
     * certo para um site de fotos que vai receber tráfego novo o tempo todo.
     */
    formats: ["image/webp"],

    /**
     * Cada largura aqui vira uma transformação de imagem diferente na Vercel.
     * O padrão do Next inclui 2048 e 3840, tamanhos que este site nunca usa:
     * a maior imagem é o hero em tela cheia, e 1920 já cobre monitor grande.
     *
     * Cortar as duas maiores reduz o número de variantes geradas por foto.
     * Menos transformações cobradas, menos espera na primeira visita de cada
     * tamanho, e cache mais quente conforme o tráfego cresce.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],

    /** Mantém a imagem otimizada em cache por 31 dias antes de refazer. */
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },

  reactStrictMode: true,

  /**
   * Os arquivos de /_next/static já vêm com hash no nome e cache longo por
   * padrão. Quem fica de fora é tudo que está em /public — justamente as
   * fotos e os vídeos, os arquivos mais pesados do site.
   */
  async headers() {
    return [
      {
        source: "/:pasta(fotos|video|logos|patterns)/:arquivo*",
        headers: [{ key: "Cache-Control", value: UM_ANO }],
      },
    ];
  },
};

export default nextConfig;
