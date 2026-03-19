import { CheckCircle2 } from "lucide-react";

export default function Services() {
    const benefits = [
        "Lorem ipsum dolor sit amet consectetur",
        "Adipiscing elit sed do eiusmod tempor",
        "Incididunt ut labore et dolore magna",
        "Aliqua ut enim ad minim veniam",
        "Quis nostrud exercitation ullamco laboris",
    ];

    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Column - Image Placeholder */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden shadow-xl border border-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 font-medium">Image Placeholder</span>
                        </div>

                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl -z-10"></div>
                    </div>

                    {/* Right Column - Text & List */}
                    <div className="w-full lg:w-1/2">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-6">
                                Comprehensive Career Solutions
                            </h2>
                            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                            <ul className="space-y-5">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="ml-4 text-gray-700 font-medium">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
