import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-card text-foreground pt-32 pb-12 border-t border-border/50 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Kinetic Glows */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-vibe-blue/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-vibe-purple/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-32">

                    {/* Column 1: Identity */}
                    <div className="space-y-10 group">
                        <Link href="/" className="inline-block">
                            <h3 className="text-4xl font-black tracking-tightest uppercase text-foreground leading-[0.85]">
                                Maestro <br />
                                <span className="text-sm font-bold text-primary group-hover:text-vibe-pink transition-colors">Career</span>
                            </h3>
                        </Link>
                        <p className="text-sm text-foreground/40 font-bold leading-relaxed uppercase tracking-widest max-w-xs">
                            Empowering the next generation with high-fidelity psychometric intelligence. Find your <span className="text-foreground/80">North Star.</span>
                        </p>

                        <div className="flex space-x-6">
                            {[Mail, Phone, Globe].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group/icon">
                                    <Icon size={18} className="group-hover/icon:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: System */}
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-12 text-primary/60">System.Architecture</h4>
                        <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-foreground/40">
                            <li><Link href="/" className="hover:text-foreground hover:translate-x-3 transition-all inline-flex items-center group">/ Home <ArrowUpRight className="ml-2 opacity-0 group-hover:opacity-100 scale-75" /></Link></li>
                            <li><Link href="/services" className="hover:text-foreground hover:translate-x-3 transition-all inline-flex items-center group">/ Services <ArrowUpRight className="ml-2 opacity-0 group-hover:opacity-100 scale-75" /></Link></li>
                            <li><Link href="/about-us" className="hover:text-foreground hover:translate-x-3 transition-all inline-flex items-center group">/ About Us <ArrowUpRight className="ml-2 opacity-0 group-hover:opacity-100 scale-75" /></Link></li>
                            <li><Link href="/#contact" className="hover:text-foreground hover:translate-x-3 transition-all inline-flex items-center group">/ Contact <ArrowUpRight className="ml-2 opacity-0 group-hover:opacity-100 scale-75" /></Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Discovery */}
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-12 text-vibe-purple/60">Professional.Mapping</h4>
                        <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-foreground/40">
                            <li><a href="#" className="hover:text-foreground transition-all flex items-center group">Career Strategy <div className="ml-auto w-1 h-1 bg-vibe-purple opacity-0 group-hover:opacity-100" /></a></li>
                            <li><a href="#" className="hover:text-foreground transition-all flex items-center group">Resume Lab <div className="ml-auto w-1 h-1 bg-vibe-purple opacity-0 group-hover:opacity-100" /></a></li>
                            <li><a href="#" className="hover:text-foreground transition-all flex items-center group">Interview Coaching <div className="ml-auto w-1 h-1 bg-vibe-purple opacity-0 group-hover:opacity-100" /></a></li>
                            <li><a href="#" className="hover:text-foreground transition-all flex items-center group">Psychometric Intelligence <div className="ml-auto w-1 h-1 bg-vibe-purple opacity-0 group-hover:opacity-100" /></a></li>
                        </ul>
                    </div>

                    {/* Column 4: Identification */}
                    <div className="space-y-12">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">Contact Us</h4>
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-foreground/20">Email</h4>
                                <p className="text-lg font-black tracking-tight leading-none text-foreground uppercase">info@maestrocareer.com</p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-foreground/20">Phone No.</h4>
                                <p className="text-lg font-black tracking-tight leading-none text-foreground">+91 98222 28484</p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-foreground/20">Office Address</h4>
                                <p className="text-[11px] font-bold leading-relaxed uppercase tracking-widest text-foreground/60 max-w-[200px]">
                                    Maharashtra State Co-operative Bank, Khamla Rd, Nagpur, Maharashtra 440015
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Kinetic Strip */}
                <div className="pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center space-y-10 md:space-y-0">
                    <div className="flex items-center space-x-6">
                        <div className="w-2 h-2 rounded-full bg-vibe-emerald animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">
                            &copy; {new Date().getFullYear()} Maestro Career. Vibrant Kinetic System.
                        </p>
                    </div>
                    <div className="flex space-x-12 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                        <Link href="/privacy-policy" className="hover:text-foreground transition-colors hover:italic">Privacy</Link>
                        <Link href="/terms-conditions" className="hover:text-foreground transition-colors hover:italic">Terms</Link>
                        <Link href="/refund-cancellation" className="hover:text-foreground transition-colors hover:italic">Refunds</Link>
                        <Link href="/cookie-policy" className="hover:text-foreground transition-colors hover:italic">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
