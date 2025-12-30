"use client";

import React, { useEffect, useState } from "react";
import useCartStore from "@/store";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { CartItemControls } from "./CartItemControls";
import { AddressSelector } from "./AddressSelector";
import { CheckoutButton } from "./CheckoutButton";
import { OrderPlacementSkeleton } from "./OrderPlacementSkeleton";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface Address {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
}

interface UserOrder {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  currency: string;
  status: string;
  orderDate: string;
  customerName: string;
  email: string;
}

interface ServerCartContentProps {
  userEmail: string;
  userAddresses: Address[];
  userOrders: UserOrder[];
  onAddressesRefresh?: (newAddress?: Address) => Promise<void>;
}

export function ServerCartContent({
  userEmail,

  userAddresses,
  userOrders,
  onAddressesRefresh,
}: ServerCartContentProps) {
  const {
    items: cart,
    getSubTotalPrice,
    getTotalDiscount,
    resetCart,
    setOrderPlacementState,
  } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Reset order placement state when cart page loads to clear any stale state
  useEffect(() => {
    setOrderPlacementState(false, "validating");
  }, [setOrderPlacementState]);

  const handleResetCart = () => {
    setShowClearModal(true);
  };

  const confirmResetCart = () => {
    resetCart();
    setShowClearModal(false);
    toast.success("Cart cleared successfully");
  };

  // Set default address on mount
  useEffect(() => {
    const defaultAddress = userAddresses.find((addr) => addr.default);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    } else if (userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0]);
    }
  }, []);

  // New pricing structure:
  // 1. Subtotal = gross amount (sum of original prices before discount)
  // 2. Discount = total discount amount
  // 3. Current total = subtotal - discount
  // 4. Shipping and tax calculated on current total
  // 5. Final total = current total + shipping + tax

  const grossSubtotal = getSubTotalPrice(); // Gross amount (before discount)
  const totalDiscount = getTotalDiscount(); // Total discount amount
  const currentSubtotal = grossSubtotal - totalDiscount; // After discount
  const shipping = currentSubtotal > 100 ? 0 : 10;
  const tax =
    currentSubtotal * (parseFloat(process.env.TAX_AMOUNT || "0") || 0);
  const finalTotal = currentSubtotal + shipping + tax;

  // Don't show order placement skeleton in ServerCartContent
  // The overlay is handled by CheckoutButton component instead

  if (!cart || cart.length === 0) {
    return (
      <div className="space-y-8">
        <EmptyCart />

        {/* Show recent orders if available */}
        {userOrders.length > 0 && (
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {userOrders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <PriceFormatter amount={order.totalPrice} />
                    <Badge
                      variant={
                        order.status === "delivered" ? "default" : "secondary"
                      }
                      className="ml-2"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/user/orders">
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <div key={item.product._id} className="border rounded-lg p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={
                    item.product.images?.[0]
                      ? urlFor(item.product.images[0]).url()
                      : "/placeholder.jpg"
                  }
                  alt={item.product.name || "Product"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/product/${item.product.slug?.current}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.categories && (
                      <div className="flex gap-2 mt-1">
                        {item.product.categories?.slice(0, 2).map(
                          (
                            category: {
                              _ref?: string;
                              _type?: string;
                              name?: string;
                              title?: string;
                            },
                            idx: number
                          ) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {category?.name || category?.title || "Category"}
                            </Badge>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      <PriceFormatter amount={item.product.price} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per item
                    </div>
                  </div>
                </div>

                {/* Stock Status */}
                {item.product.stock === 0 && (
                  <Badge variant="destructive" className="mt-2">
                    Out of Stock
                  </Badge>
                )}
                {item.product.stock &&
                  item.product.stock < 5 &&
                  item.product.stock > 0 && (
                    <Badge
                      variant="outline"
                      className="mt-2 text-orange-600 border-orange-600"
                    >
                      Only {item.product.stock} left
                    </Badge>
                  )}

                {/* Controls */}
                <div className="flex justify-between items-center mt-4">
                  <CartItemControls product={item.product} />
                  <div className="font-bold">
                    <PriceFormatter
                      amount={(item.product.price || 0) * item.quantity}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Continue Shopping */}
        <div className="flex flex-col gap-2 w-48">
          <Link href="/shop">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleResetCart}
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Order Summary & Checkout */}
      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        {/* Address Selection */}
        <AddressSelector
          userEmail={userEmail}
          addresses={userAddresses}
          selectedAddress={selectedAddress}
          onAddressSelect={setSelectedAddress}
          onAddressesRefresh={onAddressesRefresh}
        />

        {/* Order Summary */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <PriceFormatter amount={grossSubtotal} />
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  -<PriceFormatter amount={totalDiscount} />
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <PriceFormatter amount={shipping} />
              )}
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <PriceFormatter amount={tax} />
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <PriceFormatter amount={finalTotal} />
            </div>

            {shipping === 0 && (
              <p className="text-sm text-green-600">
                🎉 You got free shipping!
              </p>
            )}
            {currentSubtotal < 100 && (
              <p className="text-sm text-muted-foreground">
                Add <PriceFormatter amount={100 - currentSubtotal} /> more for
                free shipping
              </p>
            )}
          </div>

          {/* Checkout */}
          <div className="mt-6">
            <CheckoutButton cart={cart} selectedAddress={selectedAddress} />
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
            )}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Clear Cart Confirmation</DialogTitle>
            </VisuallyHidden.Root>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border-4 border-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Clear Cart</h3>
                <p className="text-gray-600 leading-relaxed">
                  You&apos;re about to remove{" "}
                  <span className="font-semibold text-red-600">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>{" "}
                  from your cart. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowClearModal(false)}
                className="flex-1 border-gray-300 hover:bg-gray-50 font-medium"
              >
                Keep Items
              </Button>
              <Button
                variant="destructive"
                onClick={confirmResetCart}
                className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500 font-semibold shadow-lg hover:shadow-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
