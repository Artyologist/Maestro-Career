"use client";

import React, { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Minimum loading time for visual impact
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <LoadingScreen key="loader" />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isLoading && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                        className="w-full relative"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
