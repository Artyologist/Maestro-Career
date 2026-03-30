export interface Plan {
    id: string;
    name: string;
    priceInr: number;
    description: string;
    summary: string;
    features: string[];
    mostPopular?: boolean;
}

export const PLANS: Plan[] = [
    {
        id: "starter",
        name: "Starter",
        priceInr: 1999,
        description: "Perfect for students beginning their career clarity journey.",
        summary:
            "A focused kickoff package with guided mapping, baseline assessment, and action checkpoints to start moving with confidence.",
        features: [
            "Career orientation call",
            "Initial aptitude mapping",
            "Email support for 14 days",
            "Personalized first-step roadmap",
        ],
    },
    {
        id: "professional",
        name: "Professional",
        priceInr: 4999,
        description: "Best for serious preparation across career, resume, and interview readiness.",
        summary:
            "Our most selected plan that blends deep profiling, strategy sessions, and execution support to accelerate outcomes.",
        features: [
            "Everything in Starter",
            "Psychometric + aptitude deep analysis",
            "Resume and LinkedIn optimization",
            "Interview prep mock sessions",
            "Priority support for 30 days",
        ],
        mostPopular: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        priceInr: 9999,
        description: "For advanced candidates and professionals targeting high-impact transitions.",
        summary:
            "A premium mentorship track with strategic planning, personalized coaching, and dedicated guidance for complex goals.",
        features: [
            "Everything in Professional",
            "1:1 expert mentorship plan",
            "Portfolio and profile storytelling",
            "Role transition strategy",
            "Dedicated support for 60 days",
            "Priority review slots",
        ],
    },
];

export function getPlanById(planId: string) {
    return PLANS.find((plan) => plan.id === planId);
}

export function formatInr(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}
