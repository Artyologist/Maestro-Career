"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { formatInr, getPlanById, PLANS } from "@/data/plans";

import { DashboardData } from "@/lib/auth-supabase";

interface DashboardResponse {
    success: boolean;
    data?: DashboardData;
    message?: string;
}

interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
    handler: (response: RazorpaySuccessResponse) => Promise<void>;
    modal: {
        ondismiss: () => void;
    };
}

type RazorpayCtor = new (options: RazorpayOptions) => { open: () => void };

const SERVICE_OPTIONS = [
    "Career Coaching",
    "Psychometric Assessment",
    "Interview Prep",
    "Skill Mapping",
    "College Guidance",
];

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [error, setError] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [dashboard, setDashboard] = useState<DashboardResponse["data"]>(undefined);
    const [isPaying, setIsPaying] = useState(false);
    const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);

    const selectedPlan = dashboard?.profile.selectedPlanId ? getPlanById(dashboard.profile.selectedPlanId) : null;

    const [onboardingData, setOnboardingData] = useState({
        name: "",
        preferredServices: [] as string[],
        password: "",
    });

    const loadData = useCallback(async () => {
        try {
            const resp = await fetch("/api/auth/me", { method: "GET" });
            const data: DashboardResponse = await resp.json();

            if (!resp.ok || !data.success || !data.data) {
                router.replace("/login");
                return;
            }

            const profile = data.data.profile;
            setDashboard(data.data);
            setOnboardingData((prev) => ({
                ...prev,
                name: profile.name === "Learner" ? "" : profile.name,
                preferredServices: profile.preferredServices,
            }));
        } catch {
            setError("Unable to load dashboard right now.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const toggleService = (service: string) => {
        setOnboardingData((prev) => {
            const exists = prev.preferredServices.includes(service);
            if (exists) {
                return {
                    ...prev,
                    preferredServices: prev.preferredServices.filter((item) => item !== service),
                };
            }
            if (prev.preferredServices.length >= 5) {
                return prev;
            }
            return {
                ...prev,
                preferredServices: [...prev.preferredServices, service],
            };
        });
    };

    const handleCompleteProfile = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setProfileMessage("");
        setSavingProfile(true);

        try {
            const resp = await fetch("/api/auth/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(onboardingData),
            });
            const data = await resp.json();

            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Unable to complete profile.");
            }

            setProfileMessage("Profile setup completed. You can now access everything.");
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to complete profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePayNow = async () => {
        if (!selectedPlan || !dashboard) return;

        setError("");
        const razorpayCtor = (window as Window & { Razorpay?: RazorpayCtor }).Razorpay;
        if (!razorpayCtor) {
            setError("Payment gateway did not load. Please refresh.");
            return;
        }

        setIsPaying(true);

        try {
            const orderResp = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: selectedPlan.id,
                    buyerName: dashboard.profile.name,
                    buyerEmail: dashboard.profile.email,
                    buyerMobile: dashboard.profile.mobile,
                }),
            });

            const orderData = await orderResp.json();
            if (!orderResp.ok || !orderData.success) {
                throw new Error(orderData.message || "Unable to start payment.");
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Maestro Career",
                description: `${selectedPlan.name} Plan`,
                order_id: orderData.order.id,
                prefill: {
                    name: dashboard.profile.name,
                    email: dashboard.profile.email,
                    contact: dashboard.profile.mobile,
                },
                theme: { color: "#1294DD" },
                handler: async function (response: RazorpaySuccessResponse) {
                    try {
                        const verifyResp = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });
                        const verifyData = await verifyResp.json();

                        if (verifyResp.ok && verifyData.success) {
                            await loadData();
                        } else {
                            throw new Error(verifyData.message || "Verification failed.");
                        }
                    } catch (err) {
                        setError(err instanceof Error ? err.message : "Payment verification failed.");
                    } finally {
                        setIsPaying(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsPaying(false);
                    }
                }
            };

            const razorpay = new razorpayCtor(options);
            razorpay.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not start payment.");
            setIsPaying(false);
        }
    };

    const handleSelectPlan = async (planId: string) => {
        setError("");
        setSelectingPlanId(planId);

        try {
            const resp = await fetch("/api/profile/select-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            });
            const data = await resp.json();

            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Unable to select plan.");
            }

            // Redirect to payment/checkout page instead of just reloading data
            router.push(`/checkout/${planId}`);
        } catch (planError) {
            setError(planError instanceof Error ? planError.message : "Unable to select plan.");
            setSelectingPlanId(null);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <Header />

            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {loading && (
                        <div className="max-w-4xl mx-auto rounded-3xl border border-border/20 bg-card p-12 text-center shadow-sm animate-pulse">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-foreground/60 font-medium text-sm">Loading your dashboard...</p>
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="max-w-4xl mx-auto rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-destructive text-center">
                            <h3 className="text-lg font-semibold mb-2">Error loading data</h3>
                            <p className="text-sm opacity-80">{error}</p>
                            <button onClick={loadData} className="mt-6 px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">Try again</button>
                        </div>
                    )}

                    {!loading && dashboard && (
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* Top Header Card */}
                            <div className="rounded-3xl border border-border/20 bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden transition-all shadow-sm w-full">
                                <div className="relative z-10 flex flex-col items-start gap-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Welcome, <span className="text-primary">{dashboard.profile.name}</span>
                                    </h1>
                                    <p className="text-foreground/60 text-sm">Manage your profile, assessments, and services.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="relative z-10 rounded-xl bg-background border border-border/20 hover:border-border/40 text-foreground px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Plan and Assessment Section */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                {dashboard.profile.selectedPlanId ? (
                                    <div className="rounded-3xl border border-border/20 bg-card p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 justify-start mb-6">
                                                <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-4">{selectedPlan?.name}</h3>

                                            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background border border-border/20 rounded-2xl p-6 gap-4">
                                                <div>
                                                    <p className="text-xs font-medium text-foreground/50 mb-1">Total Fee</p>
                                                    <p className="text-xl font-bold text-primary">{formatInr(selectedPlan?.priceInr || 0)}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="text-xs font-medium text-foreground/50 mb-1">Status</p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${dashboard.profile.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                                                        {dashboard.profile.paymentStatus || 'UNPAID'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 relative z-10">
                                            {dashboard.profile.paymentStatus === 'paid' ? (
                                                <div className="flex items-center gap-3 text-emerald-600 font-medium bg-emerald-500/5 rounded-xl p-4 justify-center border border-emerald-500/20">
                                                    <span className="text-sm">Payment Verified</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handlePayNow}
                                                    disabled={isPaying}
                                                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-4 transition-colors disabled:opacity-70"
                                                >
                                                    {isPaying ? "Loading gateway..." : "Pay Now"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-border/20 bg-card p-10 flex flex-col text-center shadow-sm">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">No Plan Selected</h3>
                                        <p className="text-foreground/60 text-sm max-w-sm mx-auto mb-8">Select a plan from below. Once selected, you&apos;ll be able to proceed with payment.</p>

                                        <div className="grid sm:grid-cols-3 gap-4 text-left mb-6">
                                            {PLANS.map((plan) => {
                                                const active = selectingPlanId === plan.id;
                                                return (
                                                    <div key={plan.id} className="rounded-2xl border border-border/20 bg-background p-4 flex flex-col gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                                                            <p className="text-xs text-foreground/60 mt-1">{formatInr(plan.priceInr)}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectPlan(plan.id)}
                                                            disabled={!!selectingPlanId}
                                                            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 text-center"
                                                        >
                                                            {active ? "Selecting..." : "Select"}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <Link href="/#pricing" className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center justify-center gap-1">
                                            Compare full plan details &rarr;
                                        </Link>
                                    </div>
                                )}

                                {dashboard.profile.psychometricTestLink ? (
                                    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 flex flex-col justify-between relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 justify-start mb-6">
                                                <h2 className="text-lg font-semibold text-foreground">Psychometric Assessment</h2>
                                            </div>
                                            <p className="text-sm text-foreground/60 leading-relaxed mb-8">
                                                Your personalized psychometric assessment is ready. Click below to begin.
                                            </p>
                                        </div>
                                        <div className="relative z-10 mt-auto">
                                            <a
                                                href={dashboard.profile.psychometricTestLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm py-4 transition-colors"
                                            >
                                                Start Assessment &rarr;
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-border/20 bg-card p-10 flex flex-col items-center justify-center text-center shadow-sm">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Assessment Link Pending</h3>
                                        <p className="text-sm text-foreground/60 max-w-sm">After you complete your payment, your assessment link will be generated and displayed here within 24-48 hours.</p>
                                    </div>
                                )}
                            </div>

                            {!dashboard.profile.onboardingCompleted && (
                                <div className="rounded-3xl border border-border/20 bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h2 className="text-xl font-semibold text-foreground mb-1">Complete your profile</h2>
                                        <p className="text-sm text-foreground/60 mb-8">Provide a few more details to finalize your account setup.</p>

                                        {profileMessage && (
                                            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
                                                {profileMessage}
                                            </div>
                                        )}

                                        <form onSubmit={handleCompleteProfile} className="space-y-6 max-w-xl">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-foreground/80">Full Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={onboardingData.name}
                                                        onChange={(e) => setOnboardingData((prev) => ({ ...prev, name: e.target.value }))}
                                                        className="block w-full rounded-xl border border-border/30 bg-background px-4 py-3 text-[15px] text-foreground shadow-sm outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20"
                                                        placeholder="Your full name"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="block text-sm font-medium text-foreground/80">Services of Interest (Up to 5)</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {SERVICE_OPTIONS.map((service) => {
                                                        const selected = onboardingData.preferredServices.includes(service);
                                                        return (
                                                            <button
                                                                key={service}
                                                                type="button"
                                                                onClick={() => toggleService(service)}
                                                                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground/70 border-border/30 hover:border-border/60 hover:text-foreground"}`}
                                                            >
                                                                {service}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={savingProfile}
                                                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-sm font-medium transition-colors disabled:opacity-70 mt-4"
                                            >
                                                {savingProfile ? "Saving..." : "Save Profile"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Stats Cards */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { label: "Days Active", value: dashboard.metrics.accountAgeDays },
                                    { label: "Total Logins", value: dashboard.metrics.totalLogins },
                                    { label: "Inquiries", value: dashboard.metrics.inquiryCount },
                                ].map((stat, idx) => (
                                    <div key={idx} className="rounded-3xl bg-card border border-border/20 p-8 shadow-sm flex flex-col justify-center">
                                        <p className="text-sm font-medium text-foreground/50">{stat.label}</p>
                                        <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Profile Details Card */}
                                <div className="rounded-3xl border border-border/20 bg-card p-8 shadow-sm">
                                    <h2 className="text-lg font-semibold text-foreground mb-6">
                                        Account Details
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Name", value: dashboard.profile.name },
                                            { label: "Email", value: dashboard.profile.email },
                                            { label: "Phone", value: dashboard.profile.mobile },
                                            { label: "Status", value: dashboard.profile.onboardingCompleted ? "Complete" : "Incomplete" },
                                            { label: "City", value: dashboard.profile.city || "Not provided" },
                                        ].map((info, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/10 last:border-0 last:pb-0 gap-1 sm:gap-4">
                                                <span className="text-sm font-medium text-foreground/60">{info.label}</span>
                                                <span className="text-sm font-semibold text-foreground truncate">{info.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {dashboard.profile.preferredServices.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-border/10">
                                            <p className="text-sm font-medium text-foreground/60 mb-3">Interested in:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {dashboard.profile.preferredServices.map((item) => (
                                                    <span
                                                        key={item}
                                                        className="inline-flex items-center rounded-lg bg-background border border-border/20 px-3 py-1.5 text-xs font-medium text-foreground/70"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Activity Log Card */}
                                <div className="rounded-3xl border border-border/20 bg-card p-8 shadow-sm">
                                    <h2 className="text-lg font-semibold text-foreground mb-6">
                                        Recent Activity
                                    </h2>
                                    <div className="space-y-6">
                                        {dashboard.recentActivity.length === 0 && (
                                            <div className="py-12 text-center">
                                                <p className="text-sm text-foreground/50">No recent activity.</p>
                                            </div>
                                        )}
                                        {dashboard.recentActivity.map((item) => (
                                            <div key={item.id} className="relative pl-6 border-l-2 border-border/20">
                                                <div className="absolute left-[-5px] top-1.5 w-2 h-2 bg-primary rounded-full" />
                                                <p className="text-sm font-medium text-foreground mb-1">{item.message}</p>
                                                <p className="text-xs text-foreground/50">{new Date(item.at).toLocaleDateString()} at {new Date(item.at).toLocaleTimeString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modules Panel */}
                            <div className="w-full">
                                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Links</h2>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {dashboard.websiteModules.map((module) => (
                                        <Link
                                            key={module.title}
                                            href={module.route}
                                            className="rounded-2xl border border-border/20 bg-card p-6 hover:border-primary/30 transition-colors shadow-sm flex flex-col items-start gap-2"
                                        >
                                            <p className="text-base font-semibold text-foreground">{module.title}</p>
                                            <p className="text-xs text-foreground/60 flex-1">{module.description}</p>
                                            <div className="mt-4 flex items-center gap-1 text-primary text-xs font-medium">
                                                Open &rarr;
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
