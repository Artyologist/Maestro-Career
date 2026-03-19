export default function InquiryForm() {
    return (
        <section id="contact" className="py-24 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <form action="#" method="POST" className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        className="block w-full rounded-lg border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary border hover:border-gray-400 outline-none transition-colors"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        className="block w-full rounded-lg border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary border hover:border-gray-400 outline-none transition-colors"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full rounded-lg border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary border hover:border-gray-400 outline-none transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="inquiry-type" className="block text-sm font-medium text-gray-700 mb-2">Inquiry Category</label>
                                <select
                                    id="inquiry-type"
                                    name="inquiry-type"
                                    className="block w-full rounded-lg border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary border hover:border-gray-400 outline-none transition-colors"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="coaching">Career Coaching</option>
                                    <option value="resume">Resume Review</option>
                                    <option value="interview">Interview Preparation</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="block w-full rounded-lg border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary border hover:border-gray-400 outline-none transition-colors resize-none"
                                    placeholder="Tell us how we can help you..."
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                                >
                                    Submit Inquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
