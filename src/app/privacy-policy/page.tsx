import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-10">Last updated: March 24, 2026</p>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p>
                            Maestro Career may collect personal information such as your name, email address, phone number,
                            resume details, academic profile, and career preferences when you submit inquiry forms,
                            book consultations, or use our career guidance services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use your information to provide career counseling, personalize recommendations, schedule sessions,
                            improve service quality, and communicate important updates related to your account and appointments.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Sharing and Protection</h2>
                        <p>
                            We do not sell your personal data. We may share limited information with trusted service providers
                            only when necessary to operate our platform. We implement reasonable technical and organizational
                            safeguards to protect your data from unauthorized access.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies</h2>
                        <p>
                            Our website may use cookies and similar technologies to improve performance, understand usage patterns,
                            and enhance your browsing experience. You can modify browser settings to manage cookie preferences.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
                        <p>
                            You may request access, correction, or deletion of your personal information by contacting us.
                            We will respond in accordance with applicable laws and reasonable verification procedures.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h2>
                        <p>
                            For privacy-related questions, contact us at info@maestrocareer.com.
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
