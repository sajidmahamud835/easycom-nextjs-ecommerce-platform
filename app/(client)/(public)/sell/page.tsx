"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Globe,
    ShieldCheck,
    DollarSign,
    CheckCircle,
    Loader2,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createSellerRequest } from "@/actions/createSellerRequest";

const SellPage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError("");
        const result = await createSellerRequest(formData);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || "Something went wrong.");
        }
        setLoading(false);
    };

    const benefits = [
        {
            icon: TrendingUp,
            title: "Grow Your Business",
            description: "Access millions of customers ready to buy your products.",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Globe,
            title: "Sell Globally",
            description: "Ship your products to customers all over the world.",
            color: "bg-green-100 text-green-600",
        },
        {
            icon: ShieldCheck,
            title: "Secure Payments",
            description: "Get paid securely and on time directly to your bank account.",
            color: "bg-purple-100 text-purple-600",
        },
        {
            icon: DollarSign,
            title: "Low Fees",
            description: "Competitive commission rates and no hidden charges.",
            color: "bg-orange-100 text-orange-600",
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#131921] text-white py-20 lg:py-32">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#131921] via-[#131921]/90 to-transparent z-10"></div>
                    {/* Abstract Background Pattern */}
                    <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                </div>

                <Container className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-[#febd69] text-black hover:bg-[#f3a847] mb-6 px-4 py-1 text-sm font-bold">
                                Join EasyCom Sellers
                            </Badge>
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-none">
                                Start Selling <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#febd69] to-orange-400">
                                    Today
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                                Transform your business with EasyCom. Reach millions of customers and maintain full control over your brand.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    size="lg"
                                    className="bg-[#febd69] text-black hover:bg-[#f3a847] text-lg px-8 h-14 font-bold"
                                    onClick={() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    Apply Now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </motion.div>

                        {/* Visual/Image placeholder */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hidden lg:block relative"
                        >
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4 pt-8">
                                        <div className="bg-[#febd69] h-32 rounded-lg w-full shadow-lg"></div>
                                        <div className="bg-white/20 h-24 rounded-lg w-full"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/20 h-24 rounded-lg w-full"></div>
                                        <div className="bg-white h-40 rounded-lg w-full shadow-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Benefits Section */}
            <section className="py-20 lg:py-28 bg-gray-50">
                <Container>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Sell on EasyCom?</h2>
                        <p className="text-lg text-gray-600">
                            We provide the tools, support, and audience you need to scale your business efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-6`}>
                                    <benefit.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Application Form Section */}
            <section id="apply-form" className="py-20 lg:py-32">
                <Container className="max-w-4xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-5">
                            {/* Form Side */}
                            <div className="lg:col-span-3 p-8 lg:p-12">
                                {success ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h3>
                                        <p className="text-gray-600 mb-8 text-lg">
                                            Thank you for your interest. Our team will review your details and contact you within 2-3 business days.
                                        </p>
                                        <Button
                                            onClick={() => setSuccess(false)}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Submit Another Application
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Become a Seller</h2>
                                        <p className="text-gray-600 mb-8">Fill out the form below to start your application.</p>

                                        <form action={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input id="firstName" name="firstName" required placeholder="John" className="h-12 bg-gray-50 border-gray-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input id="lastName" name="lastName" required placeholder="Doe" className="h-12 bg-gray-50 border-gray-200" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" type="email" name="email" required placeholder="john@example.com" className="h-12 bg-gray-50 border-gray-200" />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="businessName">Business Name</Label>
                                                <Input id="businessName" name="businessName" required placeholder="Your Company LLC" className="h-12 bg-gray-50 border-gray-200" />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="businessDescription">Business Description</Label>
                                                <Textarea id="businessDescription" name="businessDescription" required placeholder="What kind of products do you sell?" className="min-h-[120px] bg-gray-50 border-gray-200 resize-none" />
                                            </div>

                                            <AnimatePresence>
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                                                    >
                                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                        <p className="text-sm">{error}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <Button
                                                type="submit"
                                                className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold h-14 text-lg"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Submit Application"}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </div>

                            {/* Sidebar / Info */}
                            <div className="lg:col-span-2 bg-[#232f3e] p-8 lg:p-12 text-white flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-6 text-[#febd69]">Seller Support</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#febd69] mt-0.5" />
                                            <span className="text-gray-300">24/7 dedicated support team</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#febd69] mt-0.5" />
                                            <span className="text-gray-300">Comprehensive seller analytics</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#febd69] mt-0.5" />
                                            <span className="text-gray-300">Marketing tools to boost sales</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-12">
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <p className="italic text-gray-300 mb-4">"EasyCom transformed my small craft business into a global brand. The tools are incredibly easy to use."</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-500"></div>
                                            <div>
                                                <p className="font-bold text-white">Sarah Jenkins</p>
                                                <p className="text-xs text-gray-400">Founder, HandMade Co.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default SellPage;
