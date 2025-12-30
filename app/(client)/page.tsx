import HomeBanner from "@/components/HomeBanner";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/sanity/lib/products";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
    const products = await getProducts();

    return (
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
                        {products?.slice(0, 10).map((product) => (
                            <ProductCard key={product?._id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Banner Strip */}
                <div className="w-full h-24 bg-gray-200 flex items-center justify-center border border-gray-300 rounded-sm">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Brand Advertisement Space</span>
                </div>

                {/* More products */}
                <div className="bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products?.slice(10, 20).map((product) => (
                            <ProductCard key={product?._id} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
