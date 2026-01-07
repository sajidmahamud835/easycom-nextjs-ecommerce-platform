"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Product } from "@/sanity.types";

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

        const deals = await client.fetch(query);
        return deals as Product[];
    } catch (error) {
        console.error("Error fetching Today's Deals:", error);
        return [];
    }
}
