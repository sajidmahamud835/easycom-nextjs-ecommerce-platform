import { NextRequest, NextResponse } from "next/server";
import { writeClient, client } from "@/sanity/lib/client";

/**
 * Debug endpoint to test product queries directly.
 * Access: /api/debug/product?slug=demo-product-10
 */
export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get("slug") || "demo-product-10";

    try {
        // Test with both clients to diagnose the issue
        const productWithToken = await writeClient.fetch(
            `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        price,
        "brand": brand->{_id, title}
      }`,
            { slug }
        );

        const productWithoutToken = await client.fetch(
            `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        price
      }`,
            { slug }
        );

        // Get all product slugs with token
        const allSlugsWithToken = await writeClient.fetch(
            `*[_type == "product"]{
        "slug": slug.current
      }[0...20]`
        );

        // Check token availability
        const tokenAvailable = !!process.env.SANITY_API_TOKEN;

        return NextResponse.json({
            status: "success",
            requestedSlug: slug,
            tokenAvailable,
            tokenLength: process.env.SANITY_API_TOKEN?.length || 0,
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            results: {
                withToken: {
                    found: !!productWithToken,
                    product: productWithToken,
                },
                withoutToken: {
                    found: !!productWithoutToken,
                    product: productWithoutToken,
                },
            },
            sampleSlugs: allSlugsWithToken?.map((p: any) => p.slug) || [],
            totalProducts: allSlugsWithToken?.length || 0,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                requestedSlug: slug,
                error: error.message,
                tokenAvailable: !!process.env.SANITY_API_TOKEN,
            },
            { status: 500 }
        );
    }
}
