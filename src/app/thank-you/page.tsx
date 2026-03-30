import Link from "next/link";

interface ThankYouPageProps {
    searchParams: {
        plan?: string;
        paymentId?: string;
        orderId?: string;
    };
}

export default function ThankYouPage({ searchParams }: ThankYouPageProps) {
    return (
        <main className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                    <p className="text-sm font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1 inline-flex">
                        Payment Successful
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Thank you for your purchase</h1>
                    <p className="text-gray-600 mt-2">
                        Your payment has been received successfully. Our team will contact you shortly with next steps.
                    </p>

                    <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4 text-left">
                        <p className="text-sm text-gray-500">Plan</p>
                        <p className="font-semibold text-gray-900">{searchParams.plan ?? "Selected Plan"}</p>

                        <p className="text-sm text-gray-500 mt-3">Payment ID</p>
                        <p className="font-semibold text-gray-900 break-all">{searchParams.paymentId ?? "-"}</p>

                        <p className="text-sm text-gray-500 mt-3">Order ID</p>
                        <p className="font-semibold text-gray-900 break-all">{searchParams.orderId ?? "-"}</p>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3">
                        <Link href="/" className="rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 transition-colors">
                            Back to Home
                        </Link>
                        <Link href="/dashboard" className="rounded-lg border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 hover:bg-gray-50 transition-colors">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
