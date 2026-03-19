import { Briefcase, Users, Rocket } from "lucide-react";

export default function Stats() {
    const stats = [
        {
            id: 1,
            name: "Years Experience",
            value: "35+",
            icon: Briefcase,
        },
        {
            id: 2,
            name: "Individuals Coached",
            value: "2000+",
            icon: Users,
        },
        {
            id: 3,
            name: "Startups Mentored",
            value: "100+",
            icon: Rocket,
        },
    ];

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-2xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                                <stat.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                            </div>
                            <p className="text-4xl font-extrabold text-dark mb-2">{stat.value}</p>
                            <p className="text-lg font-medium text-gray-500">{stat.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
