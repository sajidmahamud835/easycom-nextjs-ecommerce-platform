import { Suspense } from "react";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/sanity/queries";
import { notFound } from "next/navigation";
import ProductContent from "@/components/ProductContent";
import { Product } from "@/sanity.types";
import { Metadata } from "next";
import {
  generateProductMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import { validateProduct } from "@/lib/productValidation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
    };
  }

  // Brand is now included inline in the query
  return generateProductMetadata(rawProduct as any);
}

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductPageContent slug={slug} />
      </Suspense>
    </div>
  );
};

const ProductPageContent = async ({ slug }: { slug: string }) => {
  const rawProduct = await getProductBySlug(slug);

  // Validate product data
  const validatedProduct = rawProduct ? validateProduct(rawProduct) : null;

  if (!validatedProduct) {
    return notFound();
  }

  // Fetch related products (categories are now resolved in main query)
  const categoryIds = rawProduct?.categories?.map((cat: any) => cat._id) || [];
  const relatedProducts = await getRelatedProducts(
    categoryIds,
    validatedProduct.slug,
    4
  );

  // Generate structured data
  const productSchema = generateProductSchema(rawProduct as any);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: validatedProduct.name, url: `/product/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <ProductContent
        product={rawProduct as any}
        relatedProducts={(relatedProducts || []) as unknown as Product[]}
        brand={rawProduct?.brand || null}
      />
    </>
  );
};

export default ProductPage;
