/**
 * Product Validation Utility
 * Ensures product data is valid and normalized before rendering.
 */

export interface ValidatedBrand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
}

export interface ProductVariantOption {
    label: string;
    priceModifier: number;
    isDefault: boolean;
}

export interface ProductVariant {
    name: string;
    options: ProductVariantOption[];
}

export interface ValidatedProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    discount: number;
    discountPercentage: number;
    finalPrice: number;
    images: string[];
    brand: ValidatedBrand | null;
    stock: number;
    isAvailable: boolean;
    variants: ProductVariant[];
    averageRating: number;
    totalReviews: number;
    status: string | null;
    isFeatured: boolean;
    isTodaysDeal: boolean;
    dealEndTime: string | null;
}

/**
 * Validates and normalizes raw product data from Sanity.
 * Returns null if the product is invalid.
 */
export function validateProduct(rawProduct: any): ValidatedProduct | null {
    // Check required fields
    if (!rawProduct || !rawProduct._id || !rawProduct.slug?.current) {
        console.error("[validateProduct] Invalid product: Missing _id or slug");
        return null;
    }

    if (!rawProduct.name || typeof rawProduct.price !== "number") {
        console.error("[validateProduct] Invalid product: Missing name or price");
        return null;
    }

    // Calculate final price
    const basePrice = rawProduct.price ?? 0;
    const discount = rawProduct.discount ?? 0;
    const discountPercentage = rawProduct.discountPercentage ?? 0;

    let finalPrice = basePrice - discount;
    if (discountPercentage > 0) {
        finalPrice = basePrice * (1 - discountPercentage / 100);
    }
    finalPrice = Math.max(0, Math.round(finalPrice * 100) / 100); // Ensure non-negative

    // Normalize variants
    const variants: ProductVariant[] = (rawProduct.variants || []).map((v: any) => ({
        name: v.name || "Option",
        options: (v.options || []).map((opt: any) => ({
            label: opt.label || "Unknown",
            priceModifier: opt.priceModifier ?? 0,
            isDefault: opt.isDefault ?? false,
        })),
    }));

    // Normalize brand
    const brand: ValidatedBrand | null = rawProduct.brand
        ? {
            id: rawProduct.brand._id || "",
            name: rawProduct.brand.title || rawProduct.brand.name || "Unknown Brand",
            slug: rawProduct.brand.slug?.current || "",
            logo: rawProduct.brand.logo?.asset?.url,
        }
        : null;

    return {
        id: rawProduct._id,
        name: rawProduct.name,
        slug: rawProduct.slug.current,
        description: rawProduct.description || "",
        basePrice,
        discount,
        discountPercentage,
        finalPrice,
        images: (rawProduct.images || []).map((img: any) => img?.asset?._ref || img),
        brand,
        stock: rawProduct.stock ?? 0,
        isAvailable: (rawProduct.stock ?? 0) > 0,
        variants,
        averageRating: rawProduct.averageRating ?? 0,
        totalReviews: rawProduct.totalReviews ?? 0,
        status: rawProduct.status || null,
        isFeatured: rawProduct.isFeatured ?? false,
        isTodaysDeal: rawProduct.isTodaysDeal ?? false,
        dealEndTime: rawProduct.dealEndTime || null,
    };
}
