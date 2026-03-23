export default function Testimonials() {
    const testimonials = [
        {
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            author: {
                name: "Leslie Alexander",
                handle: "@lesliealexander",
                imageUrl:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            author: {
                name: "Michael Foster",
                handle: "@michaelfoster",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            author: {
                name: "Dries Vincent",
                handle: "@driesvincent",
                imageUrl:
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
    ];

    return (
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        We have worked with thousands of amazing people
                    </p>
                </div>
                <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <figure className="h-full flex flex-col justify-between">
                                    <blockquote className="text-gray-700 leading-relaxed mb-8">
                                        <p>{`"${testimonial.body}"`}</p>
                                    </blockquote>
                                    <figcaption className="mt-6 flex items-center gap-x-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className="h-12 w-12 rounded-full bg-gray-50 object-cover" src={testimonial.author.imageUrl} alt="" />
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                                            <div className="text-gray-600 text-sm">{testimonial.author.handle}</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
