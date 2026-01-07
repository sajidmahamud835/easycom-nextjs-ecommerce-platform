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

        return recommendations;
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
    }
}
