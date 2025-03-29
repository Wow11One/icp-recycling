import { Recycle, Leaf, TreePine, ArrowRight, Menu } from "lucide-react"
import React from "react";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col justify-center">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-white">
                <div className="container flex h-16 items-center justify-between py-4 px-10">
                    <div className="flex items-center gap-2">
                        <Recycle className="h-6 w-6 text-green-600" />
                        <span className="text-xl font-bold text-green-600">ICP Recycling</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600">
                            Home
                        </a>
                        <a href="#services" className="text-sm font-medium text-gray-600 hover:text-green-600">
                            Services
                        </a>
                        <a href="#impact" className="text-sm font-medium text-gray-600 hover:text-green-600">
                            Impact
                        </a>
                        <a href="#about" className="text-sm font-medium text-gray-600 hover:text-green-600">
                            About Us
                        </a>
                        <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-green-600">
                            Contact
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex primary-button">Get Started</button>

                        <button className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="py-12 md:py-24 lg:py-32 bg-green-50">
                    <div className="container px-4 md:px-12 mx-auto">
                        <div className="flex justify-between">
                            <div className="space-y-8 max-w-3xl">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-green-800">
                                    Make Our Planet Greener One Recycle at a Time
                                </h1>
                                <p className="max-w-[600px] text-gray-600 md:text-xl">
                                    Join our mission to create a sustainable future through responsible recycling. Together, we can reduce
                                    waste and protect our environment.
                                </p>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <button className="primary-button">Start recycling today</button>
                                    <button className="secondary-button">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <img
                                    src="icp-recycling.jpg"
                                    alt="Recycling illustration"
                                    width={400}
                                    height={400}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-4">
                                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                                    Our Services
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-800">
                                    How We Help You Recycle
                                </h2>
                                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    We provide comprehensive recycling solutions to make it easy for you to contribute to a greener
                                    planet and get rewards for that.
                                </p>
                            </div>
                        </div>

                        <div className="w-full mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                            {/* Service 1 */}
                            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 p-6 shadow-sm">
                                <div className="rounded-full bg-green-100 p-4">
                                    <Recycle className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800">Waste Collection</h3>
                                <p className="text-center text-gray-600">
                                    Regular collection of recyclable materials from your home or business.
                                </p>
                            </div>

                            {/* Service 2 */}
                            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 p-6 shadow-sm">
                                <div className="rounded-full bg-green-100 p-4">
                                    <Leaf className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800">Sorting & Processing</h3>
                                <p className="text-center text-gray-600">
                                    Advanced sorting technology to ensure maximum recycling efficiency.
                                </p>
                            </div>

                            {/* Service 3 */}
                            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 p-6 shadow-sm">
                                <div className="rounded-full bg-green-100 p-4">
                                    <TreePine className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800">Education Programs</h3>
                                <p className="text-center text-gray-600">
                                    Community workshops and resources to promote recycling awareness.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section id="impact" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
                    <div className="mx-auto container w-full px-4 md:px-6">
                        <div>
                            <div className="space-y-4 flex flex-col items-center justify-center">
                                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">Our Impact</div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-800">
                                    Making a Difference Together
                                </h2>
                                <p className="text-gray-600 md:text-xl">
                                    Through our collective efforts, we've achieved significant environmental milestones.
                                </p>

                                <div className="w-full grid grid-cols-2 gap-4 pt-4">
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h3 className="text-2xl font-bold text-green-600">10K+</h3>
                                        <p className="text-sm text-gray-600">Tons of waste recycled</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h3 className="text-2xl font-bold text-green-600">5K+</h3>
                                        <p className="text-sm text-gray-600">Trees saved</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h3 className="text-2xl font-bold text-green-600">2M+</h3>
                                        <p className="text-sm text-gray-600">Gallons of water conserved</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h3 className="text-2xl font-bold text-green-600">15K+</h3>
                                        <p className="text-sm text-gray-600">Community members engaged</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container w-full px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">Process</div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-800">How It Works</h2>
                                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Our simple 3-step process makes recycling accessible to everyone.
                                </p>
                            </div>
                        </div>

                        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-3">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">1</div>
                                <h3 className="text-xl font-bold text-green-800">Schedule Pickup</h3>
                                <p className="text-center text-gray-600">Book a convenient time for us to collect your recyclables.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">2</div>
                                <h3 className="text-xl font-bold text-green-800">We Collect</h3>
                                <p className="text-center text-gray-600">
                                    Our team picks up your sorted recyclables from your location.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">3</div>
                                <h3 className="text-xl font-bold text-green-800">Track Impact</h3>
                                <p className="text-center text-gray-600">
                                    Monitor your environmental contribution through our dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Ready to Make a Difference?
                                </h2>
                                <p className="mx-auto max-w-[700px] md:text-xl/relaxed">
                                    Join thousands of environmentally conscious individuals and businesses in our recycling program.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <form className="flex flex-col space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="rounded-md border border-gray-300 px-3 py-2 text-black"
                                    />
                                    <button className="secondary-button">Get Started</button>
                                </form>
                                <p className="text-sm">We'll send you information on how to start recycling with us.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t bg-white py-6">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Recycle className="h-6 w-6 text-green-600" />
                                <span className="text-xl font-bold text-green-600">EcoRecycle</span>
                            </div>
                            <p className="text-sm text-gray-600">Making the world greener through sustainable recycling solutions.</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-green-800">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-gray-600 hover:text-green-600">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#services" className="text-sm text-gray-600 hover:text-green-600">
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a href="#impact" className="text-sm text-gray-600 hover:text-green-600">
                                        Impact
                                    </a>
                                </li>
                                <li>
                                    <a href="#about" className="text-sm text-gray-600 hover:text-green-600">
                                        About Us
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-green-800">Contact</h3>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-600">123 Green Street, Eco City</li>
                                <li className="text-sm text-gray-600">info@ecorecycle.com</li>
                                <li className="text-sm text-gray-600">(123) 456-7890</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-green-800">Subscribe</h3>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                                <button className="primary-button">
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                            <p className="text-xs text-gray-600">Subscribe to our newsletter for tips and updates.</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <p className="text-center text-xs text-gray-600">
                            © 2025,  EcoRecycle. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

