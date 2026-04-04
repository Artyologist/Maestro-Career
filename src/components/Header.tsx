"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

import ThemeChanger from "./ThemeChanger";

interface MeResponse {
    success: boolean;
    data?: {
        profile: {
            name: string;
            email: string;
            mobile?: string;
            countryCode?: string;
            city?: string;
            userType?: "student" | "working_professional";
        };
    };
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isThemeChangerOpen, setIsThemeChangerOpen] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileMobile, setProfileMobile] = useState("");
    const [profileCity, setProfileCity] = useState("");
    const [profileType, setProfileType] = useState("");
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const profileMenuRef = useRef<HTMLDivElement | null>(null);
    const moreMenuRef = useRef<HTMLDivElement | null>(null);

    // Scroll Progress Logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        let alive = true;

        const loadAuthState = async () => {
            try {
                const response = await fetch("/api/auth/me", { method: "GET", cache: "no-store" });
                const data: MeResponse = await response.json();
                if (!alive) {
                    return;
                }

                if (response.ok && data.success && data.data?.profile) {
                    const profile = data.data.profile;
                    setIsAuthenticated(true);
                    setProfileName(profile.name || profile.email || "User");
                    setProfileEmail(profile.email || "-");
                    setProfileMobile(profile.mobile || "-");
                    setProfileCity(profile.city || "-");
                    setProfileType(profile.userType === "working_professional" ? "Working Professional" : profile.userType === "student" ? "Student" : "-");
                    return;
                }

                setIsAuthenticated(false);
                setProfileName("");
                setProfileEmail("");
                setProfileMobile("");
                setProfileCity("");
                setProfileType("");
            } catch {
                if (!alive) {
                    return;
                }
                setIsAuthenticated(false);
                setProfileName("");
                setProfileEmail("");
                setProfileMobile("");
                setProfileCity("");
                setProfileType("");
            } finally {
                if (alive) {
                    setAuthLoading(false);
                }
            }
        };

        loadAuthState();

        return () => {
            alive = false;
        };
    }, [pathname]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setIsMoreMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            setIsProfileMenuOpen(false);
            setIsAuthenticated(false);
            router.push("/auth");
            router.refresh();
        }
    };

    const profileInitial = profileName.trim().charAt(0).toUpperCase() || "U";

    const navItems = [
        { name: 'Services', href: '/services' },
        { name: 'Solution', href: '/#solution' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'About Us', href: '/about-us' },
        { name: 'Contact', href: '/#contact' },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isHome && href.startsWith('/') && href.length > 1) {
            const id = href.substring(1);
            const element = document.getElementById(id);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: 'smooth' });
                setIsOpen(false);
            }
        }
    };

    if (!mounted) return null;

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 bg-background border-b-[3px] border-primary/20 h-28 flex items-center shadow-sm`}>
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-2 bg-primary origin-left z-[60]"
                style={{ scaleX }}
            />

            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-16 h-16 overflow-hidden flex items-center justify-center transition-all bg-white dark:bg-transparent rounded-2xl shadow-sm border-2 border-primary/10">
                                <Image
                                    src="/maestro_logo_only.png"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    priority
                                    style={{ width: "40px", height: "auto" }}
                                    className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                                />
                            </div>
                            <span className="text-3xl font-black tracking-tightest uppercase text-primary leading-none">
                                Maestro <br />
                                <span className="text-lg font-bold text-secondary-foreground">Career</span>
                            </span>
                        </Link>
                     </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="text-base font-black uppercase tracking-widest text-foreground/70 hover:text-primary transition-all hover:-translate-y-1"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="relative" ref={moreMenuRef}>
                            <button
                                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                                className="text-base font-black uppercase tracking-widest text-foreground/70 hover:text-primary transition-all hover:-translate-y-1 flex items-center gap-1"
                            >
                                More <span className="text-xs">▼</span>
                            </button>
                            <AnimatePresence>
                                {isMoreMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-4 w-56 rounded-2xl border-4 border-primary/20 bg-background p-2 shadow-2xl origin-top-right overflow-hidden"
                                    >
                                        <button
                                            onClick={() => {
                                                setIsMoreMenuOpen(false);
                                                setIsThemeChangerOpen(true);
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors text-sm font-black uppercase tracking-widest"
                                        >
                                            Theme Changer 🎨
                                        </button>
                                        {/* Other potential links here */}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-8 w-[3px] rounded-full bg-primary/20 mx-2" />

                        {/* Theme Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-3 bg-secondary/30 rounded-full text-foreground hover:bg-secondary/60 hover:text-primary transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                        </motion.button>

                        {!authLoading && !isAuthenticated && (
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 px-8 py-4 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-full hover:scale-105 hover:shadow-lg hover:shadow-accent/40 transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </Link>
                        )}

                        {!authLoading && isAuthenticated && (
                            <div className="flex items-center gap-4" ref={profileMenuRef}>
                                <Link
                                    href="/dashboard"
                                    className="px-6 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-full hover:scale-105 hover:shadow-lg transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    type="button"
                                    aria-label="Open profile"
                                    title="Open profile"
                                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                    className="h-14 w-14 rounded-full bg-accent text-white border-b-4 border-black/20 flex items-center justify-center text-xl font-black hover:scale-105 transition-transform active:border-b-0 active:translate-y-1"
                                >
                                    {profileInitial}
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                            className="absolute right-12 top-[90px] w-72 rounded-[2rem] border-4 border-primary/20 bg-background p-5 shadow-2xl"
                                        >
                                            <p className="text-lg font-black text-foreground">{profileName || "User"}</p>
                                            <p className="mt-1 text-sm text-foreground/60 font-bold">{profileEmail}</p>

                                            <div className="mt-5 space-y-3 rounded-2xl border-2 border-primary/10 bg-white/50 p-4 text-sm text-foreground/80">
                                                <p><span className="font-black text-primary">Mobile:</span> {profileMobile}</p>
                                                <p><span className="font-black text-primary">Type:</span> {profileType}</p>
                                                <p><span className="font-black text-primary">City:</span> {profileCity}</p>
                                            </div>

                                            <div className="mt-5 grid gap-3">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="w-full rounded-xl border-2 border-primary/20 px-4 py-3 text-center text-sm font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    Open Profile
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-red-500 hover:scale-105 transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </nav>

                    {/* Mobile control */}
                    <div className="md:hidden flex items-center gap-6">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-foreground/60"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-foreground"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full bg-background border-b border-foreground/10 md:hidden overflow-hidden z-50 shadow-2xl"
                    >
                        <div className="p-8 space-y-6 bg-background">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-2xl font-black uppercase tracking-tightest text-foreground hover:opacity-50 transition-opacity"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-6 border-t border-foreground/5 space-y-4">
                                {!authLoading && !isAuthenticated && (
                                    <Link
                                        href="/auth"
                                        className="block w-full py-5 text-center font-black uppercase tracking-widest text-background bg-foreground text-sm"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Launch Platform
                                    </Link>
                                )}
                                {!authLoading && isAuthenticated && (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="block w-full py-5 text-center font-black uppercase tracking-widest text-background bg-foreground text-sm"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="block w-full py-5 text-center font-black uppercase tracking-widest text-foreground border border-foreground/10 text-sm"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            type="button"
                                            className="block w-full py-5 text-center font-black uppercase tracking-widest text-white bg-red-600 text-sm"
                                            onClick={async () => {
                                                await handleLogout();
                                                setIsOpen(false);
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Theme Selector Modal */}
            <ThemeChanger 
                isOpen={isThemeChangerOpen} 
                onClose={() => setIsThemeChangerOpen(false)} 
            />
        </header>
    );
}
