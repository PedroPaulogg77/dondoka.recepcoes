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

// ===== Mapeamento por nome (Serviços Opcionais) =====
export function iconForServico(nome: string): (p?: IconProps) => ReactNode {
  const n = nome.toLowerCase();
  if (n.includes("seguran")) return IconShield;
  if (n.includes("recepc") || n.includes("cerimon")) return IconUserTie;
  if (n.includes("limpez")) return IconBroom;
  if (n.includes("garç") || n.includes("garc")) return IconTray;
  if (n.includes("músic") || n.includes("music")) return IconMicrophone;
  return IconTray;
}
