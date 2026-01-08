"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Truck, CheckCircle, Clock, MapPin, ArrowRight } from "lucide-react";
import Title from "@/components/Title";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setIsSearching(true);
        // Navigate to the order details page
        router.push(`/user/orders/${orderId.trim()}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Title>Track My Order</Title>

            <div className="mt-8 space-y-8">
                {/* Search Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Search className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Enter Your Order ID</h2>
                            <p className="text-sm text-gray-500">Find your order ID in the confirmation email</p>
                        </div>
                    </div>

                    <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="text"
                            placeholder="e.g., ORDER-1736439234567-ABC123"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="flex-1 h-12 text-base rounded-xl border-gray-200"
                        />
                        <Button
                            type="submit"
                            disabled={isSearching || !orderId.trim()}
                            className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold"
                        >
                            {isSearching ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Track Order
                                </div>
                            )}
                        </Button>
                    </form>
                </div>

                {/* How It Works Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">How Order Tracking Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Order Placed</h3>
                            <p className="text-sm text-gray-500">Your order is confirmed and being processed</p>
                        </div>

                        <div className="hidden md:flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-300" />
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Package className="w-7 h-7 text-amber-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Packing</h3>
                            <p className="text-sm text-gray-500">Your items are being carefully packed</p>
                        </div>

                        <div className="hidden md:flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-300" />
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Truck className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Shipped</h3>
                            <p className="text-sm text-gray-500">On the way to your delivery address</p>
                        </div>

                        <div className="hidden md:flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-300" />
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Delivered</h3>
                            <p className="text-sm text-gray-500">Successfully delivered to you</p>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Need Help with Your Order?</h3>
                                <p className="text-emerald-100">Our support team is ready to assist you</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-6"
                            onClick={() => router.push("/support")}
                        >
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
