"use client";

import Link from "next/link";
import Script from "next/script";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatInr, getPlanById } from "@/data/plans";

interface OrderApiResponse {
    success: boolean;
    message?: string;
    keyId?: string;
    order?: {
        id: string;
        amount: number;
        currency: string;
    };
}

interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
    handler?: (response: RazorpaySuccessResponse) => void;
}

type RazorpayCtor = new (options: RazorpayCheckoutOptions) => {
    open: () => void;
    on: (event: string, callback: (response: unknown) => void) => void;
};

export default function CheckoutPage() {
    const params = useParams<{ planId: string }>();
    const router = useRouter();

    const plan = useMemo(() => getPlanById(params.planId), [params.planId]);

    const [buyerName, setBuyerName] = useState("");
    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerMobile, setBuyerMobile] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handlePayNow = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!plan) {
            setError("Selected plan is not available.");
            return;
        }

        const razorpayCtor = (window as Window & { Razorpay?: RazorpayCtor }).Razorpay;

        if (!razorpayCtor) {
            setError("Payment gateway did not load. Please refresh and try again.");
            return;
        }

        setIsPaying(true);

        try {
            const orderResp = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: plan.id,
                    buyerName,
                    buyerEmail,
                    buyerMobile,
                }),
            });

            const orderData: OrderApiResponse = await orderResp.json();
            if (!orderResp.ok || !orderData.success || !orderData.keyId || !orderData.order) {
                throw new Error(orderData.message || "Unable to initiate payment.");
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Maestro Career",
                description: `${plan.name} Plan Payment`,
                order_id: orderData.order.id,
                prefill: {
                    name: buyerName,
                    email: buyerEmail,
                    contact: buyerMobile,
                },
                notes: {
                    planId: plan.id,
                    planName: plan.name,
                },
                theme: {
                    color: "#1294DD",
                },
                modal: {
                    ondismiss: () => {
                        setMessage("Payment window closed. You can retry anytime.");
                        setIsPaying(false);
                    },
                },
                handler: async function (response: RazorpaySuccessResponse) {
                    try {
                        const verifyResp = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });
                        const verifyData = await verifyResp.json();

                        if (!verifyResp.ok || !verifyData.success) {
                            throw new Error(verifyData.message || "Payment verification failed.");
                        }

                        const query = new URLSearchParams({
                            plan: plan.name,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                        });

                        router.push(`/thank-you?${query.toString()}`);
                    } catch (verificationError) {
                        setError(
                            verificationError instanceof Error
                                ? verificationError.message
                                : "Payment succeeded but verification failed."
                        );
                    } finally {
                        setIsPaying(false);
                    }
                },
            };

            const razorpay = new razorpayCtor(options);
            razorpay.on("payment.failed", () => {
                setError("Payment failed. Please try again.");
                setIsPaying(false);
            });
            razorpay.open();
        } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : "Payment could not be started.");
            setIsPaying(false);
        }
    };

    if (!plan) {
        return (
            <main className="min-h-screen bg-white">
                <Header />
                <section className="py-24 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Plan not found</h1>
                            <p className="text-gray-600 mt-2">Please return to the homepage and choose a valid plan.</p>
                            <Link href="/" className="inline-block mt-6 rounded-lg bg-primary text-white px-5 py-2.5 font-semibold">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <Header />

            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm font-semibold text-primary">Final Plan Description</p>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">{plan.name}</h1>
                            <p className="text-gray-600 mt-3">{plan.description}</p>

                            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4">
                                <p className="text-sm text-blue-700">Total Payable</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">{formatInr(plan.priceInr)}</p>
                            </div>

                            <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-2">
                                        <span className="text-primary">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                            <p className="text-sm text-gray-600 mt-1">Enter your details and click Pay to open Razorpay.</p>

                            <form onSubmit={handlePayNow} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={buyerName}
                                        onChange={(e) => setBuyerName(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={buyerEmail}
                                        onChange={(e) => setBuyerEmail(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={buyerMobile}
                                        onChange={(e) => setBuyerMobile(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 focus:border-primary focus:ring-primary outline-none"
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>

                                {error && <p className="text-sm text-red-600">{error}</p>}
                                {message && <p className="text-sm text-blue-700">{message}</p>}

                                <button
                                    type="submit"
                                    disabled={isPaying}
                                    className="w-full rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 transition-colors disabled:opacity-70"
                                >
                                    {isPaying ? "Opening Razorpay..." : `Pay ${formatInr(plan.priceInr)}`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
