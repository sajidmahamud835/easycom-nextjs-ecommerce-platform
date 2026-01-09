import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { client } from "@/sanity/lib/client";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Not logged in" },
        { status: 401 }
      );
    }

    // Get current user details to check admin status
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    // Check if current user is admin
    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "_createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    console.log("API Params - category:", category, "search:", search);

    // If requesting a specific product by ID, return full details
    if (productId) {
      const productQuery = `
        *[_type == "product" && _id == "${productId}"][0] {
          _id,
          _type,
          _createdAt,
          _updatedAt,
          _rev,
          name,
          slug,
          description,
          price,
          discount,
          stock,
          images[]{
            ...,
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
          },
          status,
          variant,
          isFeatured
        }
      `;

      const product = await client.fetch(productQuery);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Transform the data to match our interface
      const transformedProduct = {
        ...product,
        category: product.categories?.[0]
          ? {
            _id: product.categories[0]._id,
            name: product.categories[0].title,
            title: product.categories[0].title,
            slug: product.categories[0].slug,
          }
          : null,
        brand: product.brand
          ? {
            _id: product.brand._id,
            name: product.brand.title,
            title: product.brand.title,
            slug: product.brand.slug,
          }
          : null,
        featured: product.isFeatured,
      };

      return NextResponse.json({ product: transformedProduct });
    }

    // Build filter conditions
    const filterConditions = [];
    if (category) {
      // Use references to filter by category
      filterConditions.push(
        `references(*[_type == "category" && title == "${category}"]._id)`
      );
    }
    if (search) {
      filterConditions.push(
        `(name match "${search}*" || description match "${search}*")`
      );
    } // Build GROQ query
    const query = `
      *[_type == "product"${filterConditions.length > 0
        ? ` && (${filterConditions.join(" && ")})`
        : ""
      }] | order(${sortBy} ${sortOrder}) [${offset}...${offset + limit}] {
        _id,
        _createdAt,
        name,
        description,
        price,
        stock,
        images[]{
          asset->{
            _id,
            url
          },
          alt
        },
        "category": categories[0]->{
          _id,
          "name": title,
          "title": title
        },
        "categories": categories[]->{
          _id,
          "name": title,
          "title": title
        },
        brand-> {
          _id,
          "name": title
        },
        "featured": isFeatured,
        status
      }
    `;

    // Get count query
    const countQuery = `
      count(*[_type == "product"${filterConditions.length > 0
        ? ` && (${filterConditions.join(" && ")})`
        : ""
      }])
    `;

    // Execute queries
    const [products, totalCount] = await Promise.all([
      client.fetch(query),
      client.fetch(countQuery),
    ]);

    return NextResponse.json({
      products,
      totalCount,
      hasNextPage: offset + limit < totalCount,
      pagination: {
        limit,
        offset,
        total: totalCount,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const {
      name,
      description,
      price,
      discount,
      stock,
      sku,
      barcode,
      weight,
      dimensions,
      status,
      variant,
      isFeatured,
      isTodaysDeal,
      categoryId,
      brandId,
      variants,
      images,
      videos,
      seo
    } = await req.json();

    // Basic validation
    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and Price are required" }, { status: 400 });
    }

    const doc: any = {
      _type: 'product',
      name,
      description,
      price,
      discount: discount || 0,
      stock: stock || 0,
      sku,
      barcode,
      weight: weight || 0,
      dimensions,
      status: status || 'new',
      variant: variant || 'others',
      isFeatured: isFeatured || false,
      isTodaysDeal: isTodaysDeal || false,
      variants,
      images, // Assuming these are already asset references or will be handled
      videos, // Assuming these are already asset references
      seo,
      slug: {
        _type: 'slug',
        current: name.toLowerCase().replace(/\s+/g, '-').slice(0, 96)
      }
    };

    if (categoryId) {
      doc.categories = [{
        _type: 'reference',
        _ref: categoryId,
        _key: Math.random().toString(36).substring(7)
      }];
    }

    if (brandId) {
      doc.brand = {
        _type: 'reference',
        _ref: brandId
      };
    }

    const createdProduct = await client.create(doc);

    return NextResponse.json({ product: createdProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
