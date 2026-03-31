"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function AnimatedProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[100] pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-accent-purple to-primary-light origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}
