"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  Brain as BrainIcon,
  Target,
  GraduationCap,
  Briefcase,
  Rocket,
  Users,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Lightbulb
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative h-full rounded-[2.5rem] group transition-all duration-500 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const services = [
    {
      id: "assessment",
      title: "Psychometric Assessment",
      description: "Discover your strengths, interests, and personality traits through scientifically validated tools. Get deep insights into your core career aptitude.",
      icon: BrainIcon,
      category: "Assessment Test"
    },
    {
      id: "counselling",
      title: "Career Counselling",
      description: "One-on-one sessions with expert coaches to help you make informed academic and career decisions. Personalized high-precision guidance.",
      icon: MessageCircle,
      category: "Counselling"
    },
    {
      id: "student",
      title: "Student Guidance",
      description: "Career planning from Class 8 onwards, including stream selection, college guidance, entrance exam strategies, and profiling.",
      icon: GraduationCap,
      category: "Career Solutions"
    },
    {
      id: "professional",
      title: "Professional Development",
      description: "Support for working professionals with upskilling, industry insights, and career growth planning to stay ahead in the 2030+ workforce.",
      icon: Briefcase,
      category: "Career Solutions"
    },
    {
      id: "readiness",
      title: "Career Readiness Training",
      description: "Build essential skills like resume writing, interview preparation, communication, and professional etiquette for zero guesswork outcomes.",
      icon: Rocket,
      category: "Career Solutions"
    },
    {
      id: "mentorship",
      title: "Mentorship Programs",
      description: "Connect with industry experts for ongoing guidance, support, and real-world insights that bridge the gap from aspiration to achievement.",
      icon: Users,
      category: "Counselling"
    },
  ];

  const filteredServices = activeTab === "all"
    ? services
    : services.filter(s => s.category === activeTab);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      <Header />

      {/* Ambient background energy */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] bg-accent/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-32 md:py-48 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">


          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 uppercase text-foreground"
          >
            Our <span className="text-primary">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/40 font-bold max-w-2xl mx-auto uppercase tracking-tight leading-relaxed"
          >
            Tailored career solutions designed to navigate the complexities of the modern workforce with scientific precision and human-centric coaching.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-24">
          {["all", "Assessment Test", "Counselling", "Career Solutions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${activeTab === tab
                ? "bg-primary text-primary-foreground border-transparent shadow-xl shadow-primary/20 scale-105"
                : "bg-card/50 text-foreground/40 border-foreground/5 hover:border-primary/40"
                }`}
            >
              {tab === "all" ? "All Offerings" : tab}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto"
        >
          {filteredServices.map((s, i) => (
            <motion.div
              layout
              key={s.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard className="bg-card/30 border border-foreground/5 group hover:border-primary/20 backdrop-blur-xl">
                <div className="p-10 lg:p-14 h-full flex flex-col justify-between min-h-[450px]">
                  <div>
                    <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mb-10 rounded-[2rem] border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <s.icon size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-black mb-6 text-foreground uppercase tracking-tightest leading-none">
                      {s.title}
                    </h3>
                    <p className="text-sm text-foreground/50 font-medium leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <Link
                    href="#contact"
                    className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:gap-6 transition-all"
                  >
                    Learn More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Final Interactive Strip */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 p-16 md:p-24 bg-foreground rounded-[4rem] text-background flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-primary/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out -z-10" />

          <div className="space-y-4 text-center md:text-left relative z-10">
            <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tightest leading-none">Not sure where <br /> <span className="text-primary italic">to start?</span></h4>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-40">Let our experts design a custom career roadmap for you.</p>
          </div>

          <Link
            href="/auth"
            className="px-12 py-6 bg-background text-foreground font-black text-xs uppercase tracking-[0.5em] rounded-full hover:bg-primary hover:text-white transition-all shadow-2xl relative z-10"
          >
            Start Assessment
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

