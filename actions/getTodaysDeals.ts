"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Product } from "@/sanity.types";

// Cache duration for Today's Deals (15 minutes - deals change frequently)
const DEALS_CACHE_DURATION = 900;

export async function getTodaysDeals() {
    try {
        const query = groq`*[_type == "product" && isTodaysDeal == true && !(_id in path('drafts.**'))] | order(discountPercentage desc) {
      _id,
      name,
      slug,
      image,
      price,
      description,
      discountPercentage,
      dealEndTime,
      isTodaysDeal,
      rating,
      stock
    }`;

        // ✅ Add caching for guest users
        const deals = await client.fetch(query, undefined, {
            next: {
                revalidate: DEALS_CACHE_DURATION, // Cache for 15 minutes
                tags: ["deals"], // Tag for on-demand revalidation
            },
        });
        return deals as Product[];
    } catch (error) {
        console.error("Error fetching Today's Deals:", error);
        return [];
    }
}

