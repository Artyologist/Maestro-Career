"use client";

import { motion } from "framer-motion";
import { Lightbulb, Target, Trophy, ArrowUpRight } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        {
            name: "Scientific Precision",
            description: "Built on rigorous psychological frameworks and psychometric standards used by top global institutions.",
            icon: Lightbulb,
            accent: "from-blue-500/20 to-primary/20",
        },
        {
            name: "Data-Driven Future",
            description: "Advanced algorithms analyze market trends to map your skills to the most lucrative career paths.",
            icon: Target,
            accent: "from-purple-500/20 to-accent-purple/20",
        },
        {
            name: "Proven Success",
            description: "Empowering thousands of students to find their vocational calling since 2024.",
            icon: Trophy,
            accent: "from-orange-500/20 to-accent-orange/20",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    } as const;

    return (
        <section id="features" className="py-32 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-accent-purple/5 blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 block"
                    >
                        Why We Excel
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-foreground leading-tight">
                        Revolutionizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-accent-purple">Career Discovery</span>
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.name}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -10,
                                transition: { duration: 0.2 }
                            }}
                            className="group relative p-10 rounded-[2.5rem] bg-card border border-border backdrop-blur-xl hover:bg-card/80 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/5"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${feature.accent} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-8 text-primary shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors">{feature.name}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                    {feature.description}
                                </p>
                                <motion.button
                                    whileHover={{ x: 5 }}
                                    className="flex items-center text-primary font-bold gap-2 group-hover:underline decoration-2 underline-offset-4"
                                >
                                    Learn More <ArrowUpRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

