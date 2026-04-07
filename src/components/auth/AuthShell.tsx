import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

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
        <main className="min-h-screen overflow-hidden bg-[#f4f8ff] text-slate-900 [color-scheme:light]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-[#1DC5FE]/20 blur-3xl" />
                <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[#01015B]/10 blur-3xl" />
                <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-[#1DC5FE]/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
            </div>

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/" className="inline-flex items-center">
                        <Image
                            src="/maestro_logo.png"
                            alt="Maestro Career"
                            width={224}
                            height={50}
                            priority
                            className="h-auto w-[168px] sm:w-[200px] lg:w-[224px]"
                        />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#01015B]/20 hover:text-[#01015B]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>

                <div className="flex flex-1 items-center py-8 lg:py-12">
                    <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,480px)] lg:gap-12">
                        <section className="hidden lg:flex">
                            <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-[36px] bg-[#01015B] p-10 text-white shadow-[0_32px_80px_rgba(1,1,91,0.22)]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,197,254,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(29,197,254,0.12),transparent_30%)]" />

                                <div className="relative space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                                        <Sparkles className="h-4 w-4 text-[#1DC5FE]" />
                                        {content.eyebrow}
                                    </div>

                                    <div className="space-y-4">
                                        <h1 className="max-w-xl text-4xl font-semibold leading-tight">
                                            {content.heading}
                                        </h1>
                                        <p className="max-w-xl text-base leading-7 text-white/78">
                                            {content.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative space-y-4">
                                    {content.highlights.map((highlight) => (
                                        <div
                                            key={highlight}
                                            className="flex items-start gap-3 rounded-3xl border border-white/12 bg-white/10 px-5 py-4 backdrop-blur-sm"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#1DC5FE]" />
                                            <p className="text-sm leading-6 text-white/88">{highlight}</p>
                                        </div>
                                    ))}

                                    <div className="flex items-center gap-3 rounded-3xl border border-white/12 bg-white/8 px-5 py-4 text-sm text-white/78">
                                        <ShieldCheck className="h-5 w-5 flex-none text-[#1DC5FE]" />
                                        Protected authentication flow with existing Supabase session handling.
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="flex items-start">
                            <div className="w-full">
                                <div className="mb-6 space-y-3 lg:hidden">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[#01015B]/10 bg-white px-4 py-2 text-sm font-medium text-[#01015B] shadow-sm">
                                        <Sparkles className="h-4 w-4 text-[#1DC5FE]" />
                                        {content.eyebrow}
                                    </div>
                                    <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                                        {content.heading}
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                                        {content.description}
                                    </p>
                                </div>

                                <div className="rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
                                    <div className="inline-flex w-full rounded-full bg-slate-100 p-1">
                                        <Link
                                            href="/login"
                                            className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
                                                mode === "login"
                                                    ? "bg-[#01015B] text-white shadow-sm"
                                                    : "text-slate-600 hover:text-[#01015B]"
                                            }`}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
                                                mode === "register"
                                                    ? "bg-[#01015B] text-white shadow-sm"
                                                    : "text-slate-600 hover:text-[#01015B]"
                                            }`}
                                        >
                                            Register
                                        </Link>
                                    </div>

                                    <div className="mt-8 space-y-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                                            {cardTitle}
                                        </h2>
                                        <p className="text-sm leading-6 text-slate-600">
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
        </main>
    );
}
