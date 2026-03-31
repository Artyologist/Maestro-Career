"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import NextImage from "next/image";

export default function Testimonials() {
    const testimonials = [
        {
            body: "The psychometric analysis was eye-opening. It didn't just tell me what I'm good at, but why I gravitate towards certain roles. A game-changer for my career shift.",
            author: {
                name: "Sarah Chen",
                handle: "@sarahdesign",
                imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "As a late-stage graduate, I was lost. The AI-driven mapping provided a clear, actionable roadmap that landed me my dream role in fintech within 3 months.",
            author: {
                name: "Alex Rivera",
                handle: "@arivera_dev",
                imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "The interface is stunning and the results are even better. It's rare to find a platform that feels so high-end yet remains deeply human and supportive.",
            author: {
                name: "James Wilson",
                handle: "@jwilson_strat",
                imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
    ];

    return (
        <section className="bg-background py-32 relative overflow-hidden transition-colors duration-500">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center mb-20"
                >
                    <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4">Success Stories</h2>
                    <p className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl leading-[1.1]">
                        Trusted by the <br />
                        <span className="text-gradient">Next Generation</span>
                    </p>
                </motion.div>

                <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                whileHover={{ y: -10 }}
                                className="group relative rounded-[2.5rem] bg-card p-10 shadow-2xl shadow-primary/5 border border-border transition-all duration-300"
                            >
                                <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
                                
                                <figure className="relative z-10 h-full flex flex-col justify-between">
                                    <blockquote className="text-muted-foreground text-lg leading-relaxed mb-10 font-medium italic">
                                        <p>{`"${testimonial.body}"`}</p>
                                    </blockquote>
                                    
                                    <figcaption className="mt-auto flex items-center gap-x-5">
                                        <NextImage 
                                            className="h-14 w-14 rounded-2xl bg-gray-50 object-cover shadow-lg border-2 border-white ring-4 ring-primary/5" 
                                            src={testimonial.author.imageUrl} 
                                            alt={testimonial.author.name}
                                            width={56}
                                            height={56}
                                            unoptimized
                                        />
                                        <div>
                                            <div className="font-black text-foreground text-lg">{testimonial.author.name}</div>
                                            <div className="text-primary font-bold text-sm tracking-wide">{testimonial.author.handle}</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

