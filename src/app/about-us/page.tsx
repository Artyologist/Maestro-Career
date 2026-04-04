"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const founders = [
    {
      name: "Vikas Manwatkar",
      role: "Founder & Leadership Coach",
      description: "A seasoned business leadership coach with over 20 years of expertise in supply chain management, data analytics, and digital transformation. Vikas has guided digital initiatives at global giants like Tata, Infosys, and IBM, bridging the gap between industry needs and individual talent.",
      details: [
        "Visiting faculty at premier IITs and NITs",
        "Specialized in high-fidelity psychometric assessment",
        "Mentored 1000+ students and professionals",
        "Design Thinker and Industry 4.0 Expert"
      ],
      image: "/images/vikas.png",
      linkedin: "https://www.linkedin.com/in/vikasmanwatkar/",
      accent: "blue"
    },
    {
      name: "Ashutosh Tewari",
      role: "Co-Founder & Career Strategist",
      description: "A Career Coach and Startup Mentor with 17+ years of experience across IT Services and Management Consulting. Currently pursuing a PhD with a focus on high-impact Social Innovation, Ashutosh combines strategic business logic with a deep commitment to social growth.",
      details: [
        "Certified Behaviour & Mentoring Analyst",
        "Associated with Startup India & IIT Bombay E-Cell",
        "Coached 1,000+ individuals for professional clarity",
        "Mentored 100+ startups across diverse sectors"
      ],
      image: "/images/ashutosh.png",
      linkedin: "https://www.linkedin.com/in/ashutoshtewari/",
      accent: "purple"
    }
  ];

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 selection:bg-primary/20">
      <Header />

      {/* Simple Hero 
      <section className="pt-48 pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tightest uppercase leading-none">
              The Visionaries <br />
              <span className="text-primary italic">Behind Maestro.</span>
            </h1>
            <p className="text-xl text-foreground/40 font-bold max-w-2xl mx-auto uppercase tracking-tighter leading-snug">
              Combining decades of deep-tier industry wisdom with the next generation of career intelligence.
            </p>
          </div>
        </div>
      </section>
      */}

      {/* Alternating Founders Grid */}
      <section className="pb-48">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-48 lg:space-y-64">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32`}
              >
                {/* Text Column */}
                <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tightest uppercase">
                      {founder.name}
                    </h3>
                    <p className="text-sm font-black text-primary uppercase tracking-[0.3em] italic">
                      {founder.role}
                    </p>
                  </div>

                  <div className="h-px w-24 bg-foreground/10" />

                  <p className="text-lg text-foreground/60 font-medium leading-relaxed max-w-xl">
                    {founder.description}
                  </p>

                  <ul className="space-y-5">
                    {founder.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-foreground/40 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6">
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      Connect on LinkedIn
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                {/* Image Column */}
                <div className="flex-1 relative w-full aspect-square max-w-[500px] group">
                  {/* Abstract Decoration */}
                  <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700 -z-10" />

                  <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden border border-foreground/5 shadow-2xl">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Overlay Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Numbering */}
                  <div className="absolute -bottom-10 -right-10 opacity-[0.03] select-none pointer-events-none">
                    <span className="text-[200px] font-black leading-none">0{index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Final CTA to close the narrative */}
      <section className="py-24 border-t border-border/50 bg-secondary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tightest mb-10">
            Join the <span className="text-primary">Maestro Force.</span>
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/explore"
              className="inline-block px-12 py-6 bg-primary text-white font-black text-xs uppercase tracking-[0.5em] shadow-lg shadow-primary/20"
            >
              Initialize Transformation
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


