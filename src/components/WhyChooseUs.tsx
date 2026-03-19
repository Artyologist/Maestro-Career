import { Lightbulb, Target, Trophy } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        {
            name: "Expert Guidance",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
            icon: Lightbulb,
        },
        {
            name: "Proven Results",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
            icon: Target,
        },
        {
            name: "Industry Experience",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
            icon: Trophy,
        },
    ];

    return (
        <section id="features" className="py-24 bg-dark text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-[100%] h-[100%] rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
                        Why Choose Us
                    </h2>
                    <p className="text-lg text-gray-400">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-xl mb-6 text-primary">
                                <feature.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.name}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
