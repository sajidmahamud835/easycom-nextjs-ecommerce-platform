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
        className="w-[60vw] max-w-3xl md:max-w-4xl xl:max-w-5xl overflow-y-auto px-6 py-8"
        onInteractOutside={handleInteractOutside}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {order
              ? `Order Details - #${order.orderNumber}`
              : "Loading Order Details..."}
          </SheetTitle>
          <SheetDescription>
            {order
              ? "View and manage order information, status, and tracking details."
              : "Loading order information..."}
          </SheetDescription>
        </SheetHeader>

        {isLoading || !order ? (
          <OrderDetailsSkeleton />
        ) : (
          <div className="space-y-8 mt-8">
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
            <Card className="p-4 md:p-6 lg:p-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
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
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) =>
                        handleInputChange("paymentStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="cash_on_delivery">
                          Cash on Delivery
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">{order.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{order.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalPrice">Total Amount</Label>
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
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Original: {formatCurrency(order.totalPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Payment Method
                    </Label>
                    <p className="text-sm capitalize">
                      {order.paymentMethod || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Currency</Label>
                    <p className="text-sm">{order.currency || "USD"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Subtotal</Label>
                    <p className="text-sm font-medium">
                      {formatCurrency(order.subtotal || 0)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Tax</Label>
                    <p className="text-sm">{formatCurrency(order.tax || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Shipping</Label>
                    <p className="text-sm">
                      {formatCurrency(order.shipping || 0)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Discount</Label>
                    <p className="text-sm text-green-600">
                      -{formatCurrency(order.amountDiscount || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Items Total</Label>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        order.products?.reduce(
                          (sum, item) =>
                            sum +
                            (item.product?.price || 0) * (item.quantity || 1),
                          0
                        ) || 0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Shipping & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employee Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Address Confirmed By
                    </Label>
                    <p className="text-sm">
                      {order.addressConfirmedBy || "Not confirmed"}
                    </p>
                    {order.addressConfirmedAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(order.addressConfirmedAt)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Order Confirmed By
                    </Label>
                    <p className="text-sm">
                      {order.orderConfirmedBy || "Not confirmed"}
                    </p>
                    {order.orderConfirmedAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(order.orderConfirmedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Packed By</Label>
                    <p className="text-sm">{order.packedBy || "Not packed"}</p>
                    {order.packedAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(order.packedAt)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Dispatched By</Label>
                    <p className="text-sm">
                      {order.dispatchedBy || "Not dispatched"}
                    </p>
                    {order.dispatchedAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(order.dispatchedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Warehouse Assigned By
                    </Label>
                    <p className="text-sm">
                      {order.assignedWarehouseBy || "Not assigned"}
                    </p>
                    {order.assignedWarehouseAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(order.assignedWarehouseAt)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Delivered By</Label>
                    <p className="text-sm">
                      {order.deliveredBy || "Not delivered"}
                    </p>
                    {order.deliveredAt && (
                      <p className="text-xs text-gray-500">
                        {formatDate(order.deliveredAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Assigned Deliveryman
                  </Label>
                  <p className="text-sm">
                    {order.assignedDeliverymanName || "Not assigned"}
                  </p>
                  {order.assignedDeliverymanId && (
                    <p className="text-xs text-gray-500">
                      ID: {order.assignedDeliverymanId}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Packing & Delivery Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Packing & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cash Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditingProducts(!isEditingProducts);
                  }}
                >
                  {isEditingProducts ? "Done Editing" : "Edit Items"}
                </Button>
              </CardHeader>
              <CardContent>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderAttachments
                  orderId={order._id}
                  attachments={order.attachments as any}
                  onUpdate={() => onOrderUpdate(order._id)}
                />
              </CardContent>
            </Card>

            {/* Order Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p className="text-sm">{formatDate(order.orderDate)}</p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <Label className="text-sm font-medium">
                      Estimated Delivery
                    </Label>
                    <p className="text-sm">
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                )}
                {order.actualDelivery && (
                  <div>
                    <Label className="text-sm font-medium">
                      Actual Delivery
                    </Label>
                    <p className="text-sm">
                      {formatDate(order.actualDelivery)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add notes about this order..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 pb-4 px-2">
              <Button
                onClick={handleUpdateOrder}
                disabled={isUpdating}
                className="flex-1 h-12 text-base font-medium"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {isUpdating ? "Updating..." : "Update Order"}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="h-12 px-8 text-base font-medium"
                size="lg"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSidebar;
