import Link from "next/link";

export default function RefundCancellationPage() {
    return (
        <main className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Refund &amp; Cancellation Policy</h1>
                <p className="text-gray-600 mb-10">Last updated: March 24, 2026</p>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Session Cancellation</h2>
                        <p>
                            You may cancel or reschedule a session at least 24 hours before the scheduled time at no additional
                            charge. Requests made after this window may be treated as late cancellations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Late Cancellation and No-Show</h2>
                        <p>
                            If cancellation happens less than 24 hours before the appointment, or in case of no-show,
                            the session fee may be partially or fully forfeited depending on the service package terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Refund Eligibility</h2>
                        <p>
                            Refunds are considered for duplicate payments, technical failures that prevent session delivery,
                            or service non-fulfillment by Maestro Career. Approved refunds are processed to the original
                            payment method within 7 to 10 business days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Non-Refundable Services</h2>
                        <p>
                            Completed sessions, delivered resume reviews, and personalized reports are generally non-refundable
                            once the service has been fully provided.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How to Request a Refund</h2>
                        <p>
                            To request a cancellation or refund, email info@maestrocareer.com with your registered details,
                            payment information, and reason for the request. Our support team will review and respond promptly.
                        </p>
                    </section>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-primary hover:opacity-80 transition-opacity font-medium">
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
