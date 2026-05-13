"use client";
import { Fragment } from "react";

type Props = {
  texto: string;
  className?: string;
  /** Cor dos bullets — padrão "text-oliva" */
  bulletColor?: string;
};

/**
 * Renderiza texto multi-linha preservando:
 *  - Quebras de linha → quebra de parágrafo
 *  - Linhas em branco → espaço extra entre parágrafos
 *  - Linhas começando com "• ", "- ", "* " ou "▪ " → bullet point estilizado
 *
 * Uso: <TextoFormatado texto={config.sobre_texto} className="text-carvao/75 text-center" />
 */
export function TextoFormatado({ texto, className = "", bulletColor = "text-oliva" }: Props) {
  if (!texto) return null;
  const linhas = texto.split("\n");

  return (
    <div className={className}>
      {linhas.map((linha, i) => {
        const trimmed = linha.trim();

        // linha em branco → respiro
        if (trimmed === "") {
          return <div key={i} className="h-3" aria-hidden />;
        }

        // detecta bullet (• - * ▪)
        const bulletMatch = trimmed.match(/^([•\-*▪])\s*(.*)$/);
        if (bulletMatch) {
          const conteudo = bulletMatch[2];
          return (
            <div key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span className={`mt-2 text-[10px] ${bulletColor}`} aria-hidden>
                ◆
              </span>
              <span>{conteudo}</span>
            </div>
          );
        }

        // parágrafo normal
        return (
          <p key={i} className="leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
