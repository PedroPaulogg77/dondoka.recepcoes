"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "outline" | "ghost" | "dark";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva focus-visible:ring-offset-2 focus-visible:ring-offset-creme";

const variants: Record<Variant, string> = {
  primary: "bg-oliva text-white hover:bg-bronze shadow-soft",
  outline: "border border-oliva/40 text-oliva hover:bg-oliva hover:text-white",
  ghost: "text-oliva hover:bg-oliva/10",
  dark: "bg-carvao text-white hover:bg-oliva",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  )
);
Button.displayName = "Button";
