"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type AuthMode = "register" | "login";
type LoginMode = "otp" | "password";

export default function AuthPage() {
    const router = useRouter();

    const [authMode, setAuthMode] = useState<AuthMode>("register");
    const [loginMode, setLoginMode] = useState<LoginMode>("otp");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        otp: "",
        otpRequested: false,
        debugOtp: "",
    });

    const [loginOtpData, setLoginOtpData] = useState({
        identifier: "",
        otp: "",
        otpRequested: false,
        debugOtp: "",
    });

    const [loginPasswordData, setLoginPasswordData] = useState({
        identifier: "",
        password: "",
    });

    const clearFeedback = () => {
        setError("");
        setMessage("");
    };

    const handleRegisterRequestOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const resp = await fetch("/api/auth/register/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    mobile: registerData.mobile,
                    password: registerData.password,
                }),
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Failed to request OTP.");
            }

            setRegisterData((prev) => ({
                ...prev,
                otpRequested: true,
                debugOtp: data.debugOtp ?? "",
            }));
            setMessage(`${data.message} (${data.target})`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to request OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const resp = await fetch("/api/auth/register/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mobile: registerData.mobile,
                    otp: registerData.otp,
                }),
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Failed to verify OTP.");
            }

            setMessage("Registration successful. Redirecting to dashboard...");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to verify OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRequestOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const resp = await fetch("/api/auth/login/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: loginOtpData.identifier }),
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Failed to request OTP.");
            }

            setLoginOtpData((prev) => ({
                ...prev,
                otpRequested: true,
                debugOtp: data.debugOtp ?? "",
            }));
            setMessage(`${data.message} (${data.target})`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to request OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const resp = await fetch("/api/auth/login/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: loginOtpData.identifier,
                    otp: loginOtpData.otp,
                }),
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Failed to verify OTP login.");
            }

            setMessage("Login successful. Redirecting to dashboard...");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to verify OTP login.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e: FormEvent) => {
        e.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const resp = await fetch("/api/auth/login/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: loginPasswordData.identifier,
                    password: loginPasswordData.password,
                }),
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                throw new Error(data.message || "Failed to login with password.");
            }

            setMessage("Login successful. Redirecting to dashboard...");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to login with password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
                        <div className="p-6 md:p-10 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight">Account Access</h1>
                            <p className="text-gray-600 mt-2">Register with mobile OTP and login using OTP or password.</p>
                        </div>

                        <div className="p-6 md:p-10">
                            <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode("register");
                                        clearFeedback();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${authMode === "register" ? "bg-white text-primary shadow-sm" : "text-gray-600"
                                        }`}
                                >
                                    Register
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode("login");
                                        clearFeedback();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${authMode === "login" ? "bg-white text-primary shadow-sm" : "text-gray-600"
                                        }`}
                                >
                                    Login
                                </button>
                            </div>

                            {message && (
                                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {authMode === "register" && (
                                <div className="space-y-6">
                                    <form onSubmit={handleRegisterRequestOtp} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={registerData.name}
                                                onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={registerData.email}
                                                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    value={registerData.mobile}
                                                    onChange={(e) => setRegisterData((prev) => ({ ...prev, mobile: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                    placeholder="9876543210"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <input
                                                type="password"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                placeholder="Minimum 6 characters"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 transition-colors disabled:opacity-70"
                                        >
                                            {loading ? "Requesting OTP..." : "Register: Send OTP"}
                                        </button>
                                    </form>

                                    {registerData.otpRequested && (
                                        <form onSubmit={handleRegisterVerifyOtp} className="space-y-4 border-t border-gray-100 pt-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                                <input
                                                    type="text"
                                                    value={registerData.otp}
                                                    onChange={(e) => setRegisterData((prev) => ({ ...prev, otp: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none tracking-[0.35em]"
                                                    placeholder="123456"
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>
                                            {registerData.debugOtp && (
                                                <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                                    Prototype OTP: <span className="font-semibold">{registerData.debugOtp}</span>
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full rounded-lg bg-dark hover:bg-black text-white font-semibold py-3 transition-colors disabled:opacity-70"
                                            >
                                                {loading ? "Verifying OTP..." : "Complete Registration"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {authMode === "login" && (
                                <div className="space-y-6">
                                    <div className="inline-flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLoginMode("otp");
                                                clearFeedback();
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${loginMode === "otp" ? "bg-white text-primary shadow-sm" : "text-gray-600"
                                                }`}
                                        >
                                            Login with OTP
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLoginMode("password");
                                                clearFeedback();
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${loginMode === "password" ? "bg-white text-primary shadow-sm" : "text-gray-600"
                                                }`}
                                        >
                                            Login with Password
                                        </button>
                                    </div>

                                    {loginMode === "otp" && (
                                        <>
                                            <form onSubmit={handleLoginRequestOtp} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (preferred) or Email</label>
                                                    <input
                                                        type="text"
                                                        value={loginOtpData.identifier}
                                                        onChange={(e) => setLoginOtpData((prev) => ({ ...prev, identifier: e.target.value }))}
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                        placeholder="9876543210"
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 transition-colors disabled:opacity-70"
                                                >
                                                    {loading ? "Requesting OTP..." : "Send Login OTP"}
                                                </button>
                                            </form>

                                            {loginOtpData.otpRequested && (
                                                <form onSubmit={handleLoginVerifyOtp} className="space-y-4 border-t border-gray-100 pt-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                                        <input
                                                            type="text"
                                                            value={loginOtpData.otp}
                                                            onChange={(e) => setLoginOtpData((prev) => ({ ...prev, otp: e.target.value }))}
                                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none tracking-[0.35em]"
                                                            placeholder="123456"
                                                            maxLength={6}
                                                            required
                                                        />
                                                    </div>
                                                    {loginOtpData.debugOtp && (
                                                        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                                            Prototype OTP: <span className="font-semibold">{loginOtpData.debugOtp}</span>
                                                        </p>
                                                    )}
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full rounded-lg bg-dark hover:bg-black text-white font-semibold py-3 transition-colors disabled:opacity-70"
                                                    >
                                                        {loading ? "Verifying OTP..." : "Login"}
                                                    </button>
                                                </form>
                                            )}
                                        </>
                                    )}

                                    {loginMode === "password" && (
                                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number or Email</label>
                                                <input
                                                    type="text"
                                                    value={loginPasswordData.identifier}
                                                    onChange={(e) => setLoginPasswordData((prev) => ({ ...prev, identifier: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                    placeholder="9876543210"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    value={loginPasswordData.password}
                                                    onChange={(e) => setLoginPasswordData((prev) => ({ ...prev, password: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 transition-colors disabled:opacity-70"
                                            >
                                                {loading ? "Signing in..." : "Login with Password"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
