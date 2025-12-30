import HomeBanner from "@/components/HomeBanner";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/sanity/lib/products";
import Link from "next/link";
<<<<<<< HEAD
import Image from "next/image";
=======
import { ArrowRight, Zap, Gift, Cpu, Sparkles } from "lucide-react";
>>>>>>> origin/main

export default async function Home() {
    const products = await getProducts();

    return (
<<<<<<< HEAD
        <div className="bg-[#E3E6E6] min-h-screen pb-10">
            <HomeBanner />

            <div className="max-w-[1500px] mx-auto px-4 -mt-10 md:-mt-32 relative z-30 mb-8 space-y-6">

                {/* Amazon-style Card Grid Overlap */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Card 1: Deal of the Day */}
                    <div className="bg-white p-4 relative z-10 shadow-sm flex flex-col h-[320px]">
                        <h3 className="font-bold text-xl mb-3">Today&apos;s Deals</h3>
                        <div className="flex-1 rounded-sm overflow-hidden mb-2 relative">
                            <Image
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400"
                                alt="Today's Deals"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Up to 50% OFF</span>
                            </div>
                        </div>
                        <Link href="/shop" className="text-sm text-blue-600 hover:underline hover:text-red-700 mt-auto block">See all deals</Link>
                    </div>

                    {/* Card 2: Bulk Orders */}
                    <div className="bg-white p-4 relative z-10 shadow-sm flex flex-col h-[320px]">
                        <h3 className="font-bold text-xl mb-3">Bulk Savings</h3>
                        <div className="flex-1 rounded-sm overflow-hidden mb-2 relative">
                            <Image
                                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400"
                                alt="Bulk Savings"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Save 20%</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Save up to 20% with business pricing</p>
                        <Link href="/shop" className="text-sm text-blue-600 hover:underline hover:text-red-700 mt-auto block">Shop business</Link>
                    </div>

                    {/* Card 3: Electronics */}
                    <div className="bg-white p-4 relative z-10 shadow-sm flex flex-col h-[320px]">
                        <h3 className="font-bold text-xl mb-3">Electronics</h3>
                        <div className="flex-1 rounded-sm overflow-hidden mb-2 relative">
                            <Image
                                src="https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&q=80&w=400"
                                alt="Electronics"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">New Arrivals</span>
                            </div>
                        </div>
                        <Link href="/category/electronics" className="text-sm text-blue-600 hover:underline hover:text-red-700 mt-auto block">See more</Link>
                    </div>

                    {/* Card 4: Sign in Upsell */}
                    <div className="bg-white p-4 relative z-10 shadow-sm flex flex-col h-[320px] justify-center">
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#febd69] to-[#f3a847] rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-10 h-10 text-[#131921]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-2">Sign in for the best experience</h3>
                            <p className="text-sm text-gray-600 mb-4">Get personalized recommendations</p>
                        </div>
                        <Link href="/sign-in" className="bg-[#FFD814] border border-[#FCD200] rounded-sm py-2 text-sm shadow-sm hover:bg-[#F7CA00] text-center block font-medium">Sign in securely</Link>
                        <div className="text-xs text-gray-600 text-center mt-2">New customer? <Link href="/sign-up" className="text-blue-600 hover:underline hover:text-red-700">Start here.</Link></div>
                    </div>
                </div>

                {/* Example Horizontal Product Feed */}
                <div className="bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Related to items you viewed</h2>
                        <Link href="/shop" className="text-xs text-blue-600 hover:text-red-700 hover:underline">See more</Link>
                    </div>

                    {/* Grid of actual products */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
=======
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen pb-16">
            <HomeBanner />

            <div className="max-w-[1500px] mx-auto px-4 -mt-10 md:-mt-32 relative z-30 mb-8 space-y-8">

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* Card 1: Today's Deals */}
                    <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col h-[320px] group overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-rose-100 rounded-xl">
                                <Zap className="w-5 h-5 text-rose-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Today's Deals</h3>
                        </div>
                        <div className="flex-1 rounded-xl overflow-hidden mb-3 relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400')" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    Up to 50% OFF
                                </span>
                            </div>
                        </div>
                        <Link href="/shop" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium group/link">
                            See all deals
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Card 2: New Arrivals */}
                    <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col h-[320px] group overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-emerald-100 rounded-xl">
                                <Gift className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">New Arrivals</h3>
                        </div>
                        <div className="flex-1 rounded-xl overflow-hidden mb-3 relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400')" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    Just Landed
                                </span>
                            </div>
                        </div>
                        <Link href="/shop" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium group/link">
                            Explore new products
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Card 3: Electronics */}
                    <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col h-[320px] group overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <Cpu className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Electronics</h3>
                        </div>
                        <div className="flex-1 rounded-xl overflow-hidden mb-3 relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&q=80&w=400')" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    Top Rated
                                </span>
                            </div>
                        </div>
                        <Link href="/category/electronics" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium group/link">
                            Shop electronics
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Card 4: Sign In CTA */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-[320px] justify-center text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Get Personalized Deals</h3>
                            <p className="text-white/80 text-sm mb-5">Sign in for exclusive offers tailored just for you</p>
                            <Link
                                href="/sign-in"
                                className="w-full bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all shadow-lg text-center"
                            >
                                Sign In
                            </Link>
                            <div className="text-xs text-white/70 mt-3">
                                New here? <Link href="/sign-up" className="text-white underline hover:no-underline">Create account</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                            <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
                        </div>
                        <Link href="/shop" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium group">
                            View all
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
>>>>>>> origin/main
                        {products?.slice(0, 10).map((product) => (
                            <ProductCard key={product?._id} product={product} />
                        ))}
                    </div>
                </div>

<<<<<<< HEAD
                {/* Banner Strip */}
                <div className="w-full h-24 bg-gray-200 flex items-center justify-center border border-gray-300 rounded-sm">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Brand Advertisement Space</span>
                </div>

                {/* More products */}
                <div className="bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
=======
                {/* Featured Banner */}
                <div className="relative rounded-2xl overflow-hidden h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-between px-8 shadow-lg">
                    <div className="relative z-10">
                        <h3 className="text-white font-bold text-2xl mb-1">Free Shipping on Orders $50+</h3>
                        <p className="text-white/80 text-sm">Limited time offer. Shop now and save on delivery!</p>
                    </div>
                    <Link
                        href="/shop"
                        className="relative z-10 bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                    >
                        Shop Now
                    </Link>
                    {/* Decorative circles */}
                    <div className="absolute right-20 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2" />
                    <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />
                </div>

                {/* Products Section 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                            <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
                        </div>
                        <Link href="/shop" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium group">
                            View all
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
>>>>>>> origin/main
                        {products?.slice(10, 20).map((product) => (
                            <ProductCard key={product?._id} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
