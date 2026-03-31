"use client";

import { motion } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";

export default function InquiryForm() {
    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-background/50 transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-5xl font-black text-foreground tracking-tighter mb-6">
                            Start Your <span className="text-gradient">Evolution</span>
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium">
                            Ready to discover your true potential? Send us a message and our experts will guide you through the next steps.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass p-8 md:p-16 rounded-[3rem] relative overflow-hidden"
                    >
                        <form action="#" method="POST" className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label htmlFor="first-name" className="block text-sm font-black text-foreground/70 uppercase tracking-widest ml-1">First name</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last-name" className="block text-sm font-black text-foreground/70 uppercase tracking-widest ml-1">Last name</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-black text-foreground/70 uppercase tracking-widest ml-1">Email address</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="inquiry-type" className="block text-sm font-black text-foreground/70 uppercase tracking-widest ml-1">Inquiry Category</label>
                                <select
                                    id="inquiry-type"
                                    name="inquiry-type"
                                    className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground focus:border-primary focus:bg-card outline-none transition-all appearance-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="coaching">Career Coaching</option>
                                    <option value="resume">Resume Review</option>
                                    <option value="interview">Interview Preparation</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-black text-foreground/70 uppercase tracking-widest ml-1">Message</label>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01 }}
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all resize-none"
                                    placeholder="Tell us how we can help you..."
                                ></motion.textarea>
                            </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full flex justify-center items-center px-8 py-5 bg-primary text-primary-foreground text-lg font-black rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all group"
                                >
                                Send Inquiry
                                <Send className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                            </motion.button>
                        </form>
                        
                        {/* Decorative background blob in form */}
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

