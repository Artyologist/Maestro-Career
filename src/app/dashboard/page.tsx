"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
            type: "registration" | "login";
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

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dashboard, setDashboard] = useState<DashboardResponse["data"]>(undefined);

    useEffect(() => {
        const load = async () => {
            try {
                const resp = await fetch("/api/auth/me", { method: "GET" });
                const data: DashboardResponse = await resp.json();

                if (!resp.ok || !data.success || !data.data) {
                    router.replace("/auth");
                    return;
                }

                setDashboard(data.data);
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
                                    <p className="text-gray-600 mt-1">Your prototype account dashboard and activity center.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg bg-dark hover:bg-black text-white px-5 py-2.5 font-semibold transition-colors"
                                >
                                    Logout
                                </button>
                            </div>

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
                                        <p><span className="font-semibold">Email:</span> {dashboard.profile.email}</p>
                                        <p><span className="font-semibold">Mobile:</span> {dashboard.profile.mobile}</p>
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
