import Image from "next/image";
import Link from "next/link";
import React from "react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import { urlFor } from "@/sanity/lib/image";
<<<<<<< HEAD
import { Star, Heart } from "lucide-react";
=======
<<<<<<< HEAD
import { Star } from "lucide-react";
=======
import { Star, Heart } from "lucide-react";
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
import { Product } from "@/sanity.types";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
<<<<<<< HEAD
  const rating = product?.averageRating || 4.5;
  const fullStars = Math.floor(rating);

=======
<<<<<<< HEAD
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
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
<<<<<<< HEAD
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product?.slug?.current}`} className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
=======
      <div className="relative w-full h-52 bg-gray-50 p-4 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
        <Link href={`/product/${product?.slug?.current}`} className="w-full h-full relative">
=======
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
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
          {product?.images?.[0] && (
            <Image
              src={urlFor(product.images[0]).url()}
              alt={product.name || "Product Image"}
              fill
<<<<<<< HEAD
              className="object-contain drop-shadow-sm"
=======
<<<<<<< HEAD
              className="object-contain"
=======
              className="object-contain drop-shadow-sm"
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
              priority
            />
          )}
        </Link>
<<<<<<< HEAD
=======
<<<<<<< HEAD
        {/* Quick batch badge simulation */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
          Bulk Deal
        </div>
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-2">

        {/* Title */}
<<<<<<< HEAD
=======
        <Link href={`/product/${product?.slug?.current}`} className="line-clamp-2 text-sm text-[#0F1111] hover:text-[#C7511F] hover:underline leading-snug mb-1 font-medium group-hover:text-[#C7511F] transition-colors">
=======
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-2">

        {/* Title */}
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
        <Link
          href={`/product/${product?.slug?.current}`}
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors leading-snug"
        >
<<<<<<< HEAD
=======
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
          {product?.name}
        </Link>

        {/* Rating */}
<<<<<<< HEAD
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
=======
<<<<<<< HEAD
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex text-[#FFA41C]">
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < fullStars ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
              />
            ))}
          </div>
<<<<<<< HEAD
          <span className="text-xs text-gray-500">
            ({product?.totalReviews || 0})
=======
          <span className="text-xs text-blue-600 hover:text-red-700 hover:underline cursor-pointer">
            {product?.totalReviews || 120}
=======
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
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
          </span>
        </div>

        {/* Price Section */}
<<<<<<< HEAD
        <div className="mt-auto pt-2">
=======
<<<<<<< HEAD
        <div className="mt-auto">
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
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

<<<<<<< HEAD
=======
        {/* Action Button - Mobile friendly but subtle on Desktop */}
        <div className="mt-2">
          <AddToCartButton product={product} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] hover:border-[#F2C200] rounded-full py-1.5 text-xs font-normal shadow-sm" />
=======
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

>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
        {/* Add to Cart Button */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <AddToCartButton
            product={product}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-2.5 text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
          />
<<<<<<< HEAD
=======
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
        </div>

      </div>
    </div>
  );
};

ProductCard.displayName = "ProductCard";

export default ProductCard;
