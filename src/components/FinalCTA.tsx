"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

export default function FinalCTA() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => setFormState("sent"), 1500);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Side: Narrative Content */}
          <div className="flex-1 space-y-8 text-left">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
              Ready to take the <br />
              <span className="text-primary italic">next step?</span>
            </h2>
            <p className="text-xl text-foreground/60 max-w-xl leading-relaxed">
              Find your path with precision. Get in touch with our career experts today and start your journey with confidence. Join the elite who stopped guessing.
            </p>
            <div className="pt-4 border-t border-border/10">
              <p className="text-sm font-medium text-foreground/40 uppercase tracking-widest">
                Trusted by 15,000+ professionals
              </p>
            </div>
          </div>

          {/* Right Side: Form Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-xl"
          >
            <div className="rounded-3xl border border-border/20 bg-card p-8 md:p-12 shadow-sm transition-all">
              {formState === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center space-y-6 py-12 text-center"
                >
                  <div className="text-emerald-500 font-bold text-lg">Thank you!</div>
                  <h3 className="text-2xl font-bold text-foreground">Inquiry Received</h3>
                  <p className="text-foreground/60 text-sm">One of our career architects will get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter your Name"
                        className="w-full rounded-xl border border-border/30 bg-background px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition placeholder:text-foreground/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-border/30 bg-background px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition placeholder:text-foreground/30"
                      />
                    </div>
                  </div>

                  <button
                    disabled={formState === "submitting"}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 mt-4"
                  >
                    {formState === "submitting" ? "Sending..." : "Submit Inquiry"}
                  </button>

                  <p className="text-center text-[11px] text-foreground/40 font-medium mt-6 uppercase tracking-widest">
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
