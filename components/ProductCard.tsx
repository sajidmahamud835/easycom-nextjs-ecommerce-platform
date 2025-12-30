import Image from "next/image";
import Link from "next/link";
import React from "react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import { urlFor } from "@/sanity/lib/image";
import { Star, Heart } from "lucide-react";
import { Product } from "@/sanity.types";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const rating = product?.rating || 4.5;
  const fullStars = Math.floor(rating);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">

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

      {/* Image Area */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product?.slug?.current}`} className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
          {product?.images?.[0] && (
            <Image
              src={urlFor(product.images[0]).url()}
              alt={product.name || "Product Image"}
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          )}
        </Link>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-2">

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

          {/* Stock Status */}
          {product?.stock && product.stock > 0 ? (
            <span className="text-xs text-emerald-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-gray-400">Check availability</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <AddToCartButton
            product={product}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-2.5 text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
          />
        </div>

      </div>
    </div>
  );
};

ProductCard.displayName = "ProductCard";

export default ProductCard;
