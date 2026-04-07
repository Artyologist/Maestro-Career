import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background text-foreground pt-16 pb-8 border-t border-border/50 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Kinetic Glows */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

                    {/* Column 1: Identity */}
                    <div className="space-y-6 group">
                        <Link href="/" className="inline-block">
                            <h3 className="text-3xl font-black tracking-tightest uppercase text-foreground leading-none">
                                Maestro <br />
                                <span className="text-xs font-bold text-primary transition-colors">Career</span>
                            </h3>
                        </Link>
                        <p className="text-xs text-foreground/40 font-bold leading-relaxed uppercase tracking-widest max-w-xs">
                            Empowering the next generation with high-fidelity psychometric intelligence. Find your <span className="text-foreground/80">North Star.</span>
                        </p>

                        <div className="flex space-x-4">
                            {[Mail, Phone, Globe].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group/icon">
                                    <Icon size={14} className="group-hover/icon:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: System */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-primary/60">System.Architecture</h4>
                        <ul className="space-y-3 text-xs font-black uppercase tracking-widest text-foreground/50">
                            <li><Link href="/" className="hover:text-foreground transition-all flex items-center">/ Home</Link></li>
                            <li><Link href="/services" className="hover:text-foreground transition-all flex items-center">/ Services</Link></li>
                            <li><Link href="/about-us" className="hover:text-foreground transition-all flex items-center">/ About Us</Link></li>
                            <li><Link href="/#contact" className="hover:text-foreground transition-all flex items-center">/ Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Discovery */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-secondary/60">Professional.Mapping</h4>
                        <ul className="space-y-3 text-xs font-black uppercase tracking-widest text-foreground/50">
                            <li><a href="#" className="hover:text-foreground transition-all">Career Strategy</a></li>
                            <li><a href="#" className="hover:text-foreground transition-all">Resume Lab</a></li>
                            <li><a href="#" className="hover:text-foreground transition-all">Interview Coaching</a></li>
                            <li><a href="#" className="hover:text-foreground transition-all">Psychometric Intelligence</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Identification */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Contact Us</h4>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[9px] font-black uppercase text-foreground/40">Email:</h4>
                                <p className="text-sm font-bold text-foreground">info@maestrocareer.com</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h4 className="text-[9px] font-black uppercase text-foreground/40">Phone:</h4>
                                <p className="text-sm font-bold text-foreground">+91 98222 28484</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold leading-relaxed uppercase tracking-widest text-foreground/50 mb-2">
                                Maharashtra State Co-operative Bank, Khamla Rd, Nagpur 440015
                            </p>
                            <div className="w-full h-24 rounded-xl overflow-hidden border border-foreground/5 shadow-sm relative group">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.96054024997!2d79.0674004!3d21.114139299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x619795a114f30ecf%3A0x58b687f6fa0c4f40!2sMaestrocareer!5e0!3m2!1sen!2sin!4v1775239385123!5m2!1sen!2sin"
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                <a
                                    href="https://maps.app.goo.gl/tmtXg6TUrXej1D5QA?g_st=aw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-1 right-1 p-1.5 bg-background/90 backdrop-blur rounded-full text-foreground hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                                    title="Open in Maps"
                                >
                                    <ArrowUpRight size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Kinetic Strip */}
                <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center relative space-y-6 md:space-y-0">

                    {/* Left: Policy Links */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground/40 md:w-1/3">
                        <Link href="/privacy-policy" className="hover:text-foreground transition-colors px-2 py-1">Privacy</Link>
                        <Link href="/terms-conditions" className="hover:text-foreground transition-colors px-2 py-1">Terms</Link>
                        <Link href="/refund-cancellation" className="hover:text-foreground transition-colors px-2 py-1">Refunds</Link>
                        <Link href="/cookie-policy" className="hover:text-foreground transition-colors px-2 py-1">Cookies</Link>
                    </div>

                    {/* Center: Copyright */}
                    <div className="flex items-center justify-center space-x-4 md:w-1/3">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 text-center">
                            &copy; {new Date().getFullYear()} Maestro Career. All Rights Reserved.
                        </p>
                    </div>

                    {/* Right: Structural Buffer for absolute flex centering */}
                    <div className="hidden md:block md:w-1/3" />

                </div>
            </div>
        </footer>
    );
}
