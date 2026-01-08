"use client";

import { Product } from "@/sanity.types";
import { Loader2, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getTodaysDeals } from "@/actions/getTodaysDeals";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { urlFor } from "@/sanity/lib/image";

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";

const TodaysDeals = () => {
    const [deals, setDeals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const data = await getTodaysDeals();
                setDeals(data);
            } catch (err) {
                console.error("Failed to fetch deals", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    if (loading) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#febd69]" /></div>;

    if (deals.length === 0) return null;

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        Today's Deals
                        <span className="text-xs font-normal text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center">
                            <Timer className="w-3 h-3 mr-1" /> Ending Soon
                        </span>
                    </h2>
                    <Link href="/deals" className="text-[#007185] hover:underline hover:text-[#C7511F] text-sm font-semibold">
                        See all deals
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {deals.slice(0, 5).map((product) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group cursor-pointer"
                        >
                            <Card className="border-0 shadow-none hover:shadow-lg transition-shadow rounded-md overflow-hidden h-full flex flex-col">
                                <CardContent className="p-0">
                                    <div className="relative bg-gray-100 h-48 flex items-center justify-center">
                                        <Image
                                            src={product.images?.[0] ? urlFor(product.images[0]).url() : PLACEHOLDER_IMAGE}
                                            alt={product.name || "Deal Product"}
                                            fill
                                            className="object-contain mix-blend-multiply p-4 transition-transform group-hover:scale-105"
                                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                                        />
                                    </div>

                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-[#cc0c39] hover:bg-[#cc0c39] text-white text-xs px-2 py-0.5 rounded-sm font-bold">
                                                {product.discountPercentage ? `${product.discountPercentage}% off` : "Generic Deal"}
                                            </Badge>
                                            <span className="text-[#cc0c39] font-bold text-xs">Limited time deal</span>
                                        </div>

                                        <div className="mb-1">
                                            <span className="text-lg font-bold">
                                                ${product.price?.toFixed(2)}
                                            </span>
                                            {product.discountPercentage && product.price && (
                                                <span className="text-xs text-gray-500 line-through ml-2">
                                                    ${(product.price * (100 / (100 - product.discountPercentage))).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-sm text-gray-700 line-clamp-2 leading-snug group-hover:text-[#C7511F] transition-colors">
                                            {product.name}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TodaysDeals;
