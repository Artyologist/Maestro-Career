"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DashboardResponse {
    success: boolean;
    data?: {
        profile: {
            id: string;
            name: string;
            email: string;
            mobile: string;
            onboardingCompleted: boolean;
            hasPassword: boolean;
            createdAt: string;
            updatedAt: string;
            lastLoginAt?: string;
            lastLoginMethod?: "otp" | "password";
            loginCount: number;
            inquiryCount: number;
            preferredServices: string[];
        };
        metrics: {
            accountAgeDays: number;
            totalLogins: number;
            inquiryCount: number;
        };
        recentActivity: Array<{
            id: string;
            type: "registration" | "login" | "profile";
            message: string;
            at: string;
        }>;
        websiteModules: Array<{
            title: string;
            route: string;
            description: string;
        }>;
    };
    message?: string;
}

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

    const [onboardingData, setOnboardingData] = useState({
        name: "",
        preferredServices: [] as string[],
        password: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const resp = await fetch("/api/auth/me", { method: "GET" });
                const data: DashboardResponse = await resp.json();

                if (!resp.ok || !data.success || !data.data) {
                    router.replace("/auth");
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
        };

        load();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth");
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
            const meResp = await fetch("/api/auth/me", { method: "GET" });
            const meData: DashboardResponse = await meResp.json();
            if (meResp.ok && meData.success && meData.data) {
                setDashboard(meData.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to complete profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="py-14 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {loading && (
                        <div className="max-w-4xl mx-auto rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-600 shadow-sm">
                            Loading your dashboard...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="max-w-4xl mx-auto rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700 shadow-sm">
                            {error}
                        </div>
                    )}

                    {!loading && dashboard && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-dark">Welcome, {dashboard.profile.name}</h1>
                                    <p className="text-gray-600 mt-1">Your secure account dashboard and activity center.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg bg-dark hover:bg-black text-white px-5 py-2.5 font-semibold transition-colors"
                                >
                                    Logout
                                </button>
                            </div>

                            {!dashboard.profile.onboardingCompleted && (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                                    <h2 className="text-xl font-bold text-amber-900 mb-2">Complete Your Profile</h2>
                                    <p className="text-sm text-amber-800 mb-4">
                                        One quick step left. Add your name and interests so we can personalize your dashboard.
                                    </p>

                                    {profileMessage && (
                                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                            {profileMessage}
                                        </div>
                                    )}

                                    <form onSubmit={handleCompleteProfile} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={onboardingData.name}
                                                onChange={(e) => setOnboardingData((prev) => ({ ...prev, name: e.target.value }))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-primary focus:ring-primary outline-none"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Preferred Services (choose up to 5)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {SERVICE_OPTIONS.map((service) => {
                                                    const selected = onboardingData.preferredServices.includes(service);
                                                    return (
                                                        <button
                                                            key={service}
                                                            type="button"
                                                            onClick={() => toggleService(service)}
                                                            className={`rounded-full border px-3 py-1 text-sm transition-colors ${selected ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:border-primary"}`}
                                                        >
                                                            {service}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Set Password (optional)</label>
                                            <input
                                                type="password"
                                                value={onboardingData.password}
                                                onChange={(e) => setOnboardingData((prev) => ({ ...prev, password: e.target.value }))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-primary focus:ring-primary outline-none"
                                                placeholder="Optional, min 8 chars"
                                                minLength={8}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 transition-colors disabled:opacity-70"
                                        >
                                            {savingProfile ? "Saving..." : "Complete Profile"}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">Account Age</p>
                                    <p className="text-3xl font-bold text-dark mt-1">{dashboard.metrics.accountAgeDays}d</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">Total Logins</p>
                                    <p className="text-3xl font-bold text-dark mt-1">{dashboard.metrics.totalLogins}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">Inquiry Count</p>
                                    <p className="text-3xl font-bold text-dark mt-1">{dashboard.metrics.inquiryCount}</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-bold text-dark mb-4">Profile</h2>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p><span className="font-semibold">Name:</span> {dashboard.profile.name}</p>
                                        <p><span className="font-semibold">Email:</span> {dashboard.profile.email || "-"}</p>
                                        <p><span className="font-semibold">Mobile:</span> {dashboard.profile.mobile || "-"}</p>
                                        <p><span className="font-semibold">Onboarding:</span> {dashboard.profile.onboardingCompleted ? "Completed" : "Pending"}</p>
                                        <p><span className="font-semibold">Password Login:</span> {dashboard.profile.hasPassword ? "Enabled" : "Not Set"}</p>
                                        <p>
                                            <span className="font-semibold">Last Login:</span>{" "}
                                            {dashboard.profile.lastLoginAt ? new Date(dashboard.profile.lastLoginAt).toLocaleString() : "-"}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Last Method:</span>{" "}
                                            {dashboard.profile.lastLoginMethod ? dashboard.profile.lastLoginMethod.toUpperCase() : "-"}
                                        </p>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 mt-5 mb-2">Preferred Services</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {dashboard.profile.preferredServices.length === 0 && (
                                            <p className="text-sm text-gray-500">No services selected yet.</p>
                                        )}
                                        {dashboard.profile.preferredServices.map((item) => (
                                            <span
                                                key={item}
                                                className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 text-xs font-medium"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-bold text-dark mb-4">Recent Activity</h2>
                                    <div className="space-y-3">
                                        {dashboard.recentActivity.length === 0 && (
                                            <p className="text-sm text-gray-500">No activity yet.</p>
                                        )}
                                        {dashboard.recentActivity.map((item) => (
                                            <div key={item.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                                <p className="text-sm font-medium text-gray-900">{item.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(item.at).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-dark mb-4">Website Modules</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {dashboard.websiteModules.map((module) => (
                                        <Link
                                            key={module.title}
                                            href={module.route}
                                            className="group rounded-xl border border-gray-100 p-4 hover:border-primary hover:bg-blue-50 transition-colors"
                                        >
                                            <p className="font-semibold text-gray-900 group-hover:text-primary">{module.title}</p>
                                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
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
