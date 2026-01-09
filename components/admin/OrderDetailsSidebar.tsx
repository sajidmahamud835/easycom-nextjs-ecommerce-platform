"use client";

import { updateOrder } from "@/actions/admin/edit-order";
import ProductPicker, { SelectedProduct } from "./orders/ProductPicker";
import OrderAttachments from "./orders/OrderAttachments";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  User,
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  Save,
  X,
  Paperclip,
} from "lucide-react";
import { Order } from "./types";
import { showToast } from "@/lib/toast";
import { trackOrderFullfillment, trackOrderDetails } from "@/lib/analytics";
import { OrderDetailsSkeleton } from "./SkeletonLoaders";

interface OrderDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderUpdate: (updatedOrderId?: string) => void;
  isLoading?: boolean;
}

const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  isOpen,
  onClose,
  order,
  onOrderUpdate,
  isLoading = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProducts, setIsEditingProducts] = useState(false);
  const [formData, setFormData] = useState({
    status: order?.status || "",
    totalPrice: order?.totalPrice || 0,
    paymentStatus: order?.paymentStatus || "",
    trackingNumber: order?.trackingNumber || "",
    notes: order?.notes || "",
    estimatedDelivery: order?.estimatedDelivery || "",
    packingNotes: order?.packingNotes || "",
    deliveryNotes: order?.deliveryNotes || "",
    deliveryAttempts: order?.deliveryAttempts || 0,
    rescheduledDate: order?.rescheduledDate || "",
    rescheduledReason: order?.rescheduledReason || "",
    cashCollectedAmount: order?.cashCollectedAmount || 0,
    // Address fields
    shippingAddress: {
      name: order?.address?.name || "",
      address: order?.address?.address || "",
      city: order?.address?.city || "",
      state: order?.address?.state || "",
      zip: order?.address?.zip || "",
    },
    // Product fields
    products: (order?.products || []).map(p => ({
      _id: p.product?._id || "",
      name: p.product?.name || "Unknown",
      price: p.product?.price || 0,
      quantity: p.quantity || 1,
      stock: 999, // default if not available
      image: p.product?.image || ""
    })) as SelectedProduct[]
  });

  React.useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "",
        totalPrice: order.totalPrice || 0,
        paymentStatus: order.paymentStatus || "",
        trackingNumber: order.trackingNumber || "",
        notes: order.notes || "",
        estimatedDelivery: order.estimatedDelivery || "",
        packingNotes: order.packingNotes || "",
        deliveryNotes: order.deliveryNotes || "",
        deliveryAttempts: order.deliveryAttempts || 0,
        rescheduledDate: order.rescheduledDate || "",
        rescheduledReason: order.rescheduledReason || "",
        cashCollectedAmount: order.cashCollectedAmount || 0,
        shippingAddress: {
          name: order.address?.name || "",
          address: order.address?.address || "",
          city: order.address?.city || "",
          state: order.address?.state || "",
          zip: order.address?.zip || "",
        },
        products: (order.products || []).map(p => ({
          _id: p.product?._id || "",
          name: p.product?.name || "Unknown",
          price: p.product?.price || 0,
          quantity: p.quantity || 1,
          stock: 999,
          image: p.product?.image || ""
        })) as SelectedProduct[]
      });
    }
  }, [order]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "ready_for_delivery":
        return "bg-cyan-100 text-cyan-800";
      case "packed":
        return "bg-purple-100 text-purple-800";
      case "order_confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "address_confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "failed_delivery":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



  const handleUpdateOrder = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      // Use server action logic
      const result = await updateOrder(order._id, {
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        totalPrice: formData.totalPrice,
        trackingNumber: formData.trackingNumber,
        notes: formData.notes,
        estimatedDelivery: formData.estimatedDelivery,
        packingNotes: formData.packingNotes,
        deliveryNotes: formData.deliveryNotes,
        deliveryAttempts: formData.deliveryAttempts,
        rescheduledDate: formData.rescheduledDate,
        rescheduledReason: formData.rescheduledReason,
        cashCollectedAmount: formData.cashCollectedAmount,
        address: formData.shippingAddress,
        products: formData.products.map(p => ({
          _key: p._id,
          product: { _type: "reference", _ref: p._id },
          quantity: p.quantity,
          price: p.price
        }))
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Track order fulfillment analytics
      if (formData.status !== order.status) {
        trackOrderFullfillment({
          orderId: order._id,
          status: formData.status,
          previousStatus: order.status,
          value: formData.totalPrice,
          userId: order.clerkUserId || "",
        });
      }

      // Track detailed order information
      trackOrderDetails({
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: formData.status,
        value: formData.totalPrice,
        itemCount: order.products?.length || 0,
        paymentMethod: order.paymentMethod,
        userId: order.clerkUserId || "",
        products:
          order.products?.map((p) => ({
            productId: p.product?._id || "",
            name: p.product?.name || "Unknown Product",
            quantity: p.quantity,
            price: p.product?.price || 0,
          })) || [],
      });

      showToast.success("Order updated successfully");

      // Refresh the orders list immediately to get the latest data
      await onOrderUpdate(order._id);

      // Stop editing address
      setIsEditingAddress(false);

      // Close the sidebar immediately after refresh
      onClose();
    } catch (error: any) {
      console.error("Error updating order:", error);
      showToast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInteractOutside = (e: Event) => {
    if (isUpdating) {
      e.preventDefault();
      showToast.warning(
        "Action in Progress",
        "Please wait for the current action to complete before closing."
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-[60vw] max-w-3xl md:max-w-4xl xl:max-w-5xl overflow-y-auto p-0 border-l-0"
        onInteractOutside={handleInteractOutside}
      >
        {/* Compact Gradient Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-4">
          <SheetHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold text-white">
                    {order ? `Order #${order.orderNumber}` : "Loading..."}
                  </SheetTitle>
                  <SheetDescription className="text-white/70 text-sm">
                    {order ? "Manage order details" : "Loading..."}
                  </SheetDescription>
                </div>
              </div>
              {order && (
                <div className={`
                  px-3 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wide
                  ${order.status === 'completed' || order.status === 'delivered'
                    ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/30'
                    : order.status === 'cancelled'
                      ? 'bg-red-500/30 text-red-100 border border-red-400/30'
                      : order.status === 'pending'
                        ? 'bg-amber-500/30 text-amber-100 border border-amber-400/30'
                        : 'bg-white/20 text-white border border-white/30'
                  }
                `}>
                  {order.status.replace(/_/g, " ")}
                </div>
              )}
            </div>

            {/* Quick Stats - More Compact */}
            {order && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-white/90 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(order.totalPrice || 0)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(order.orderDate).split(',')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{order.customerName}</span>
                </div>
              </div>
            )}
          </SheetHeader>
        </div>

        {/* Content Area */}
        <div className="px-6 py-4 bg-gray-50/50 min-h-screen">
          {isLoading || !order ? (
            <OrderDetailsSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Cancellation Request Alert */}
              {order.cancellationRequested && (
                <Card className="border-orange-300 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <X className="w-5 h-5" />
                      Cancellation Request Pending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-orange-700 mb-2">
                        <strong>Requested At:</strong>{" "}
                        {formatDate(order.cancellationRequestedAt || "")}
                      </p>
                      <p className="text-sm text-orange-700 mb-4">
                        <strong>Reason:</strong>{" "}
                        {order.cancellationRequestReason || "No reason provided"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={async () => {
                          setIsUpdating(true);
                          try {
                            const { rejectCancellationRequest } = await import(
                              "@/actions/orderCancellationActions"
                            );
                            const result = await rejectCancellationRequest(
                              order._id
                            );

                            if (result.success) {
                              showToast.success(result.message);
                              // Wait for order update to complete before closing
                              await onOrderUpdate(order._id);
                              // Small delay to ensure the UI has updated
                              await new Promise((resolve) =>
                                setTimeout(resolve, 300)
                              );
                              onClose();
                            } else {
                              showToast.error(result.message);
                            }
                          } catch (error) {
                            console.error("Error rejecting cancellation:", error);
                            showToast.error(
                              "Failed to reject cancellation request"
                            );
                          } finally {
                            setIsUpdating(false);
                          }
                        }}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUpdating ? "Processing..." : "✓ Confirm Order"}
                      </Button>
                      <Button
                        onClick={async () => {
                          setIsUpdating(true);
                          try {
                            const { approveCancellationRequest } = await import(
                              "@/actions/orderCancellationActions"
                            );
                            const result = await approveCancellationRequest(
                              order._id
                            );

                            if (result.success) {
                              showToast.success(result.message);
                              // Wait for order update to complete before closing
                              await onOrderUpdate(order._id);
                              // Small delay to ensure the UI has updated
                              await new Promise((resolve) =>
                                setTimeout(resolve, 300)
                              );
                              onClose();
                            } else {
                              showToast.error(result.message);
                            }
                          } catch (error) {
                            console.error("Error approving cancellation:", error);
                            showToast.error(
                              "Failed to approve cancellation request"
                            );
                          } finally {
                            setIsUpdating(false);
                          }
                        }}
                        disabled={isUpdating}
                        variant="destructive"
                      >
                        {isUpdating ? "Processing..." : "✗ Approve Cancellation"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Debug Information - Remove this after testing */}
              {process.env.NODE_ENV === "development" && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-yellow-800">
                      Debug Info (Dev Only)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-yellow-700 font-medium mb-2">
                        Raw Order Data (Click to expand)
                      </summary>
                      <pre className="bg-white p-2 rounded border overflow-auto max-h-40 text-xs">
                        {JSON.stringify(
                          {
                            totalPrice: order.totalPrice,
                            products: order.products?.map((p) => ({
                              quantity: p.quantity,
                              product: p.product,
                            })),
                          },
                          null,
                          2
                        )}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              )}

              {/* Order Status and Actions */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">Order Status</span>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} px-4 py-1.5 rounded-lg font-semibold`}>
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Order Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="pending">🔴 Pending</SelectItem>
                          <SelectItem value="address_confirmed">
                            🟡 Address Confirmed
                          </SelectItem>
                          <SelectItem value="order_confirmed">
                            🟢 Order Confirmed
                          </SelectItem>
                          <SelectItem value="packed">📦 Packed</SelectItem>
                          <SelectItem value="ready_for_delivery">
                            ✅ Ready for Delivery
                          </SelectItem>
                          <SelectItem value="out_for_delivery">
                            🚚 Out for Delivery
                          </SelectItem>
                          <SelectItem value="delivered">📬 Delivered</SelectItem>
                          <SelectItem value="completed">✔️ Completed</SelectItem>
                          <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                          <SelectItem value="rescheduled">
                            📅 Rescheduled
                          </SelectItem>
                          <SelectItem value="failed_delivery">
                            ⚠️ Failed Delivery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus" className="text-sm font-semibold text-gray-700">Payment Status</Label>
                      <Select
                        value={formData.paymentStatus}
                        onValueChange={(value) =>
                          handleInputChange("paymentStatus", value)
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="pending">⏳ Pending</SelectItem>
                          <SelectItem value="paid">✅ Paid</SelectItem>
                          <SelectItem value="failed">❌ Failed</SelectItem>
                          <SelectItem value="refunded">💸 Refunded</SelectItem>
                          <SelectItem value="stripe">💳 Stripe</SelectItem>
                          <SelectItem value="cash_on_delivery">
                            💵 Cash on Delivery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/25">
                      {order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{order.customerName}</h4>
                      <p className="text-gray-500">{order.email}</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Financial Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Total Amount Highlight */}
                  <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm mb-1">Total Amount</p>
                        <p className="text-3xl font-bold">{formatCurrency(order.totalPrice || 0)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-100 text-sm mb-1">Payment</p>
                        <p className="font-semibold capitalize">{order.paymentMethod || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-700">{formatCurrency(order.tax || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-700">{formatCurrency(order.shipping || 0)}</span>
                    </div>
                    {order.amountDiscount > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold text-emerald-600">-{formatCurrency(order.amountDiscount || 0)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Items Total ({order.products?.length || 0} items)</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(
                          order.products?.reduce(
                            (sum, item) =>
                              sum +
                              (item.product?.price || 0) * (item.quantity || 1),
                            0
                          ) || 0
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Edit Total */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <Label htmlFor="totalPrice" className="text-sm font-semibold text-gray-700">Edit Total Amount</Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      step="0.01"
                      value={formData.totalPrice}
                      onChange={(e) =>
                        handleInputChange(
                          "totalPrice",
                          parseFloat(e.target.value)
                        )
                      }
                      className="h-12 rounded-xl border-gray-200 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500">
                      Original: {formatCurrency(order.totalPrice || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/25">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Shipping & Delivery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={(e) =>
                        handleInputChange("trackingNumber", e.target.value)
                      }
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                    <Input
                      id="estimatedDelivery"
                      type="datetime-local"
                      value={formData.estimatedDelivery}
                      onChange={(e) =>
                        handleInputChange("estimatedDelivery", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Shipping Address</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-blue-600 hover:text-blue-800 px-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsEditingAddress(!isEditingAddress);
                        }}
                      >
                        {isEditingAddress ? "Cancel" : "Edit"}
                      </Button>
                    </div>

                    {isEditingAddress ? (
                      <div className="space-y-2 border p-3 rounded-md bg-white">
                        <Input
                          placeholder="Full Name"
                          value={formData.shippingAddress?.name || ""}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, name: e.target.value }
                            }))
                          }
                        />
                        <Input
                          placeholder="Street Address"
                          value={formData.shippingAddress?.address || ""}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, address: e.target.value }
                            }))
                          }
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="City"
                            value={formData.shippingAddress?.city || ""}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                              }))
                            }
                          />
                          <Input
                            placeholder="State"
                            value={formData.shippingAddress?.state || ""}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                              }))
                            }
                          />
                        </div>
                        <Input
                          placeholder="ZIP Code"
                          value={formData.shippingAddress?.zip || ""}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, zip: e.target.value }
                            }))
                          }
                        />
                      </div>
                    ) : (
                      <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
                        {formData.shippingAddress?.name ? (
                          <>
                            <p className="font-medium text-gray-900">{formData.shippingAddress.name}</p>
                            <p className="text-gray-600">{formData.shippingAddress.address}</p>
                            <p className="text-gray-600">
                              {formData.shippingAddress.city}, {formData.shippingAddress.state}{" "}
                              {formData.shippingAddress.zip}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-400 italic">No address provided</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Employee Tracking */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-cyan-50 to-sky-50 border-b border-cyan-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl shadow-lg shadow-cyan-500/25">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Employee Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Address Confirmed", by: order.addressConfirmedBy, at: order.addressConfirmedAt },
                      { label: "Order Confirmed", by: order.orderConfirmedBy, at: order.orderConfirmedAt },
                      { label: "Packed", by: order.packedBy, at: order.packedAt },
                      { label: "Dispatched", by: order.dispatchedBy, at: order.dispatchedAt },
                      { label: "Warehouse Assigned", by: order.assignedWarehouseBy, at: order.assignedWarehouseAt },
                      { label: "Delivered", by: order.deliveredBy, at: order.deliveredAt },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">{item.by || "—"}</p>
                        {item.at && <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.at)}</p>}
                      </div>
                    ))}
                  </div>
                  {order.assignedDeliverymanName && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl border border-cyan-100">
                      <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Assigned Deliveryman</p>
                      <p className="text-lg font-bold text-gray-900">{order.assignedDeliverymanName}</p>
                      {order.assignedDeliverymanId && <p className="text-xs text-gray-500">ID: {order.assignedDeliverymanId}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Packing & Delivery Notes */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/25">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Packing & Delivery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="packingNotes">Packing Notes</Label>
                    <Textarea
                      id="packingNotes"
                      value={formData.packingNotes}
                      onChange={(e) =>
                        handleInputChange("packingNotes", e.target.value)
                      }
                      placeholder="Enter packing notes"
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                    <Textarea
                      id="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={(e) =>
                        handleInputChange("deliveryNotes", e.target.value)
                      }
                      placeholder="Enter delivery notes"
                      className="min-h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryAttempts">Delivery Attempts</Label>
                      <Input
                        id="deliveryAttempts"
                        type="number"
                        min="0"
                        value={formData.deliveryAttempts}
                        onChange={(e) =>
                          handleInputChange(
                            "deliveryAttempts",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="rescheduledDate">Rescheduled Date</Label>
                      <Input
                        id="rescheduledDate"
                        type="date"
                        value={formData.rescheduledDate}
                        onChange={(e) =>
                          handleInputChange("rescheduledDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rescheduledReason">Reschedule Reason</Label>
                    <Textarea
                      id="rescheduledReason"
                      value={formData.rescheduledReason}
                      onChange={(e) =>
                        handleInputChange("rescheduledReason", e.target.value)
                      }
                      placeholder="Enter reason for rescheduling"
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cash Collection */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-lime-50 to-green-50 border-b border-lime-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl shadow-lg shadow-lime-500/25">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Cash Collection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Cash Collected
                      </Label>
                      <p className="text-sm font-semibold">
                        {order.cashCollected ? "✅ Yes" : "❌ No"}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="cashCollectedAmount">Cash Amount</Label>
                      <Input
                        id="cashCollectedAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cashCollectedAmount}
                        onChange={(e) =>
                          handleInputChange(
                            "cashCollectedAmount",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Collected At</Label>
                      <p className="text-sm">
                        {order.cashCollectedAt
                          ? formatDate(order.cashCollectedAt)
                          : "Not collected"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Payment Received By
                      </Label>
                      <p className="text-sm">
                        {order.paymentReceivedBy || "Not received"}
                      </p>
                      {order.paymentReceivedAt && (
                        <p className="text-xs text-gray-500">
                          {formatDate(order.paymentReceivedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-rose-50 to-red-50 border-b border-rose-100 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-lg shadow-rose-500/25">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Order Items</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm font-medium rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditingProducts(!isEditingProducts);
                    }}
                  >
                    {isEditingProducts ? "✓ Done" : "Edit Items"}
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {isEditingProducts ? (
                    <ProductPicker
                      selectedProducts={formData.products}
                      onProductsChange={(products) => {
                        setFormData(prev => ({
                          ...prev,
                          products,
                          totalPrice: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
                        }));
                      }}
                    />
                  ) : (
                    <div className="space-y-3">
                      {formData.products?.map((item, index) => {
                        const lineTotal = (item.price || 0) * (item.quantity || 0);

                        return (
                          <div
                            key={item._id || index}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border shadow-sm"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate mb-1">
                                {item.name || "Unknown Product"}
                              </p>
                              <div className="text-sm text-gray-600">
                                <p>
                                  Qty: {item.quantity} × {formatCurrency(item.price || 0)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg text-gray-900">
                                {formatCurrency(lineTotal)}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <div className="border-t border-gray-200 pt-4 mt-4 bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-lg text-gray-700">
                            Order Total:
                          </p>
                          <p className="font-bold text-2xl text-green-600">
                            {formatCurrency(formData.totalPrice || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg shadow-slate-500/25">
                      <Paperclip className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Attachments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <OrderAttachments
                    orderId={order._id}
                    attachments={order.attachments as any}
                    onUpdate={() => onOrderUpdate(order._id)}
                  />
                </CardContent>
              </Card>

              {/* Order Dates */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg shadow-amber-500/25">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Important Dates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[140px] p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Order Date</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">{formatDate(order.orderDate)}</p>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex-1 min-w-[140px] p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Est. Delivery</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{formatDate(order.estimatedDelivery)}</p>
                      </div>
                    )}
                    {order.actualDelivery && (
                      <div className="flex-1 min-w-[140px] p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Actual Delivery</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{formatDate(order.actualDelivery)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-stone-50 to-neutral-50 border-b border-stone-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-stone-500 to-neutral-600 rounded-xl shadow-lg shadow-stone-500/25">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900">Order Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add notes about this order..."
                    rows={4}
                    className="rounded-xl border-gray-200 focus:border-stone-400 focus:ring-stone-400/20 resize-none"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons - Compact */}
              <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-4 -mx-2 px-2">
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdateOrder}
                    disabled={isUpdating}
                    className="flex-1 h-10 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 shadow-lg shadow-purple-500/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="h-10 px-6 text-sm font-medium rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSidebar;
