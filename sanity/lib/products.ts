<<<<<<< HEAD
import { writeClient } from "./client";
import { Product } from "../../sanity.types";

export const getProducts = async (): Promise<Product[]> => {
=======
﻿import { writeClient } from "./client";

export const getProducts = async () => {
>>>>>>> origin/main
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
    const products = await writeClient.fetch(query);
    console.log("[getProducts] Fetched", products?.length || 0, "products");
<<<<<<< HEAD
    // Force serialization to ensure plain objects are returned to client components
    return JSON.parse(JSON.stringify(products || []));
=======
<<<<<<< HEAD
    return products || [];
=======
    // Force serialization to ensure plain objects are returned to client components
    return JSON.parse(JSON.stringify(products || []));
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
  } catch (error) {
    console.error("[getProducts] Error fetching products:", error);
    return [];
  }
};
