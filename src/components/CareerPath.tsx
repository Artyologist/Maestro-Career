"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, BrainCircuit, Lightbulb, Rocket } from "lucide-react";

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const steps = [
    {
      title: "Discover Your Strengths",
      desc: "We start by understanding what you're naturally good at through simple, engaging assessments, not just boring tests.",
      icon: ClipboardList,
      color: "from-blue-500 to-cyan-400",
      detail: "Step 01: Self-Discovery"
    },
    {
      title: "Identify The Gaps",
      desc: "Next, we pinpoint exactly what skills you're currently missing to reach your target role in today's job market.",
      icon: BrainCircuit,
      color: "from-purple-600 to-blue-500",
      detail: "Step 02: Skill Mapping"
    },
    {
      title: "Build Your Profile",
      desc: "Work directly with our career coaches to polish your resume, improve interview skills, and build a standout portfolio.",
      icon: Lightbulb,
      color: "from-orange-500 to-amber-400",
      detail: "Step 03: Preparation"
    },
    {
      title: "Connect & Grow",
      desc: "Finally, we connect you with actionable opportunities and industry mentors so you can officially kickstart your career journey.",
      icon: Rocket,
      color: "from-emerald-500 to-green-400",
      detail: "Step 04: Real World"
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-background will-change-transform"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-24 text-center">

            <h2 className="text-4xl md:text-8xl font-black text-foreground tracking-tighter leading-none mb-8">
              How It <span className="text-gradient">Flows.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Winding Road Path SVG for Desktop */}
            <div className="absolute inset-0 lg:block hidden pointer-events-none -z-10 overflow-visible">
              {/* Subtle background track */}
              <svg className="w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                <path
                  d="M 50,12.5 C 75,12.5 75,37.5 50,37.5 C 25,37.5 25,62.5 50,62.5 C 75,62.5 75,87.5 50,87.5"
                  stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary/40" vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* Animated glowing path overlay tracked to scroll progress */}
              <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                <motion.path
                  style={{ pathLength: smoothProgress }}
                  d="M 50,12.5 C 75,12.5 75,37.5 50,37.5 C 25,37.5 25,62.5 50,62.5 C 75,62.5 75,87.5 50,87.5"
                  stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.8)]" vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div className="space-y-32">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

                    {/* Content Corner */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: "-100px" }}
                      className={`w-full lg:w-[42%] ${isEven ? 'lg:text-right' : 'lg:text-left'}`}
                    >
                      <span className={`text-sm font-black uppercase tracking-[0.3em] mb-4 block bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                        {step.detail}
                      </span>
                      <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-none">
                        {step.title}
                      </h3>
                      <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>

                    {/* Center Icon Node */}
                    <div className="relative z-10 flex items-center justify-center">
                      <motion.div
                        whileInView={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
                        viewport={{ margin: "-100px" }}
                        className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${step.color} p-1 shadow-2xl group transition-transform`}
                      >
                        <div className="w-full h-full bg-card rounded-[2.4rem] flex items-center justify-center">
                          <step.icon className={`w-12 h-12 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                        </div>
                      </motion.div>

                      {/* Mobile Line extension */}
                      <div className="absolute top-28 w-1 h-32 bg-border lg:hidden" />
                    </div>

                    {/* Perspective Decoration */}
                    <div className="hidden lg:block w-[42%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Background label */}
      <div className="absolute top-1/4 right-0 opacity-5 pointer-events-none rotate-90 select-none">
        <span className="text-[120px] font-black uppercase tracking-tighter">PROGRESSION</span>
      </div>
    </section>
  );
}
