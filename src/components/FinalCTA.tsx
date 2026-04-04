"use client";

import { motion } from "framer-motion";
import { Send, Sparkles, MessageSquare, User } from "lucide-react";
import React, { useState } from "react";

export default function FinalCTA() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => setFormState("sent"), 1500);
  };

  return (
    <section id="contact" className="relative py-48 overflow-hidden bg-background">
      {/* Background Architectural Wash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-foreground/5 blur-[150px] -z-10" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">

          {/* Left: Narrative Message */}
          <div className="flex-1 space-y-12">
            <h2 className="text-7xl md:text-9xl font-black text-foreground tracking-tightest leading-[0.82] uppercase mb-12">
              Ready to <br />
              <span>Decide?</span>
            </h2>

            <p className="text-xl md:text-2xl text-foreground/40 font-bold max-w-xl leading-relaxed uppercase tracking-tight">
              The longest journey begins with a single, high-precision decision. Join the elite who stopped guessing.
            </p>

            <div className="flex items-center space-x-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 border border-foreground/10 bg-secondary flex items-center justify-center grayscale opacity-50">
                    <User className="w-6 h-6 text-foreground" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                Synchronized with <span className="text-foreground">15,000+</span> profiles
              </p>
            </div>
          </div>

          {/* Right: Architectural Monolith Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex-1 w-full max-w-xl"
          >
            <div className="bg-secondary/30 p-12 md:p-16 border border-foreground/5 shadow-2xl relative">
              {formState === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8 py-24"
                >
                  <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground uppercase tracking-tightest">Inquiry Received.</h3>
                  <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Processing via Career Architects...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="space-y-8">
                    <div className="relative border-b-2 border-foreground/10 focus-within:border-foreground transition-all">
                      <input
                        required
                        type="text"
                        placeholder="IDENTIFY: YOUR NAME"
                        className="w-full bg-transparent py-5 text-sm font-black text-foreground placeholder:text-foreground/20 outline-none uppercase tracking-widest"
                      />
                      <MessageSquare className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                    </div>
                    <div className="relative border-b-2 border-foreground/10 focus-within:border-foreground transition-all">
                      <input
                        required
                        type="email"
                        placeholder="IDENTIFY: EMAIL ADDRESS"
                        className="w-full bg-transparent py-5 text-sm font-black text-foreground placeholder:text-foreground/20 outline-none uppercase tracking-widest"
                      />
                      <Send className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formState === "submitting"}
                    className="w-full relative bg-foreground text-background py-8 text-sm font-black uppercase tracking-[0.4em] transition-all disabled:opacity-50"
                  >
                    <span className="relative z-10">{formState === "submitting" ? "Processing..." : "Launch Discovery"}</span>
                    <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

                  <p className="text-center text-[9px] font-black text-foreground/20 uppercase tracking-[0.5em] mt-8">
                    Absolute Confidentiality Guaranteed
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
