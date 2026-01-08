"use server";

import { client } from "@/sanity/lib/client";

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
}

// Cache duration for FAQs (1 hour)
const FAQ_CACHE_DURATION = 3600;

/**
 * Fetches all active FAQs from Sanity, ordered by display order.
 */
export async function getFAQs(): Promise<FAQ[]> {
    const query = `*[_type == "faq" && isActive == true] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`;

    try {
        const faqs = await client.fetch(query, undefined, {
            next: {
                revalidate: FAQ_CACHE_DURATION,
                tags: ["faqs"],
            },
        });
        return faqs;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
}

/**
 * Fetches FAQs by category.
 */
export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
    const query = `*[_type == "faq" && isActive == true && category == $category] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`;

    try {
        const faqs = await client.fetch(query, { category }, {
            next: {
                revalidate: FAQ_CACHE_DURATION,
                tags: ["faqs", `faqs-${category}`],
            },
        });
        return faqs;
    } catch (error) {
        console.error("Error fetching FAQs by category:", error);
        return [];
    }
}
