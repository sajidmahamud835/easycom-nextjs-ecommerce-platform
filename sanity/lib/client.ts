import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Read-only client for fetching data (with CDN for guest users)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ✅ Enable CDN for faster guest user reads
  stega: {
    studioUrl:
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}/studio`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  },
});

// Write client for mutations (authenticated) - Use this for create, update, delete operations
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Don't use CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Server-side token with write permissions
});
