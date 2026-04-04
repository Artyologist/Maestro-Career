"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Brain, Gamepad2, MousePointer2 } from "lucide-react";
import React from "react";

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-[3rem] ${className}`}
    >
      <div
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        {children}
      </div>
    </motion.div>
  );
};

export default function InteractiveSection() {
  return (
    <section id="interactive" className="relative py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-none mb-8">
            Experience <br />
            <span className="text-primary">The Un-Test.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Traditional tests are boring. Our journey is a tactile, 3D experience designed for the way you naturally think.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">

          {/* Card 1: Our Objective */}
          <TiltCard className="h-[450px] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 group">
            <div className="h-full w-full p-10 flex flex-col justify-between bg-card/50 backdrop-blur-md rounded-[3rem]">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-primary">What we do</span>
                <h3 className="text-3xl font-black text-foreground">Our Objective</h3>
                <div className="text-base text-muted-foreground font-medium space-y-3 pt-2">
                  <p>• Finalize your career with self-assessment</p>
                  <p>• Subject matter expertise in career coaching</p>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <MousePointer2 className="w-20 h-20 text-primary/30 rotate-12" />
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Our Schedule */}
          <TiltCard className="h-[450px] bg-gradient-to-br from-secondary/20 to-transparent border border-secondary/30">
            <div className="h-full w-full p-10 flex flex-col justify-between bg-card/50 backdrop-blur-md rounded-[3rem]">
              <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center">
                <Brain className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-secondary-foreground">When we do</span>
                <h3 className="text-3xl font-black text-foreground">Our Schedule</h3>
                <div className="text-base text-muted-foreground font-medium space-y-3 pt-2">
                  <p>• As soon as you become our subscriber</p>
                  <p>• We identify your gaps and help in skill development</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-secondary/5 -z-10 blur-3xl rounded-full" />
            </div>
          </TiltCard>

          {/* Card 3: Our Activity */}
          <TiltCard className="h-[450px] bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
            <div className="h-full w-full p-10 flex flex-col justify-between bg-card/50 backdrop-blur-md rounded-[3rem]">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-accent">How we do</span>
                <h3 className="text-3xl font-black text-foreground leading-tight">Our Activity</h3>
                <div className="text-base text-muted-foreground font-medium space-y-3 pt-2">
                  <p>• Amplify your professional journey by staying updated with the latest trends and technologies</p>
                  <p>• Learn life skills and domain expertise through our guidance</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-accent/5 -z-10 blur-3xl rounded-full" />
            </div>
          </TiltCard>

        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
      <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-border to-transparent -z-10" />
    </section>
  );
}
