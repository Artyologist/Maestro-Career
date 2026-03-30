"use client";

import React, { useState } from "react";
import { Check, X, Star, ChevronDown, ChevronUp } from "lucide-react";

type PlanType = "Basic" | "Intermediate" | "Advanced";

const commonFeatures = [
    "Pre-Career Counselling 1-1 Session (30 Min)",
    "Student Psychometric Analysis Test",
    "Student Parent Psychometric Test Evaluation (1 Session)",
    "Customize Career Discovery Planning Report",
    "General Career Sensitization & Awareness (Group Session)",
    "Live Group Sessions for Career Building Specific Career",
    "Lifetime Access to the Career Library",
    "New Age Career Opportunities After 12 (Group Session)",
    "Foreign Education & Scholarship Awareness (Group Session)",
    "Industry-Job Specific Technology Skill (Group Session)"
];

const tiers = [
    {
        name: "StartUp",
        id: "Basic" as PlanType,
        price: "₹5,000",
        description: "Essential career guidance for students starting their journey.",
        glowColor: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
        borderColor: "border-blue-100/50 hover:border-blue-300",
        activeBorder: "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
        buttonColor: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
        activeButtonColor: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
        badge: null,
        shortFeatures: [
            "Live 1-1 Session (1 Session)",
            "Pre-Career Counselling Session (30 Min)",
            "Student Psychometric Analysis Test",
            "Student Parent Test Evaluation",
            "Customize Career Discovery Report"
        ],
        features: [
            { name: "Live 1-1 Session", value: "1 Session", included: true },
            { name: "Career Suitability Report", value: "Not included", included: false },
            { name: "Profile Building Guidance", value: "Not included", included: false },
            { name: "Mentor Discussion", value: "Not included", included: false },
            { name: "CV Review", value: "Not included", included: false },
            { name: "Career Discussion", value: "Not included", included: false },
        ],
    },
    {
        name: "Growth",
        id: "Intermediate" as PlanType,
        price: "₹8,000",
        description: "Comprehensive support with extra guidance and mentorship.",
        glowColor: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
        borderColor: "border-purple-200/50 hover:border-purple-400",
        activeBorder: "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]",
        buttonColor: "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/30",
        activeButtonColor: "bg-purple-700 text-white shadow-md shadow-purple-500/40",
        badge: "Most Popular",
        shortFeatures: [
            "StartUp Plan Features",
            "Live 1-1 Session (2 Sessions)",
            "Career Suitability Report (2 Career Paths)",
            "Profile Building Guidance",
            "Mentor Discussion (80 Min)"
        ],
        features: [
            { name: "All StartUp Plan Features", value: "Included", included: true, special: true },
            { name: "Live 1-1 Session", value: "2 Sessions", included: true },
            { name: "Career Suitability Report", value: "2 Career Paths", included: true },
            { name: "Profile Building Guidance", value: "Included", included: true },
            { name: "Mentor Discussion", value: "80 Min", included: true },
            { name: "CV Review", value: "Not included", included: false },
            { name: "Career Discussion", value: "Not included", included: false },
        ],
    },
    {
        name: "Excel",
        id: "Advanced" as PlanType,
        price: "₹13,000",
        description: "Premium access, including CV review and extensive sessions.",
        glowColor: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]",
        borderColor: "border-cyan-100/50 hover:border-cyan-300",
        activeBorder: "border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.35)]",
        buttonColor: "bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white",
        activeButtonColor: "bg-cyan-600 text-white shadow-md shadow-cyan-500/30",
        badge: null,
        shortFeatures: [
            "StartUp + Growth Features",
            "Live 1-1 Session (4 Sessions)",
            "Career Suitability Report (3 Career Paths)",
            "Mentor Discussion (120 Min)",
            "CV Review",
            "Career Discussion"
        ],
        features: [
            { name: "All StartUp & Growth Features", value: "Included", included: true, special: true },
            { name: "Live 1-1 Session", value: "4 Sessions", included: true },
            { name: "Career Suitability Report", value: "3 Career Paths", included: true },
            { name: "Profile Building Guidance", value: "Included", included: true },
            { name: "Mentor Discussion", value: "120 Min", included: true },
            { name: "CV Review", value: "Included", included: true },
            { name: "Career Discussion", value: "Included", included: true },
        ],
    },
];

