import Link from "next/link";

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
                <p className="text-gray-600 mb-10">Last updated: April 03, 2026</p>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files that are stored on your device when you visit a website. They help the
                            website recognize your device and remember information about your visit, which can make it easier
                            to visit the site again and make the site more useful to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Cookies</h2>
                        <p>
                            Maestro Career uses cookies to improve your browsing experience, provide personalized content,
                            analyze platform traffic, and understand where our visitors are coming from. We use both session
                            cookies (which expire once you close your web browser) and persistent cookies (which stay on your
                            device until you delete them).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Types of Cookies We Use</h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>
                                <strong>Essential Cookies:</strong> Necessary for the website to function properly, such as
                                enabling secure log-ins or processing payments.
                            </li>
                            <li>
                                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with the website
                                by collecting and reporting information anonymously.
                            </li>
                            <li>
                                <strong>Preference Cookies:</strong> Allow the website to remember choices you make (such as
                                your language preference) to provide enhanced features.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Managing Cookies</h2>
                        <p>
                            Most web browsers allow you to control cookies through their settings preferences. You can set
                            your browser to block or alert you about these cookies, but some parts of the site may not
                            function correctly if you do so.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about our Cookie Policy, please contact us at info@maestrocareer.com.
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
