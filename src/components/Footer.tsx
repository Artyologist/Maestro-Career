import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#111827] text-white pt-20 pb-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: About */}
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-6">
                            Maestro <span className="text-primary">Career</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
                            <li><a href="#features" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Services</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Career Coaching</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Resume Review</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Interview Prep</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Psychometric Tests</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center">
                                <span className="truncate">info@maestrocareer.com</span>
                            </li>
                            <li className="flex items-center">
                                <span>+91 98222 28484</span>
                            </li>
                            <li className="flex items-center">
                                <span>123 Coaching Ave, Suite 100<br />New York, NY 10001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Strip */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Maestro Career. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
                        <Link href="/refund-cancellation" className="hover:text-white transition-colors">Refund &amp; Cancellation</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
