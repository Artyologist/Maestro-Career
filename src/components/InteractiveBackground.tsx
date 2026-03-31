"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function InteractiveBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none will-change-transform">
      {/* Vibrant Kinetic Washes */}
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] bg-vibe-blue/10 rounded-full blur-[180px] animate-pulse"
      />

      <motion.div
        style={{
          x: useSpring(mouseX, { stiffness: 50, damping: 20 }),
          y: useSpring(mouseY, { stiffness: 50, damping: 20 }),
        }}
        className="absolute top-[25%] -right-[5%] w-[45%] h-[45%] bg-vibe-purple/8 rounded-full blur-[200px]"
      />

      <motion.div
        style={{
          x: useSpring(mouseX, { stiffness: 80, damping: 40 }),
          y: useSpring(mouseY, { stiffness: 80, damping: 40 }),
        }}
        className="absolute bottom-[10%] left-[30%] w-[35%] h-[35%] bg-vibe-pink/5 rounded-full blur-[150px] animate-pulse delay-500"
      />

      {/* Floating Kinetic Shapes */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 45, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[25%] left-[20%] w-16 h-16 border border-primary/10 rounded-3xl opacity-30 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
      />

      <motion.div
        animate={{
          y: [0, 40, 0],
          rotate: [0, -45, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[35%] right-[15%] w-24 h-24 border border-vibe-purple/10 rounded-full opacity-20 shadow-[0_0_30px_rgba(var(--vibe-purple),0.1)]"
      />
    </div>
  );
}
