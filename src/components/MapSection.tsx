"use client";

import { MapPin } from "lucide-react";

export default function MapSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Headquarters</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tightest uppercase text-foreground leading-none">
                        Locate <span className="text-primary">Us</span>
                    </h2>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest max-w-2xl mx-auto">
                        Maharashtra State Co-operative Bank, Khamla Rd, Nagpur, Maharashtra 440015
                    </p>
                </div>

                <div className="relative group rounded-3xl overflow-hidden border border-border/50 bg-card shadow-2xl transition-all duration-500 hover:border-primary/30">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-vibe-purple/5 pointer-events-none z-10" />

                    <div className="aspect-[16/9] md:aspect-[3/1] w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.96054024997!2d79.0674004!3d21.114139299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x619795a114f30ecf%3A0x58b687f6fa0c4f40!2sMaestrocareer!5e0!3m2!1sen!2sin!4v1775239385123!5m2!1sen!2sin"
                            className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Navigation Link overlay */}
                    <div className="absolute bottom-6 right-6 z-20">
                        <a
                            href="https://maps.app.goo.gl/tmtXg6TUrXej1D5QA?g_st=aw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-primary text-white font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-vibe-pink hover:scale-105 transition-all duration-300"
                        >
                            <span>Open Navigation</span>
                            <MapPin size={12} strokeWidth={3} />
                        </a>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 m-4 rounded-tl-xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 m-4 rounded-br-xl pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
