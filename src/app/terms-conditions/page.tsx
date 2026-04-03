import Link from "next/link";

export default function TermsConditionsPage() {
    return (
        <main className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Terms &amp; Conditions</h1>
                <p className="text-gray-600 mb-10">Last updated: March 24, 2026</p>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By using Maestro Career services, you agree to these Terms &amp; Conditions. If you do not agree,
                            please discontinue use of the website and associated consultation services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Scope of Services</h2>
                        <p>
                            Maestro Career provides guidance such as career counseling, resume support, interview preparation,
                            and psychometric-based insights. These services are advisory in nature and do not guarantee
                            admission, hiring, or specific career outcomes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
                        <p>
                            You agree to provide accurate information, maintain respectful communication, and avoid misuse of
                            platform content. Any unlawful or abusive behavior may result in suspension of services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Payments and Bookings</h2>
                        <p>
                            Paid consultations or packages, where applicable, must be completed through approved channels.
                            Booking confirmations are subject to availability and successful payment processing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
                        <p>
                            All website content, branding, templates, and materials are owned by Maestro Career unless stated
                            otherwise. Reproduction or redistribution without written consent is prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
                        <p>
                            Maestro Career is not liable for indirect or consequential losses arising from service use,
                            scheduling delays, third-party outages, or decisions made based on advisory recommendations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Updates to Terms</h2>
                        <p>
                            We may revise these Terms &amp; Conditions periodically. Continued use after updates indicates
                            acceptance of the revised terms. For questions, contact us at info@maestrocareer.com.
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
