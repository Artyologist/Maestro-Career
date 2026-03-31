"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function Services() {
    const benefits = [
        "Personalized Career Intelligence",
        "AI-Driven Psychometric Mapping",
        "Real-time Industry Alignment",
        "Expert Mentorship Network",
        "Continuous Growth Tracking",
    ];

    return (
        <section id="services" className="py-24 relative bg-background overflow-hidden transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Column - 3D Interactive Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative perspective-1000"
                    >
                        <motion.div
                            whileHover={{ rotateY: 10, rotateX: -5, scale: 1.02 }}
                            className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-3xl overflow-hidden shadow-2xl border border-primary/10 flex items-center justify-center group"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 bg-card rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6"
                                >
                                    <ShieldCheck className="w-12 h-12 text-primary" />
                                </motion.div>
                                <span className="text-primary font-bold text-xl tracking-tight">Scientifically Validated</span>
                            </div>
                            
                            {/* Floating decorative elements */}
                            <motion.div 
                                animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute top-10 right-10 w-12 h-12 bg-accent-purple/20 rounded-xl blur-sm"
                            />
                        </motion.div>

                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
                    </motion.div>

                    {/* Right Column - Animated Content */}
                    <div className="w-full lg:w-1/2">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-xl"
                        >
                            <div className="flex items-center space-x-2 text-primary font-bold mb-4">
                                <Zap className="w-5 h-5 fill-primary" />
                                <span className="uppercase tracking-widest text-sm">Advanced Solutions</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-8 leading-[1.1]">
                                Comprehensive <br />
                                <span className="text-gradient">Career Intelligence</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
                                We go beyond simple testing. Our platform provides a holistic view of your professional DNA, mapping your strengths to the careers of tomorrow.
                            </p>
                            
                            <ul className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <motion.li 
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center group cursor-default"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <CheckCircle2 className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="ml-4 text-foreground font-bold text-lg group-hover:translate-x-2 transition-transform">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