export default function Pricing() {
    const [activePlan, setActivePlan] = useState<PlanType | null>(null);
    const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedPlans((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden" id="pricing">
            {/* Background decoration elements for premium feel */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary tracking-wide uppercase">Pricing & Plans</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl font-sans tracking-tight">
                        Invest in your future career
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600 max-w-xl mx-auto">
                        Choose a tailored plan that best suits your career discovery needs. Empower your journey with expert guidance and insights.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-start gap-y-10 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
                    {tiers.map((tier) => {
                        const isActive = activePlan === tier.id;
                        const isExpanded = !!expandedPlans[tier.id];

                        return (
                            <div
                                key={tier.id}
                                onClick={() => setActivePlan(tier.id)}
                                className={`group relative flex flex-col rounded-3xl bg-white p-8 xl:p-10 transition-all duration-500 cursor-pointer border backdrop-blur-sm
                                    ${tier.glowColor} hover:-translate-y-2
                                    ${isActive ? `${tier.activeBorder} scale-[1.02] bg-white/95 z-20` : `${tier.borderColor} z-10 scale-100 opacity-95 hover:opacity-100`}
                                `}
                            >
                                {tier.badge && (
                                    <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
                                        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 border border-white/20">
                                            <Star className="w-4 h-4 fill-white text-white" />
                                            {tier.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="mt-2 text-sm text-slate-500 min-h-[40px] leading-relaxed">{tier.description}</p>
                                </div>

                                <div className="mb-6 flex items-baseline gap-x-2">
                                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">{tier.price}</span>
                                </div>

                                {/* Always visible short details */}
                                <div className="mb-8 flex-1">
                                    <ul className="space-y-3 text-sm leading-6 text-slate-700">
                                        {tier.shortFeatures.map((feat, idx) => (
                                            <li key={idx} className="flex gap-x-3 items-start">
                                                <Check className={`h-5 w-5 flex-none mt-0.5 ${feat.includes("StartUp Plan") || feat.includes("StartUp + Growth") ? 'text-indigo-500' : 'text-slate-400'}`} aria-hidden="true" />
                                                <span className={feat.includes("StartUp Plan") || feat.includes("StartUp + Growth") ? "font-bold text-indigo-700" : "font-medium"}>
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className={`mt-auto block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                        ${isActive ? tier.activeButtonColor : tier.buttonColor}
                                    `}
                                >
                                    {isActive ? "Plan Selected" : "Get Started"}
                                </button>

                                <button
                                    onClick={(e) => toggleExpand(tier.id, e)}
                                    className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2"
                                >
                                    {isExpanded ? (
                                        <>Hide full details <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>See full details <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>

                                {/* Expanded full features */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
                                >
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>

                                    <ul className="space-y-4 text-sm leading-6 text-slate-600">
                                        {/* Plan specific features */}
                                        <div className="mb-6 space-y-4">
                                            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Complete Plan Breakdown</p>
                                            {tier.features.map((feature, i) => (
                                                <li key={i} className="flex gap-x-3 items-start">
                                                    {feature.included ? (
                                                        <Check className={`h-5 w-5 flex-none mt-0.5 ${feature.special ? 'text-indigo-500' : 'text-green-500'}`} aria-hidden="true" />
                                                    ) : (
                                                        <X className="h-5 w-5 flex-none text-slate-300 mt-0.5" aria-hidden="true" />
                                                    )}
                                                    <span className={feature.included ? (feature.special ? "text-indigo-700 font-bold" : "text-slate-700 font-medium") : "text-slate-400"}>
                                                        {feature.name}
                                                        {feature.included && feature.value !== "Included" && (
                                                            <span className="text-slate-500 font-normal"> — {feature.value}</span>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </div>

                                        {/* Common features */}
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Core Benefits (All Plans)</p>
                                            {commonFeatures.map((feature, idx) => (
                                                <li key={idx} className="flex gap-x-3 items-start">
                                                    <Check className="h-4 w-4 flex-none text-slate-400 mt-1" aria-hidden="true" />
                                                    <span className="text-slate-500 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </div>
                                    </ul>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
