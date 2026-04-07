import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type AuthMode = "login" | "register";

type AuthShellProps = {
    mode: AuthMode;
    cardTitle: string;
    cardDescription: string;
    children: React.ReactNode;
};

const CONTENT: Record<
    AuthMode,
    {
        eyebrow: string;
        heading: string;
        description: string;
        highlights: string[];
    }
> = {
    login: {
        eyebrow: "Focused Sign In",
        heading: "A cleaner, calmer way to access Maestro Career.",
        description:
            "Use password, OTP, or Google sign-in in a focused auth space that stays readable across themes and screen sizes.",
        highlights: [
            "Standalone auth styling that does not inherit the marketing theme.",
            "Clear labels, visible validation, and touch-friendly controls.",
            "The same login, OTP, recovery, and dashboard routing underneath.",
        ],
    },
    register: {
        eyebrow: "Create Account",
        heading: "Set up your Maestro Career account with a guided flow.",
        description:
            "Start with your account details, verify your email, then finish your profile without losing the existing registration behavior.",
        highlights: [
            "Brand-led palette based on Maestro's indigo and cyan identity.",
            "A structured 3-step form with clear grouping and progress.",
            "Google onboarding, email OTP verification, and profile setup preserved.",
        ],
    },
};

    export function AuthShell({ mode, cardTitle, cardDescription, children }: AuthShellProps) {
        const content = CONTENT[mode];
    
        return (
            <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
                <Header />
    
                <div className="pointer-events-none absolute inset-0 overflow-hidden flex-1 mt-20">
                    <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
                    <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl mix-blend-screen" />
                    <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl mix-blend-screen" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
                </div>
    
                <div className="relative mx-auto flex flex-1 w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,480px)] lg:gap-12">
                            <section className="hidden lg:flex">
                                <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-[36px] bg-primary p-10 text-primary-foreground shadow-2xl shadow-primary/10">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_30%)]" />

                                    <div className="relative space-y-6">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-primary-foreground">
                                            <Sparkles className="h-4 w-4 text-white/80" />
                                            {content.eyebrow}
                                        </div>
    
                                        <div className="space-y-4">
                                            <h1 className="max-w-xl text-4xl font-semibold leading-tight">
                                                {content.heading}
                                            </h1>
                                            <p className="max-w-xl text-base leading-7 text-primary-foreground/80">
                                                {content.description}
                                            </p>
                                        </div>
                                    </div>
    
                                    <div className="relative space-y-4">
                                        {content.highlights.map((highlight) => (
                                            <div
                                                key={highlight}
                                                className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
                                            >
                                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-white/50" />
                                                <p className="text-sm leading-6 text-primary-foreground/90">{highlight}</p>
                                            </div>
                                        ))}
    
                                        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-primary-foreground/80">
                                            <ShieldCheck className="h-5 w-5 flex-none text-white/50" />
                                            Protected authentication flow with existing Supabase session handling.
                                        </div>
                                    </div>
                                </div>
                            </section>
    
                            <section className="flex items-start w-full">
                                <div className="w-full">
                                    <div className="mb-6 space-y-3 lg:hidden">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            {content.eyebrow}
                                        </div>
                                        <h1 className="text-3xl font-semibold leading-tight text-foreground">
                                            {content.heading}
                                        </h1>
                                        <p className="max-w-2xl text-sm leading-6 text-foreground/60">
                                            {content.description}
                                        </p>
                                    </div>
    
                                    <div className="w-full rounded-[32px] border border-border/20 bg-card p-5 shadow-2xl shadow-primary/5 sm:p-8">
                                        <div className="inline-flex w-full rounded-full bg-background/50 border border-border/20 p-1">
                                            <Link
                                                href="/login"
                                                className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
                                                    mode === "login"
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "text-foreground/60 hover:text-foreground hover:bg-background/80"
                                                }`}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/register"
                                                className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
                                                    mode === "register"
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "text-foreground/60 hover:text-foreground hover:bg-background/80"
                                                }`}
                                            >
                                                Register
                                            </Link>
                                        </div>

                                        <div className="mt-8 space-y-2">
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                                {cardTitle}
                                            </h2>
                                            <p className="text-sm leading-6 text-foreground/60">
                                                {cardDescription}
                                            </p>
                                        </div>
    
                                        <div className="mt-8">{children}</div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </main>
        );
    }
