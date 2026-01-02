"use client";
import useCartStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
<<<<<<< HEAD
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const itemCount = getTotalItems();
=======
<<<<<<< HEAD
  const { getTotalItems } = useCartStore();
  const itemCount = getTotalItems();
=======
  const { items } = useCartStore();
  const itemCount = items?.length || 0;
>>>>>>> origin/main
>>>>>>> origin/bugfix/address-state-cart-badge-9606215926048726513
  const displayCount = itemCount > 9 ? "9+" : itemCount;

  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingBag className="group-hover:text-shop_light_green hoverEffect" />
      {itemCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 bg-shop_btn_dark_green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px] h-[14px] ${itemCount > 9 ? "px-1" : ""
            }`}
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
