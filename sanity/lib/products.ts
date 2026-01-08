import { client } from "./client";
import { Product } from "../../sanity.types";

// Cache duration for product listings (1 hour)
const PRODUCTS_CACHE_DURATION = 3600;

export const getProducts = async (): Promise<Product[]> => {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    _type,
    name,
    "slug": slug,
    price,
    description,
    "images": images,
    discount,
    stock
  }`;

  try {
    // Use CDN client with caching for guest users
    const products = await client.fetch(query, undefined, {
      next: {
        revalidate: PRODUCTS_CACHE_DURATION, // Cache for 1 hour
        tags: ["products"], // Tag for on-demand revalidation
      },
    });
    console.log("[getProducts] Fetched", products?.length || 0, "products");
    // Force serialization to ensure plain objects are returned to client components
    return JSON.parse(JSON.stringify(products || []));
  } catch (error) {
    console.error("[getProducts] Error fetching products:", error);
    return [];
  }
};
