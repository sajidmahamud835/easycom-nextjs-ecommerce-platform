import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sajidmahamud.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products = [];
  let categories = [];
  let brands = [];

  try {
    // Fetch all products
    products = await client.fetch(`
    *[_type == "product" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `);

    // Fetch all categories
    categories = await client.fetch(`
    *[_type == "category" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `);

    // Fetch all brands
    brands = await client.fetch(`
    *[_type == "brand" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `);
  } catch (error) {
    console.warn("Failed to fetch data for sitemap:", error);
    // Continue with empty arrays if fetch fails (e.g. during build without proper env vars)
  }

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/category`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/deal`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  // Product pages
  const productPages = products.map((product: any) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages = categories.map((category: any) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Brand pages
  const brandPages = brands.map((brand: any) => ({
    url: `${BASE_URL}/brands/${brand.slug}`,
    lastModified: new Date(brand._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages];
}
