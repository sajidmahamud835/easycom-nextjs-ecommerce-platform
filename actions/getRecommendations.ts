"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { Product } from "@/sanity.types";

export async function getRecommendations(
    viewedProductIds: string[],
    viewedCategories: string[]
): Promise<Product[]> {
    try {
        // If no history, return trending/featured products (fallback)
        if (viewedProductIds.length === 0 && viewedCategories.length === 0) {
            return await backendClient.fetch(
                `*[_type == "product" && stock > 0] | order(_createdAt desc) [0...6]{
          _id,
          name,
          slug,
          price,
          images,
          "brand": brand->{name},
          "categories": categories[]->{_id, title}
        }`
            );
        }

        // Recommendation Query
        // 1. Exclude viewed products
        // 2. Score boost for products in viewed categories
        // 3. Fallback to other products if not enough matches
        const query = `
      *[_type == "product" && !(_id in $viewedProductIds) && stock > 0] | score(
        count((categories[]->_id)[@ in $viewedCategories]) * 3
      ) | order(_score desc, _createdAt desc) [0...6]{
        _id,
        name,
        slug,
        price,
        images,
        "brand": brand->{name},
        "categories": categories[]->{_id, title}
      }
    `;

        const recommendations = await backendClient.fetch(query, {
            viewedProductIds,
            viewedCategories,
        });

        let finalRecommendations = recommendations;

        // --- HIDDEN JACKPOT SYSTEM ("Flash Deals") ---
        // 30% chance to inject a high-value "Flash Deal" to simulate variable reward schedule
        if (Math.random() > 0.7) {
            try {
                // Fetch a high-value product (e.g., expensive electronics)
                const highValueProduct = await backendClient.fetch(
                    `*[_type == "product" && price > 50 && stock > 0] | order(price desc)[0...10] | order(_createdAt desc)[0]`
                );

                if (highValueProduct) {
                    // Create a "Flash Deal" version of this product
                    const flashPrice = Math.floor(highValueProduct.price * 0.5); // 50% OFF
                    const flashProduct = {
                        ...highValueProduct,
                        price: flashPrice,
                        originalPrice: highValueProduct.price, // Keep original for reference
                        isFlashDeal: true,
                        flashExpiry: Date.now() + 1000 * 60 * (10 + Math.floor(Math.random() * 50)), // Random expiry 10-60 mins
                        name: `🔥 ${highValueProduct.name}`, // Visual cue
                    };

                    // Inject at the top
                    finalRecommendations.unshift(flashProduct);

                    // Limit to 6 items again if needed
                    if (finalRecommendations.length > 6) {
                        finalRecommendations.pop();
                    }
                }
            } catch (err) {
                console.error("Error injecting flash deal:", err);
            }
        }

        return finalRecommendations;
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
    }
}
