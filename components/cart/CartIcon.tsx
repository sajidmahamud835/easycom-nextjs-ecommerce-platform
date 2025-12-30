"use client";
import useCartStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
  const { getTotalItems } = useCartStore();
  const itemCount = getTotalItems();
  const displayCount = itemCount > 9 ? "9+" : itemCount;

  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingBag className="group-hover:text-shop_light_green hoverEffect" />
      {itemCount > 0 ? (
        <span
          className={`absolute -top-1 -right-1 bg-shop_btn_dark_green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px] h-[14px] ${
            itemCount > 9 ? "px-1" : ""
          }`}
        >
          {displayCount}
        </span>
      ) : (
        <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px]">
          0
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
