import type { ReactNode } from "react";

type IconProps = { className?: string };

const base = (children: ReactNode, props?: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props?.className ?? "w-5 h-5"}
    aria-hidden
  >
    {children}
  </svg>
);

// ===== Sobre o espaço =====
export const IconCapacidade = (p?: IconProps) => base(
  <>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </>,
  p
);

export const IconClimatizado = (p?: IconProps) => base(
  <>
    <path d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
  </>,
  p
);

export const IconBanheiros = (p?: IconProps) => base(
  <>
    <path d="M9 6V3M15 6V3M3 11h18M5 11v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
  </>,
  p
);

export const IconCozinha = (p?: IconProps) => base(
  <>
    <path d="M3 11h18l-1.5 9h-15zM5 11V7a3 3 0 016 0M13 11V7a3 3 0 016 0" />
  </>,
  p
);

export const IconKids = (p?: IconProps) => base(
  <>
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v6M9 13l-3 5M15 13l3 5M9 21h6" />
  </>,
  p
);

// ===== Dados do evento =====
export const IconUser = (p?: IconProps) => base(
  <>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
  p
);

export const IconGift = (p?: IconProps) => base(
  <>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 000-5C13 3 12 8 12 8" />
  </>,
  p
);

export const IconCalendar = (p?: IconProps) => base(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>,
  p
);

export const IconClock = (p?: IconProps) => base(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>,
  p
);

export const IconUsers = (p?: IconProps) => base(
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </>,
  p
);

// ===== Buffet =====
export const IconTrayBell = (p?: IconProps) => base(
  <>
    <path d="M2 21h20" />
    <path d="M4 17h16a8 8 0 00-16 0Z" />
    <path d="M12 7V5M11 5h2" />
  </>,
  p
);

export const IconWineGlass = (p?: IconProps) => base(
  <>
    <path d="M8 3h8l-1 8a3 3 0 01-6 0L8 3Z" />
    <path d="M12 14v7M8 21h8" />
  </>,
  p
);

export const IconChefHat = (p?: IconProps) => base(
  <>
    <path d="M6 13a4 4 0 01-2-7.5A4 4 0 0112 4a4 4 0 018 1.5A4 4 0 0118 13" />
    <path d="M6 13v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
    <path d="M9 17h6" />
  </>,
  p
);

// ===== Serviços opcionais =====
export const IconShield = (p?: IconProps) => base(
  <>
    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z" />
  </>,
  p
);

export const IconUserTie = (p?: IconProps) => base(
  <>
    <circle cx="12" cy="7" r="4" />
    <path d="M10 11l-3 10h10l-3-10M11 11l1 3 1-3" />
  </>,
  p
);

export const IconBroom = (p?: IconProps) => base(
  <>
    <path d="M15 3l6 6M14 4l-3.5 3.5 6 6L20 10" />
    <path d="M9 9l6 6-4 6H4l-1-5 6-7Z" />
  </>,
  p
);

export const IconTray = (p?: IconProps) => base(
  <>
    <path d="M3 11h18M5 11l1 7a2 2 0 002 2h8a2 2 0 002-2l1-7" />
    <path d="M9 7c0-1.5 1-3 3-3s3 1.5 3 3" />
  </>,
  p
);

export const IconMicrophone = (p?: IconProps) => base(
  <>
    <rect x="9" y="2" width="6" height="13" rx="3" />
    <path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8" />
  </>,
  p
);

// ===== Pagamento / Investimento =====
export const IconCard = (p?: IconProps) => base(
  <>
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <path d="M2 11h20M6 16h4" />
  </>,
  p
);

export const IconCoins = (p?: IconProps) => base(
  <>
    <circle cx="8" cy="9" r="6" />
    <path d="M18.09 10.37A6 6 0 1116 21.91M7 6h1v8M16.71 13.88l.7.71L17 16" />
  </>,
  p
);

// ===== Ícones extras pra serviços comuns em eventos =====
export const IconCamera = (p?: IconProps) => base(
  <>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </>,
  p
);

export const IconHeadphones = (p?: IconProps) => base(
  <>
    <path d="M3 18v-6a9 9 0 0118 0v6" />
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
  </>,
  p
);

export const IconCar = (p?: IconProps) => base(
  <>
    <path d="M5 17h14M3 17l1.5-7a2 2 0 012-1.5h11a2 2 0 012 1.5L21 17" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </>,
  p
);

export const IconBouquet = (p?: IconProps) => base(
  <>
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="7" cy="9" r="2.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M12 11v10M9 21h6" />
  </>,
  p
);

export const IconCake = (p?: IconProps) => base(
  <>
    <path d="M3 21h18M4 21v-8a2 2 0 012-2h12a2 2 0 012 2v8M4 15h16M9 7a2 2 0 100-4 2 2 0 000 4M9 7v4M15 7a2 2 0 100-4 2 2 0 000 4M15 7v4" />
  </>,
  p
);

export const IconSparkle = (p?: IconProps) => base(
  <>
    <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7zM19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7zM5 4l.5 1.5L7 6l-1.5.5L5 8l-.5-1.5L3 6l1.5-.5z" />
  </>,
  p
);

export const IconStar = (p?: IconProps) => base(
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  p
);

export const IconHeart = (p?: IconProps) => base(
  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />,
  p
);

// ===== Mapeamento por nome (Serviços Opcionais) =====
// O sistema procura por palavras-chave no nome do serviço (case-insensitive)
// e atribui automaticamente o ícone correspondente.
export const SERVICOS_KEYWORDS = [
  { keywords: ["seguran"], iconName: "Segurança" as const, icon: IconShield },
  { keywords: ["recepc", "cerimon"], iconName: "Recepcionista/Cerimonialista" as const, icon: IconUserTie },
  { keywords: ["limpez"], iconName: "Limpeza" as const, icon: IconBroom },
  { keywords: ["garç", "garc"], iconName: "Garçom" as const, icon: IconTray },
  { keywords: ["músic", "music", "banda", "dj"], iconName: "Música/DJ" as const, icon: IconHeadphones },
  { keywords: ["foto", "video"], iconName: "Fotografia" as const, icon: IconCamera },
  { keywords: ["microfone", "som", "locução"], iconName: "Som" as const, icon: IconMicrophone },
  { keywords: ["valet", "carro", "manobr", "transport"], iconName: "Manobrista" as const, icon: IconCar },
  { keywords: ["flor", "decora", "buquê", "buque"], iconName: "Flores/Decoração" as const, icon: IconBouquet },
  { keywords: ["bolo", "doce", "confeit"], iconName: "Bolo/Doces" as const, icon: IconCake },
  { keywords: ["fogo", "pirotec", "efeito"], iconName: "Efeitos especiais" as const, icon: IconSparkle },
];

export function iconForServico(nome: string): (p?: IconProps) => ReactNode {
  const n = nome.toLowerCase();
  for (const entry of SERVICOS_KEYWORDS) {
    if (entry.keywords.some((k) => n.includes(k))) return entry.icon;
  }
  return IconStar;
}
