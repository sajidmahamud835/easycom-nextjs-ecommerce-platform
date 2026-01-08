"use client";

import { PriceBreakdown, formatPrice } from "@/lib/priceCalculator";

interface PriceSummaryProps {
    breakdown: PriceBreakdown;
    showBreakdown?: boolean;
}

export default function PriceSummary({
    breakdown,
    showBreakdown = true,
}: PriceSummaryProps) {
    const hasModifiers = breakdown.variantModifiers !== 0;
    const hasDiscount = breakdown.discountAmount > 0 || breakdown.promoCodeDiscount > 0;

    return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            {showBreakdown && (hasModifiers || hasDiscount) && (
                <div className="space-y-2 text-sm">
                    {/* Base Price */}
                    <div className="flex justify-between text-gray-600">
                        <span>Base Price</span>
                        <span>{formatPrice(breakdown.basePrice)}</span>
                    </div>

                    {/* Variant Modifiers */}
                    {hasModifiers && (
                        <div className="flex justify-between text-gray-600">
                            <span>Configuration</span>
                            <span className={breakdown.variantModifiers > 0 ? "text-orange-500" : "text-green-500"}>
                                {breakdown.variantModifiers > 0 ? "+" : ""}
                                {formatPrice(breakdown.variantModifiers)}
                            </span>
                        </div>
                    )}

                    {/* Subtotal */}
                    {hasModifiers && (
                        <div className="flex justify-between text-gray-800 font-medium pt-2 border-t border-gray-200">
                            <span>Subtotal</span>
                            <span>{formatPrice(breakdown.subtotal)}</span>
                        </div>
                    )}

                    {/* Product Discount */}
                    {breakdown.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount ({breakdown.discountPercentage}%)</span>
                            <span>-{formatPrice(breakdown.discountAmount)}</span>
                        </div>
                    )}

                    {/* Promo Code Discount */}
                    {breakdown.promoCodeDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Promo Code</span>
                            <span>-{formatPrice(breakdown.promoCodeDiscount)}</span>
                        </div>
                    )}

                    {/* Delivery */}
                    {breakdown.deliveryCost > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span>
                            <span>{formatPrice(breakdown.deliveryCost)}</span>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-2"></div>
                </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <div className="text-right">
                    <span className="text-2xl font-bold text-shop_light_green">
                        {formatPrice(breakdown.total)}
                    </span>
                    {breakdown.savings > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                            You save {formatPrice(breakdown.savings)}!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
