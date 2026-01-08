import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

/**
 * Debug endpoint to test product queries directly.
 * Access: /api/debug/product?slug=demo-product-10
 */
export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get("slug") || "demo-product-10";

    try {
        // Direct query without cache
        const product = await client.fetch(
            `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        price,
        "brand": brand->{_id, title}
      }`,
            { slug }
        );

        // Also get all product slugs for reference
        const allSlugs = await client.fetch(
            `*[_type == "product"]{
        "slug": slug.current
      }[0...20]`
        );

        return NextResponse.json({
            status: "success",
            requestedSlug: slug,
            productFound: !!product,
            product,
            sampleSlugs: allSlugs.map((p: any) => p.slug),
            message: product
                ? "Product found successfully"
                : `No product with slug "${slug}" exists in Sanity`,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                requestedSlug: slug,
                error: error.message,
                stack: error.stack,
            },
            { status: 500 }
        );
    }
}
