"use client";

import Image from "next/image";
import Link from "next/link";
import React, { memo, useState } from "react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import { urlFor } from "@/sanity/lib/image";
import { Star, Heart } from "lucide-react";
import { Product } from "@/sanity.types";

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";

interface Props {
  product: Product;
  priority?: boolean;
}

// Optimized with React.memo to prevent unnecessary re-renders when parent state changes (e.g. view mode, filters)
// independent of the product data.
const ProductCard = memo(({ product, priority = false }: Props) => {
  const rating = product?.averageRating || 4.5;
  const fullStars = Math.floor(rating);
  const [imgError, setImgError] = useState(false);

  const imageUrl = product?.images?.[0] && !imgError
    ? urlFor(product.images[0]).url()
    : PLACEHOLDER_IMAGE;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 h-full flex flex-col">

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-50 hover:scale-110">
        <Heart className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" />
      </button>

      {/* Discount Badge */}
      {product?.discount != null && product.discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          -{product.discount}%
        </div>
      )}

      {/* Image Area - Fixed height for grid alignment */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product?.slug?.current}`} className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
          <Image
            src={imageUrl}
            alt={product?.name || "Product Image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain drop-shadow-sm"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            onError={() => setImgError(true)}
          />
        </Link>
      </div>

      {/* Content Area - Flex grow to push footer down */}
      <div className="p-4 flex flex-col gap-2 flex-grow">

        {/* Title */}
        <Link
          href={`/product/${product?.slug?.current}`}
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors leading-snug"
        >
          {product?.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < fullStars ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product?.totalReviews || 0})
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-2">
          <PriceView
            price={product?.price}
            discount={undefined}
            className="text-lg font-bold text-gray-900"
          />

          {/* Stock Status - Accessible green */}
          {product?.stock && product.stock > 0 ? (
            <span className="text-xs text-green-700 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-gray-500">Check availability</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <AddToCartButton
            product={product}
            className="w-full shadow-md"
          />
        </div>

      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
