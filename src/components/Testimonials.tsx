"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import NextImage from "next/image";

export default function Testimonials() {
    // 🔮 FUTURE SCOPE: This array models the exact structure expected from a Google Reviews API integration.
    // In the future, simply replace this hardcoded array with a fetch() call returning mapped reviews.
    const baseTestimonials = [
        {
            body: "The career counseling session completely shifted my perspective. I was confused between IT and Management, and the data-backed insights helped me securely plan out my MBA roadmap.",
            author: {
                name: "Rahul Sharma",
                handle: "@rahul_sharma",
                imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "Highly practical advice! They didn't just give me a generalized report; the mentors actually broke down exactly what skills I was missing for a dedicated product design role.",
            author: {
                name: "Ananya Desai",
                handle: "@ananya_d",
                imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "I initially doubted psychometric testing, but the sheer accuracy of their assessment blew me away. I am now confidently pursuing a career path aligned with what I am naturally good at.",
            author: {
                name: "Vikram Patel",
                handle: "@vikram_tech",
                imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "The team is incredible. Rather than feeling like a robot analyzed me, it felt like an actual human guide listened to my goals and created a customized prep schedule for me.",
            author: {
                name: "Priya Iyer",
                handle: "@priya_iyer93",
                imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "I went from being completely overwhelmed regarding modern job hunting to confidently securing an internship within 45 days. The personalized skill development truly works flawlessly.",
            author: {
                name: "Rohit Verma",
                handle: "@rohitv_official",
                imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
    ];

    // Duplicate array to enable seamless infinite scrolling loop
    const testimonials = [...baseTestimonials, ...baseTestimonials];

    return (
        <section className="bg-background py-32 relative overflow-hidden transition-colors duration-500">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-20">
                    <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4">Success Stories</h2>
                    <p className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl leading-[1.1]">
                        Trusted by the <br />
                        <span className="text-gradient">Next Generation</span>
                    </p>
                </div>
            </div>

            {/* Infinite Horizontal Carousel */}
            <div className="relative flex overflow-hidden w-full group mt-16 cursor-grab active:cursor-grabbing">
                {/* Gradient Masks for smooth edge fading */}
                <div className="absolute inset-y-0 left-0 w-1/6 md:w-1/4 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-1/6 md:w-1/4 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                <div 
                    className="flex shrink-0 gap-8 min-w-max px-4 animate-marquee hover:[animation-play-state:paused]"
                >
                    {testimonials.map((testimonial, idx) => (
                        <div 
                            key={idx}
                            className="relative w-[350px] md:w-[450px] shrink-0 rounded-[2.5rem] bg-card p-10 shadow-xl shadow-primary/5 border border-border flex flex-col justify-between whitespace-normal"
                        >
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/10" />
                            
                            <blockquote className="text-muted-foreground text-base leading-relaxed mb-10 font-medium italic">
                                <p>{`"${testimonial.body}"`}</p>
                            </blockquote>
                            
                            <figcaption className="mt-auto flex items-center gap-x-5">
                                <NextImage 
                                    className="h-14 w-14 rounded-2xl bg-gray-50 object-cover shadow-md border border-white ring-2 ring-primary/5" 
                                    src={testimonial.author.imageUrl} 
                                    alt={testimonial.author.name}
                                    width={56}
                                    height={56}
                                    unoptimized
                                />
                                <div>
                                    <div className="font-black text-foreground text-lg leading-tight">{testimonial.author.name}</div>
                                    <div className="text-primary font-bold text-xs tracking-wide">{testimonial.author.handle}</div>
                                </div>
                            </figcaption>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

