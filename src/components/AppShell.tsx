"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import MainLayout from "@/components/MainLayout";

function isStandaloneAuthRoute(pathname: string | null) {
    return pathname === "/login" || pathname === "/register" || pathname === "/auth";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (isStandaloneAuthRoute(pathname)) {
        return <>{children}</>;
    }

    return (
        <MainLayout>
            {children}
            <Chatbot />
        </MainLayout>
    );
}
