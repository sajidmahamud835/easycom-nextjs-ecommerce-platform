"use client";
import { Product } from "@/sanity.types";
import useCartStore from "@/store";
import { Heart, Loader2 } from "lucide-react";
import BreadcrumbLink from "@/components/BreadcrumbLink";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import isArray from "js-isarray";
import _ from "lodash";
import { trackWishlistAdd, trackWishlistRemove } from "@/lib/analytics";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product;
}) => {
  const { favoriteProduct, addToFavorite } = useCartStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const availableItem = _.find(
      favoriteProduct,
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id && !isLoading) {
      setIsLoading(true);
      const isRemoving = !!existingProduct;

      addToFavorite(product)
        .then(() => {
          toast.success(
            isRemoving ? "Removed from wishlist" : "Added to wishlist",
            {
              description: isRemoving
                ? "Product removed successfully!"
                : "Product added successfully!",
              duration: 3000,
            }
          );

          // Track wishlist analytics
          if (isRemoving) {
            trackWishlistRemove({
              productId: product._id,
              name: product.name || "Unknown Product",
            });
          } else {
            trackWishlistAdd({
              productId: product._id,
              name: product.name || "Unknown Product",
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <>
      {!showProduct ? (
        <BreadcrumbLink
          href={"/wishlist"}
          aria-label="View Wishlist"
          className="group relative hover:text-shop_light_green hoverEffect"
        >
          <Heart className="group-hover:text-shop_light_green hoverEffect mt-.5" />
          {/* {isArray(favoriteProduct) && favoriteProduct.length > 0 && ( */}
          <span
            className={`absolute -top-1 -right-1 bg-shop_btn_dark_green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px] h-[14px] ${
              favoriteProduct.length > 9 ? "px-1" : ""
            }`}
          >
            {/* {favoriteProduct.length > 9 ? "9+" : favoriteProduct.length} */}
            {isArray(favoriteProduct) && favoriteProduct.length > 0
              ? favoriteProduct.length > 9
                ? "9+"
                : favoriteProduct.length
              : 0}
          </span>
          {/* )} */}
        </BreadcrumbLink>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleFavorite}
                disabled={isLoading}
                aria-label={
                  existingProduct ? "Remove from wishlist" : "Add to wishlist"
                }
                className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin text-shop_light_green/80 mt-.5 h-6 w-6" />
                ) : (
                  <Heart
                    fill={existingProduct ? "#063c28" : "#fff"}
                    className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5"
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {existingProduct ? "Remove from wishlist" : "Add to wishlist"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default FavoriteButton;
