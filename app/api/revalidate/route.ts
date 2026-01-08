import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Secret token to validate webhook requests
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

/**
 * API Route: POST /api/revalidate
 * 
 * Triggers on-demand revalidation for cached data.
 * Called by Sanity webhooks when content changes.
 * 
 * Query params:
 * - tag: The cache tag to revalidate (products, deals, trending, categories)
 * - secret: The secret token for authentication
 */
export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const secret = searchParams.get("secret");

    // Validate secret
    if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
        return NextResponse.json(
            { error: "Invalid secret" },
            { status: 401 }
        );
    }

    // Validate tag
    if (!tag) {
        return NextResponse.json(
            { error: "Missing tag parameter" },
            { status: 400 }
        );
    }

    // Valid tags
    const validTags = ["products", "deals", "trending", "categories"];
    if (!validTags.includes(tag)) {
        return NextResponse.json(
            { error: `Invalid tag. Valid tags: ${validTags.join(", ")}` },
            { status: 400 }
        );
    }

    try {
        revalidateTag(tag);
        console.log(`[Revalidation] Successfully revalidated tag: ${tag}`);

        return NextResponse.json({
            revalidated: true,
            tag,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error(`[Revalidation] Error revalidating tag ${tag}:`, error);
        return NextResponse.json(
            { error: "Failed to revalidate" },
            { status: 500 }
        );
    }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
    return POST(request);
}
