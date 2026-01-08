"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  CalendarDays,
  MapPin,
  Package,
  CreditCard,
  Download,
  Truck,
  Clock,
  XCircle,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  X,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";
import { toast } from "sonner";
import useCartStore from "@/store";
import OrderTimeline from "./OrderTimeline";
import { requestOrderCancellation } from "@/actions/orderCancellationActions";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface OrderDetailsPageProps {
  order: {
    _id: string;
    orderNumber: string;
    clerkUserId: string;
    customerName: string;
    email: string;
    products: Array<{
      product: {
        _id: string;
        name: string;
        slug?: { current: string };
        image?: { asset: { url: string } };
        price: number;
        currency: string;
        categories?: Array<{ title: string }>;
      };
      quantity: number;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
    totalPrice: number;
    currency: string;
    amountDiscount: number;
    address: {
      name: string;
      address: string;
      city: string;
      state: string;
      zip: string;
    };
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    orderDate: string;
    invoice?: {
      id: string;
      number: string;
      hosted_invoice_url: string;
    };
    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string;
    paymentCompletedAt?: string;
    addressConfirmedAt?: string;
    addressConfirmedBy?: string;
    orderConfirmedAt?: string;
    orderConfirmedBy?: string;
    packedAt?: string;
    packedBy?: string;
    cashCollectedAt?: string;
    deliveredAt?: string;
    deliveredBy?: string;
    assignedDeliverymanName?: string;
    dispatchedAt?: string;
  };
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case ORDER_STATUSES.PAID:
    case ORDER_STATUSES.DELIVERED:
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case ORDER_STATUSES.CANCELLED:
      return <XCircle className="w-5 h-5 text-red-500" />;
    case ORDER_STATUSES.SHIPPED:
    case ORDER_STATUSES.OUT_FOR_DELIVERY:
      return <Truck className="w-5 h-5 text-blue-500" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-500" />;
  }
};

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case PAYMENT_STATUSES.PAID:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case PAYMENT_STATUSES.FAILED:
    case PAYMENT_STATUSES.CANCELLED:
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case ORDER_STATUSES.PAID:
    case ORDER_STATUSES.DELIVERED:
      return "bg-emerald-100 text-emerald-700";
    case ORDER_STATUSES.CANCELLED:
      return "bg-red-100 text-red-700";
    case ORDER_STATUSES.SHIPPED:
    case ORDER_STATUSES.OUT_FOR_DELIVERY:
      return "bg-blue-100 text-blue-700";
    case ORDER_STATUSES.PROCESSING:
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PAYMENT_STATUSES.PAID:
      return "bg-emerald-100 text-emerald-700";
    case PAYMENT_STATUSES.FAILED:
    case PAYMENT_STATUSES.CANCELLED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ order }) => {
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [isReordering, setIsReordering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const { addMultipleItems } = useCartStore();
  const router = useRouter();

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      // Transform order products to cart format
      const cartItems = order.products.map(({ product, quantity }) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product: product as any,
        quantity,
      }));

      // Add all items to cart at once
      addMultipleItems(cartItems);

      toast.success(`${order.products.length} items added to cart!`, {
        description: "Redirecting to cart...",
      });

      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push("/cart");
      }, 1000);
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to reorder items. Please try again.");
    } finally {
      setIsReordering(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setGeneratingInvoice(true);
    try {
      const response = await fetch(
        `/api/orders/${order._id}/generate-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Invoice generated successfully!");
        // Update the current order with the new invoice data
        setCurrentOrder((prev) => ({
          ...prev,
          invoice: data.invoice,
        }));
      } else {
        console.error("Invoice generation failed:", data);
        const errorMessage = data.error || "Failed to generate invoice";
        const details = data.details ? ` Details: ${data.details}` : "";
        toast.error(errorMessage + details);
      }
    } catch (error) {
      console.error("Invoice generation error:", error);
      toast.error(
        "Network error: Failed to generate invoice. Please try again."
      );
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const result = await requestOrderCancellation(
        order._id,
        cancellationReason || "Cancelled by customer"
      );

      if (result.success) {
        toast.success(result.message);
        // Update the current order to show cancellation request pending
        setCurrentOrder(
          (prev) =>
          ({
            ...prev,
            cancellationRequested: true,
            cancellationRequestedAt: new Date().toISOString(),
            cancellationRequestReason:
              cancellationReason || "Cancelled by customer",
          } as any)
        );
        setShowCancelDialog(false);
        setCancellationReason("");

        // Refresh the page to show updated status
        router.refresh();
      } else {
        toast.error(result.message || "Failed to submit cancellation request");
      }
    } catch (error) {
      console.error("Error requesting cancellation:", error);
      toast.error(
        "An error occurred while submitting the cancellation request"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if order can be cancelled (before order is confirmed)
  const canCancelOrder = () => {
    const cancellableStatuses = ["pending", "address_confirmed"];
    return (
      cancellableStatuses.includes(currentOrder.status) &&
      currentOrder.status !== "cancelled" &&
      !(currentOrder as any).cancellationRequested // Don't show cancel button if request already pending
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Order ID:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentOrder._id);
                  toast.success("Order ID copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-mono text-gray-700 transition-colors group"
              >
                {currentOrder.orderNumber?.slice(-12) || currentOrder._id.slice(-12)}
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <span className="hidden sm:inline text-gray-300">|</span>
            <button
              onClick={() => {
                const trackingUrl = `${window.location.origin}/track-order?id=${currentOrder._id}`;
                navigator.clipboard.writeText(trackingUrl);
                toast.success("Tracking link copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-700 transition-colors group"
            >
              <Truck className="w-4 h-4" />
              Copy Tracking Link
              <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {currentOrder.invoice?.hosted_invoice_url ? (
            <Button asChild variant="outline">
              <Link
                href={currentOrder.invoice.hosted_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Link>
            </Button>
          ) : currentOrder.paymentStatus === "paid" ||
            currentOrder.status === "paid" ? (
            <Button
              onClick={handleGenerateInvoice}
              disabled={generatingInvoice}
              variant="outline"
            >
              {generatingInvoice ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Invoice
                </>
              )}
            </Button>
          ) : null}
          <Button
            onClick={handleReorder}
            disabled={isReordering}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
          >
            {isReordering ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Reorder
              </>
            )}
          </Button>
          {canCancelOrder() && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              disabled={isCancelling}
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </>
              )}
            </Button>
          )}
          <Button asChild>
            <Link href="/user/orders">← Back to Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cancellation Request Notice */}
          {(currentOrder as any).cancellationRequested && (
            <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800">Cancellation Request Pending</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Your cancellation request has been submitted and is awaiting
                    admin review. You will be notified once it has been processed.
                  </p>
                  {(currentOrder as any).cancellationRequestedAt && (
                    <p className="text-xs text-amber-600 mt-2">
                      Requested on:{" "}
                      {format(
                        new Date((currentOrder as any).cancellationRequestedAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                {getStatusIcon(currentOrder.status)}
              </div>
              <h2 className="text-lg font-bold text-gray-900">Order Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Order Status</p>
                <Badge
                  className={`${getStatusColor(currentOrder.status)}`}
                >
                  {currentOrder.status}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <Badge
                  className={`${getPaymentStatusColor(
                    currentOrder.paymentStatus
                  )} flex items-center gap-1 w-fit`}
                >
                  {getPaymentStatusIcon(currentOrder.paymentStatus)}
                  {currentOrder.paymentStatus}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium capitalize flex items-center gap-2 text-gray-900">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  {currentOrder.paymentMethod.replace("_", " ")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Order Date</p>
                <p className="font-medium flex items-center gap-2 text-gray-900">
                  <CalendarDays className="w-4 h-4 text-gray-600" />
                  {format(new Date(currentOrder.orderDate), "PPP")}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <OrderTimeline order={currentOrder} />

          {/* Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-100 rounded-xl">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Order Items ({order.products.length})</h2>
            </div>
            <div className="space-y-4">
              {order.products?.map(
                (
                  item: {
                    product: {
                      _id: string;
                      name: string;
                      slug?: { current: string };
                      image?: { asset: { url: string } };
                      price: number;
                      currency: string;
                      categories?: Array<{ title: string }>;
                    };
                    quantity: number;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {item.product.image && (
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={urlFor(item.product.image).url()}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.product.slug ? (
                          <Link
                            href={`/product/${item.product.slug.current}`}
                            className="hover:text-emerald-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        ) : (
                          item.product.name
                        )}
                      </h3>
                      {item.product.categories && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.product.categories
                            .map((cat) => cat.title)
                            .join(", ")}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </span>
                        <PriceFormatter
                          amount={item.product.price}
                          className="font-medium text-gray-700"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <PriceFormatter
                        amount={item.product.price * item.quantity}
                        className="font-bold text-lg text-emerald-600"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-emerald-500">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <PriceFormatter amount={currentOrder.subtotal} className="text-gray-900" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <PriceFormatter amount={currentOrder.tax} className="text-gray-900" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <PriceFormatter amount={currentOrder.shipping} className="text-gray-900" />
              </div>
              {currentOrder.amountDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>
                    -<PriceFormatter amount={currentOrder.amountDiscount} />
                  </span>
                </div>
              )}
              <div className="my-4 border-t border-dashed border-gray-200"></div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <PriceFormatter amount={currentOrder.totalPrice} className="text-2xl font-bold text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-sm space-y-1 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold text-gray-900">{currentOrder.address.name}</p>
              <p className="text-gray-600">{currentOrder.address.address}</p>
              <p className="text-gray-600">
                {currentOrder.address.city}, {currentOrder.address.state}{" "}
                {currentOrder.address.zip}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="text-sm space-y-2">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-900">{currentOrder.customerName}</p>
                <p className="text-gray-500">{currentOrder.email}</p>
              </div>
              {currentOrder.paymentCompletedAt && (
                <div className="pt-3 mt-3 border-t border-dashed border-gray-200">
                  <p className="text-sm text-gray-500">Payment Completed</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(currentOrder.paymentCompletedAt), "PPp")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
            )}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Cancel Order Confirmation</DialogTitle>
            </VisuallyHidden.Root>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border-4 border-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Request Order Cancellation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your cancellation request will be submitted to our team for
                  review.
                </p>

                {/* Cancellation Reason Input */}
                <div className="mt-4 text-left">
                  <label
                    htmlFor="cancellationReason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="e.g., Changed my mind, found a better deal..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                {currentOrder.paymentStatus === "paid" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-blue-900">
                          Refund Information
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          If approved, your payment of{" "}
                          <span className="font-bold">
                            <PriceFormatter amount={currentOrder.totalPrice} />
                          </span>{" "}
                          will be added to your wallet balance.
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                          <li>Use it for future orders</li>
                          <li>Request withdrawal anytime</li>
                          <li>View balance in your dashboard</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancellationReason("");
                }}
                disabled={isCancelling}
                className="flex-1 border-gray-300 hover:bg-gray-50 font-medium"
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 font-semibold shadow-lg hover:shadow-orange-200"
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
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
};

export default OrderDetailsPage;
