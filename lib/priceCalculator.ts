/**
 * Price Calculator
 * Inspired by shopping-cost-calculator-js patterns.
 * Handles dynamic price calculations with variants, discounts, and promo codes.
 */

export interface SelectedVariant {
    name: string;
    selectedOption: {
        label: string;
        priceModifier: number;
    };
}

export interface PriceBreakdown {
    basePrice: number;
    variantModifiers: number;
    subtotal: number;
    discountAmount: number;
    discountPercentage: number;
    deliveryCost: number;
    promoCodeDiscount: number;
    total: number;
    savings: number;
}

/**
 * Calculates the complete price breakdown for a product.
 * 
 * @param basePrice - The base price of the product
 * @param selectedVariants - Array of selected variant options
 * @param discountPercentage - Product-level discount percentage (0-100)
 * @param deliveryCost - Shipping/delivery cost
 * @param promoCodePercentage - Promo code discount percentage (0-100)
 * @returns Complete price breakdown object
 */
export function calculatePrice(
    basePrice: number,
    selectedVariants: SelectedVariant[] = [],
    discountPercentage: number = 0,
    deliveryCost: number = 0,
    promoCodePercentage: number = 0
): PriceBreakdown {
    // Calculate variant modifiers
    const variantModifiers = selectedVariants.reduce(
        (sum, variant) => sum + (variant.selectedOption?.priceModifier || 0),
        0
    );

    // Subtotal = Base + Variants
    const subtotal = basePrice + variantModifiers;

    // Apply product discount
    const discountAmount = subtotal * (discountPercentage / 100);
    const afterProductDiscount = subtotal - discountAmount;

    // Apply promo code discount
    const promoCodeDiscount = afterProductDiscount * (promoCodePercentage / 100);
    const afterPromoDiscount = afterProductDiscount - promoCodeDiscount;

    // Add delivery cost
    const total = afterPromoDiscount + deliveryCost;

    // Calculate total savings
    const savings = discountAmount + promoCodeDiscount;

    return {
        basePrice: roundCurrency(basePrice),
        variantModifiers: roundCurrency(variantModifiers),
        subtotal: roundCurrency(subtotal),
        discountAmount: roundCurrency(discountAmount),
        discountPercentage,
        deliveryCost: roundCurrency(deliveryCost),
        promoCodeDiscount: roundCurrency(promoCodeDiscount),
        total: roundCurrency(total),
        savings: roundCurrency(savings),
    };
}

/**
 * Rounds a number to 2 decimal places for currency.
 */
function roundCurrency(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * Validates a promo code and returns the discount percentage.
 * In production, this should call an API endpoint.
 */
export function validatePromoCode(code: string): number {
    const promoCodes: { [key: string]: number } = {
        "WELCOME10": 10,
        "FLASH20": 20,
        "VIP50": 50,
        "STEVEKAKU": 20, // Easter egg from shopping-cost-calculator-js
    };

    return promoCodes[code.toUpperCase()] || 0;
}

/**
 * Formats a price for display.
 */
export function formatPrice(price: number, currency: string = "$"): string {
    return `${currency}${price.toFixed(2)}`;
}
