"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPlanById, formatInr } from "@/data/plans";

interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    mobile: string;
    date_of_birth: string;
    user_type: "student" | "working_professional";
    selected_plan_id: string;
    payment_status: "paid" | "unpaid";
    payment_id: string;
    transaction_id: string;
    payment_token: string;
    psychometric_test_link: string;
    created_at: string;
}

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [linkInput, setLinkInput] = useState<{ [userId: string]: string }>({});
    const [sendingLink, setSendingLink] = useState<{ [userId: string]: boolean }>({});
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const sessionResp = await fetch("/api/admin/session", { cache: "no-store" });
                const sessionData = await sessionResp.json();
                if (!sessionData?.authenticated) {
                    router.replace("/admin");
                    return;
                }

                const resp = await fetch("/api/admin/users");
                const data = await resp.json();
                if (data.success) {
                    setUsers(data.data);
                } else {
                    setError("Failed to fetch user database.");
                }
            } catch {
                setError("Unable to connect to administrative core.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    const handleSendLink = async (userId: string) => {
        const link = linkInput[userId];
        if (!link) return;

        setSendingLink({ ...sendingLink, [userId]: true });

        try {
            const resp = await fetch(`/api/admin/users/${userId}/send-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ psychometricTestLink: link }),
            });
            const data = await resp.json();
            if (data.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, psychometric_test_link: link } : u));
                alert("Psychometric Link distribution successful.");
            } else {
                alert(data.message || "Failed to distribute link.");
            }
        } catch {
            alert("Network error. Link distribution halted.");
        } finally {
            setSendingLink({ ...sendingLink, [userId]: false });
        }
    };

    const handleLogout = () => {
        fetch("/api/admin/logout", { method: "POST" }).finally(() => {
            router.push("/admin");
            router.refresh();
        });
    };

    const calculateAge = (dob: string) => {
        if (!dob) return "-";
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col gap-10">

                    {/* Dash Header */}
                    <div className="rounded-3xl border border-border/20 bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden transition-all shadow-sm w-full">
                        <div className="relative z-10 flex flex-col items-start gap-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                Admin Dashboard
                            </h1>
                            <p className="text-foreground/60 text-sm">Lead & Payment Management</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col text-right pr-6 border-r border-border/20">
                                <p className="text-sm font-medium text-foreground/50">Active Leads</p>
                                <p className="text-xl font-bold text-foreground">{users.length}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="relative z-10 rounded-xl bg-background border border-border/20 hover:border-border/40 text-foreground px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row w-full gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search leads by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-xl border border-border/30 bg-background px-4 py-3 text-[15px] text-foreground shadow-sm outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20"
                            />
                        </div>
                        <button className="rounded-xl border border-border/30 bg-card px-6 py-3 text-[15px] font-medium text-foreground hover:bg-background transition-colors hover:border-border/60">
                            Filter
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="max-w-4xl mx-auto rounded-3xl border border-border/20 bg-card p-12 text-center shadow-sm animate-pulse">
                            <p className="text-foreground/60 font-medium text-sm">Loading admin dashboard...</p>
                        </div>
                    ) : error ? (
                        <div className="max-w-4xl mx-auto rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-destructive text-center">
                            <h3 className="text-lg font-semibold mb-2">Error loading data</h3>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {filteredUsers.length === 0 ? (
                                <div className="py-12 text-center border-t border-border/10">
                                    <p className="text-sm text-foreground/50">No users found matching your search.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {filteredUsers.map((user) => {
                                        const plan = user.selected_plan_id ? getPlanById(user.selected_plan_id) : null;
                                        return (
                                            <div key={user.id} className="rounded-3xl border border-border/20 bg-card p-8 flex flex-col lg:flex-row gap-6 shadow-sm relative overflow-hidden transition-all">
                                                <div className="grid lg:grid-cols-12 gap-8 relative z-10 w-full">
                                                    {/* User Core Bio */}
                                                    <div className="lg:col-span-4 flex flex-col gap-6">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-foreground">
                                                                {user.full_name || "Anonymous Learner"}
                                                            </h3>
                                                            <p className="text-xs font-medium text-foreground/50 mt-1">
                                                                Joined: {new Date(user.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-3 mt-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-foreground/60">Email</span>
                                                                <span className="text-sm font-semibold text-foreground truncate">{user.email || "-"}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-foreground/60">Phone</span>
                                                                <span className="text-sm font-semibold text-foreground">{user.mobile || "-"}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-foreground/60">Age</span>
                                                                <span className="text-sm font-semibold text-foreground">{calculateAge(user.date_of_birth)}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-foreground/60">Type</span>
                                                                <span className="text-sm font-semibold text-foreground">{user.user_type === 'working_professional' ? 'Professional' : 'Student'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Plan & Payment Data */}
                                                    <div className="lg:col-span-4 rounded-2xl border border-border/20 bg-background/50 p-6 flex flex-col gap-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-sm font-semibold text-foreground">Transaction Profile</h3>
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${user.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                                                                {user.payment_status || 'UNPAID'}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-foreground/60">Plan</span>
                                                                <span className="text-sm font-semibold text-foreground">{plan?.name || "TBD"}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-foreground/60">Amount</span>
                                                                <span className="text-sm font-semibold text-primary">{plan ? formatInr(plan.priceInr) : "—"}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 pt-4 border-t border-border/10">
                                                                <span className="text-xs font-medium text-foreground/60">Payment ID</span>
                                                                <span className="text-xs font-mono text-foreground truncate opacity-80">{user.payment_id || "TBD"}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-medium text-foreground/60">Transaction ID</span>
                                                                <span className="text-xs font-mono text-foreground truncate opacity-80">{user.transaction_id || "TBD"}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-medium text-foreground/60">Payment Token</span>
                                                                <span className="text-xs font-mono text-foreground truncate opacity-80">{user.payment_token || "TBD"}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Distribute Assessment Link */}
                                                    <div className="lg:col-span-4 rounded-xl flex flex-col justify-between">
                                                        <h3 className="text-sm font-semibold text-foreground mb-4">Assessment Link</h3>

                                                        <div className="space-y-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Paste URL here..."
                                                                value={linkInput[user.id] || ""}
                                                                onChange={(e) => setLinkInput({ ...linkInput, [user.id]: e.target.value })}
                                                                className="block w-full rounded-xl border border-border/30 bg-background px-4 py-3 text-[14px] text-foreground shadow-sm outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20"
                                                            />
                                                            <button
                                                                onClick={() => handleSendLink(user.id)}
                                                                disabled={sendingLink[user.id] || !linkInput[user.id] || user.payment_status !== "paid"}
                                                                className="w-full relative flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-[14px] font-medium transition-all disabled:opacity-50"
                                                            >
                                                                {sendingLink[user.id] ? "Sending..." : (
                                                                    <>
                                                                        {user.payment_status === "paid" ? "Issue Assessment \u2192" : "Await Payment"}
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>

                                                        {user.payment_status !== "paid" && (
                                                            <p className="text-xs font-medium text-rose-500 mt-3 border border-rose-500/20 bg-rose-500/10 px-3 py-2 rounded-lg text-center">Payment pending.</p>
                                                        )}

                                                        {user.psychometric_test_link && (
                                                            <div className="mt-4 flex items-center text-emerald-600 font-medium text-sm gap-2">
                                                                <span>Link Active</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
