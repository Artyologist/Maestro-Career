export default function Palette() {
    const colors = [
        { name: "Primary", hex: "#1294DD", bgClass: "bg-[#1294DD]", textClass: "text-white" },
        { name: "Dark", hex: "#111827", bgClass: "bg-[#111827]", textClass: "text-white" },
        { name: "White", hex: "#FFFFFF", bgClass: "bg-white", textClass: "text-dark border border-gray-200" },
        { name: "Black", hex: "#000000", bgClass: "bg-black", textClass: "text-white" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-4">
                        Design Palette Showcase
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        These are the core colors that define the brand identity and visual aesthetic of the Maestro Career platform.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {colors.map((color) => (
                        <div
                            key={color.name}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div
                                className={`w-full aspect-square rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl flex items-end p-6 ${color.bgClass}`}
                            >
                                <div className={`w-full ${color.textClass}`}>
                                    <p className="font-bold text-lg mb-1">{color.name}</p>
                                    <p className="font-mono text-sm opacity-80">{color.hex}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
