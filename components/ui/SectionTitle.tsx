import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionTitle({ eyebrow, title, subtitle, align = "center" }: Props) {
  return (
    <Reveal className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h2 className="text-3xl md:text-5xl leading-tight">
        <span className="italic font-light text-bronze">{title.split(" ")[0]}</span>{" "}
        {title.split(" ").slice(1).join(" ")}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-carvao/70 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
      <div className={`divider-ornament mt-6 ${align === "center" ? "max-w-[180px] mx-auto" : "max-w-[140px]"}`}>
        <span className="text-bronze">◈</span>
      </div>
    </Reveal>
  );
}
