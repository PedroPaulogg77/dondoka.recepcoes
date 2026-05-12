"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      className="no-print fixed top-0 left-0 right-0 h-[2px] bg-oliva origin-left z-50"
      style={{ scaleX }}
    />
  );
}
