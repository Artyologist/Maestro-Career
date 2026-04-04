"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTheme } from "next-themes";

export type ColorTheme = "kids" | "cyber" | "minimal" | "sunset" | "emerald" | "ocean";

interface ThemeOption {
    id: ColorTheme;
    name: string;
    lightBg: string;
    darkBg: string;
    primary: string;
    description: string;
}

export const THEMES: ThemeOption[] = [
    { id: "kids", name: "Playful Kids", lightBg: "#FFE2AF", darkBg: "#0c2830", primary: "#3F9AAE", description: "Bright, punchy, and highly energetic." },
    { id: "cyber", name: "Neon Cyber", lightBg: "#F5F0FF", darkBg: "#0B001F", primary: "#F900BF", description: "Futuristic purple and pink synthwave vibe." },
    { id: "minimal", name: "Sleek Minimal", lightBg: "#f8f9fa", darkBg: "#121212", primary: "#212529", description: "Clean, monochrome, and distraction-free." },
    { id: "sunset", name: "Warm Sunset", lightBg: "#ffebd6", darkBg: "#2d1611", primary: "#f75c03", description: "Cozy oranges and fading reds." },
    { id: "emerald", name: "Earthy Emerald", lightBg: "#FFF8EC", darkBg: "#546B41", primary: "#546B41", description: "Nature-inspired, calm, and organic tones." },
    { id: "ocean", name: "Deep Ocean", lightBg: "#EEEEEE", darkBg: "#222831", primary: "#00ADB5", description: "Clean, modern, and deep aesthetic." },
];

export function useColorTheme() {
    const [colorTheme, setColorTheme] = useState<ColorTheme>("kids");

    useEffect(() => {
        const stored = localStorage.getItem("color-theme") as ColorTheme;
        if (stored) {
            setColorTheme(stored);
            document.documentElement.setAttribute("data-theme", stored);
        } else {
            document.documentElement.setAttribute("data-theme", "kids");
        }
    }, []);

    const changeTheme = (theme: ColorTheme) => {
        setColorTheme(theme);
        localStorage.setItem("color-theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    return { colorTheme, changeTheme };
}

interface ThemeChangerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ThemeChanger({ isOpen, onClose }: ThemeChangerProps) {
    const { colorTheme, changeTheme } = useColorTheme();
    const { theme } = useTheme();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-background border-[3px] border-primary/20 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b-2 border-primary/10 flex items-center justify-between bg-secondary/10">
                            <div>
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-widest">Theme Selector</h2>
                                <p className="text-sm font-bold text-foreground/50">Personalize your platform aesthetic</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-foreground/5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {THEMES.map((t) => (
                                    <motion.button
                                        key={t.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => changeTheme(t.id)}
                                        className={`relative group flex flex-col text-left overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
                                            colorTheme === t.id ? "border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "border-foreground/5 hover:border-primary/40"
                                        }`}
                                    >
                                        <div 
                                            className="h-28 w-full relative transition-colors duration-500 flex items-center justify-center p-4"
                                            style={{ backgroundColor: theme === 'dark' ? t.darkBg : t.lightBg }}
                                        >
                                            <div 
                                                className="w-16 h-16 rounded-xl shadow-lg border-2 border-black/10 flex items-center justify-center text-white"
                                                style={{ backgroundColor: t.primary }}
                                            >
                                                <span className="font-black text-2xl uppercase">{t.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-card flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-black text-lg text-foreground uppercase tracking-wide">{t.name}</h3>
                                                {colorTheme === t.id && (
                                                    <div className="bg-primary text-white p-1 rounded-full">
                                                        <Check size={14} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-foreground/60 leading-relaxed">{t.description}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
