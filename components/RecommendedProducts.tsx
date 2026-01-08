"use client";

import { useEffect, useState } from "react";
import { Product } from "@/sanity.types";
import { getRecommendations } from "@/actions/getRecommendations";
import { useUserInteractions } from "@/components/hooks/useUserInteractions";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function RecommendedProducts() {
    const { interactions, isLoaded } = useUserInteractions();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            if (!isLoaded) return;

            try {
                const data = await getRecommendations(
                    interactions.viewedProducts,
                    interactions.viewedCategories
                );
                setProducts(data);
            } catch (error) {
                console.error("Error loading recommendations:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecommendations();
    }, [isLoaded, interactions.viewedProducts, interactions.viewedCategories]);

    if (!isLoaded || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-shop_light_green" />
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {interactions.viewedProducts.length > 0
                            ? "Recommended for You"
                            : "Trending Now"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <div key={product._id} className="relative group">
                            {product.isFlashDeal && (
                                <div className="absolute -top-2 -right-2 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
                                    🔥 FLASH DEAL
                                </div>
                            )}

                            <div className={product.isFlashDeal ? "ring-2 ring-red-500 ring-offset-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 transform hover:scale-[1.02]" : ""}>
                                <ProductCard product={product} />

                                {product.isFlashDeal && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-transparent p-2 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                        <span className="text-white font-bold text-sm">
                                            Ends in {Math.floor(Math.random() * 50) + 10}m
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
