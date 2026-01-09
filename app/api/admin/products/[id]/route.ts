import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient, client } from "@/sanity/lib/client";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single product by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;

        if (!userEmail || !isUserAdmin(userEmail)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        const product = await client.fetch(
            `*[_type == "product" && _id == $id][0] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        name,
        slug,
        description,
        price,
        discount,
        discountPercentage,
        stock,
        sku,
        barcode,
        weight,
        dimensions,
        status,
        variant,
        isFeatured,
        isTodaysDeal,
        dealEndTime,
        tags,
        seo,
        images[]{
          _key,
          asset->{
            _id,
            url
          }
        },
        categories[]->{
          _id,
          title,
          slug
        },
        brand->{
          _id,
          title,
          slug
        }
      }`,
            { id }
        );

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH - Update product
export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;

        if (!userEmail || !isUserAdmin(userEmail)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        // Build the patch object with only provided fields
        const patchData: Record<string, unknown> = {};

        // Text fields
        if (body.name !== undefined) patchData.name = body.name;
        if (body.description !== undefined) patchData.description = body.description;
        if (body.sku !== undefined) patchData.sku = body.sku;
        if (body.barcode !== undefined) patchData.barcode = body.barcode;
        if (body.dimensions !== undefined) patchData.dimensions = body.dimensions;

        // Number fields
        if (body.price !== undefined) patchData.price = Number(body.price);
        if (body.discount !== undefined) patchData.discount = Number(body.discount);
        if (body.discountPercentage !== undefined) patchData.discountPercentage = Number(body.discountPercentage);
        if (body.stock !== undefined) patchData.stock = Number(body.stock);
        if (body.weight !== undefined) patchData.weight = Number(body.weight);

        // String fields
        if (body.status !== undefined) patchData.status = body.status;
        if (body.variant !== undefined) patchData.variant = body.variant;

        // Boolean fields
        if (body.isFeatured !== undefined) patchData.isFeatured = Boolean(body.isFeatured);
        if (body.isTodaysDeal !== undefined) patchData.isTodaysDeal = Boolean(body.isTodaysDeal);

        // Date fields
        if (body.dealEndTime !== undefined) patchData.dealEndTime = body.dealEndTime;

        // Array fields
        if (body.tags !== undefined) patchData.tags = body.tags;

        // Reference fields - categories
        if (body.categoryId !== undefined) {
            patchData.categories = body.categoryId
                ? [{ _type: "reference", _ref: body.categoryId }]
                : [];
        }

        // Reference fields - brand
        if (body.brandId !== undefined) {
            patchData.brand = body.brandId
                ? { _type: "reference", _ref: body.brandId }
                : null;
        }

        // SEO object
        if (body.seo !== undefined) {
            patchData.seo = body.seo;
        }

        // Update slug if name changed
        if (body.name !== undefined && body.updateSlug) {
            patchData.slug = {
                _type: "slug",
                current: body.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, ""),
            };
        }

        if (Object.keys(patchData).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        // Execute the patch
        const updatedProduct = await writeClient
            .patch(id)
            .set(patchData)
            .commit();

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE - Delete product
export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;

        if (!userEmail || !isUserAdmin(userEmail)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        await writeClient.delete(id);

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
