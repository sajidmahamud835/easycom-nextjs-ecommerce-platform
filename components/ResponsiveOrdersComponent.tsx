"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { CreditCard, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import DirectPaymentModal from "./DirectPaymentModal";

const ResponsiveOrdersComponent = ({
  orders,
}: {
  orders: MY_ORDERS_QUERYResult;
}) => {
  const [payingOrderId] = useState<string | null>(null);
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(
    null
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[0] | null
  >(null);

  // Helper function to render product images with stacked layout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderProductImages = (products: any[], isCard = false) => {
    if (!products || products.length === 0) return null;

    const maxVisible = isCard ? 2 : 3;
    const displayProducts = products.slice(0, maxVisible);
    const remainingCount = products.length - maxVisible;
    const imageSize = isCard ? "w-10 h-10" : "w-8 h-8";

    return (
      <div className="flex items-center">
        <div className="flex items-center">
          {displayProducts.map((item, index) => {
            const imageUrl = item.product?.images?.[0] || item.product?.image;
            return (
              <div
                key={index}
                className={`relative ${imageSize} rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 ${index > 0 ? "-ml-2" : ""
                  }`}
                style={{ zIndex: 30 - index * 10 }}
              >
                {imageUrl ? (
                  <Image
                    src={urlFor(imageUrl).url()}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">?</span>
                  </div>
                )}
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div
              className={`-ml-2 ${imageSize} rounded-full bg-gray-600 border-2 border-white shadow-sm flex items-center justify-center z-10`}
            >
              <span
                className={`${isCard ? "text-sm" : "text-xs"
                  } font-semibold text-white`}
              >
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePayNow = async (orderId: string) => {
    if (!orderId) return;

    // Find the order to get details for the modal
    const order = orders.find((o) => o._id === orderId);
    if (order) {
      setSelectedOrder(order);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  const handleGenerateInvoice = async (orderId: string) => {
    if (!orderId) return;

    setGeneratingInvoiceId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Invoice generated successfully!");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to generate invoice");
      }
    } catch (error) {
      console.error("Invoice generation error:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  const isOrderPayable = (order: MY_ORDERS_QUERYResult[number]) => {
    const isPaid = order.paymentStatus === PAYMENT_STATUSES.PAID;
    const isCancelled = order.status === ORDER_STATUSES.CANCELLED;
    return !isPaid && !isCancelled;
  };

  const getStatusBadgeVariant = (order: MY_ORDERS_QUERYResult[number]) => {
    if (
      order.paymentStatus === "paid" ||
      order.status === "completed" ||
      order.status === "delivered"
    ) {
      return "bg-emerald-100 text-emerald-700";
    } else if (order.status === "cancelled") {
      return "bg-red-100 text-red-700";
    } else if (order.status === "processing" || order.status === "shipped") {
      return "bg-blue-100 text-blue-700";
    } else {
      return "bg-amber-100 text-amber-700";
    }
  };

  const renderInvoiceSection = (order: MY_ORDERS_QUERYResult[number]) => {
    if (order?.invoice?.hosted_invoice_url) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 truncate">
            {order?.invoice?.number || "INV-" + order.orderNumber?.slice(-6)}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => {
              window.open(order.invoice?.hosted_invoice_url, "_blank");
            }}
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      );
    } else if (order?.paymentStatus === "paid") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-2 text-xs"
          disabled={generatingInvoiceId === order._id}
          onClick={() => handleGenerateInvoice(order._id)}
        >
          {generatingInvoiceId === order._id ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
              Gen...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      );
    } else {
      return <span className="text-xs text-gray-400">----</span>;
    }
  };

  // Mobile Card View Component
  const OrderCard = ({ order }: { order: MY_ORDERS_QUERYResult[0] }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-base">
            #{order.orderNumber?.slice(-8) ?? "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {order?.orderDate &&
              format(new Date(order.orderDate), "MMM dd, yyyy")}
          </div>
        </div>
        <Badge
          className={`${getStatusBadgeVariant(
            order
          )} text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ml-2`}
        >
          {order?.status
            ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
            : "Pending"}
        </Badge>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-2 text-sm mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <span className="text-emerald-600 font-bold text-sm">
            {order.customerName?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{order.customerName}</div>
          <div className="text-gray-500 text-xs truncate">{order.email}</div>
        </div>
      </div>

      {/* Products & Total */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Products:</span>
          {renderProductImages(order.products || [], true)}
        </div>
        <div className="text-lg font-bold text-emerald-600">
          <PriceFormatter amount={order?.totalPrice} className="text-emerald-600" />
        </div>
      </div>

      {/* Invoice & Actions */}
      <div className="pt-4 border-t border-dashed border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-500">Invoice:</span>
          {renderInvoiceSection(order)}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 sm:flex-none h-10 rounded-xl border-gray-200 hover:bg-gray-50"
          >
            <Link
              href={`/user/orders/${order._id}`}
              className="flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span>View Details</span>
            </Link>
          </Button>
          {isOrderPayable(order) && (
            <Button
              onClick={() => handlePayNow(order._id)}
              disabled={payingOrderId === order._id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none h-10 rounded-xl shadow-sm"
            >
              {payingOrderId === order._id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2 shrink-0" />
                  <span>Pay Now</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Payment Modal */}
      {selectedOrder && selectedOrder._id && selectedOrder.orderNumber && (
        <DirectPaymentModal
          isOpen={paymentModalOpen}
          onClose={handlePaymentModalClose}
          orderId={selectedOrder._id}
          orderTotal={selectedOrder.totalPrice || 0}
          orderNumber={selectedOrder.orderNumber}
        />
      )}

      {/* Mobile Card View - Hidden on large screens */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Order #
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Date
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Customer
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Email
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Products
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Total
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Invoice
                </th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-emerald-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900 text-sm">
                      #{order.orderNumber?.slice(-8) ?? "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {order?.orderDate &&
                      format(new Date(order.orderDate), "MMM dd, yyyy")}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-sm text-gray-900">
                      {order.customerName}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div className="truncate max-w-40">{order.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    {renderProductImages(order.products || [])}
                  </td>
                  <td className="py-4 px-4">
                    <PriceFormatter
                      amount={order?.totalPrice}
                      className="font-bold text-emerald-600 text-sm"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`${getStatusBadgeVariant(
                        order
                      )} text-xs font-semibold px-3 py-1.5 rounded-full`}
                    >
                      {order?.status
                        ? order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                        : "Pending"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">{renderInvoiceSection(order)}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-start gap-1 xl:gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="min-w-[70px] xl:min-w-20"
                      >
                        <Link
                          href={`/user/orders/${order._id}`}
                          className="flex items-center justify-center"
                        >
                          <Eye className="w-3 h-3 xl:mr-1" />
                          <span className="hidden xl:inline ml-1">View</span>
                        </Link>
                      </Button>
                      {isOrderPayable(order) && (
                        <Button
                          onClick={() => handlePayNow(order._id)}
                          disabled={payingOrderId === order._id}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-20 xl:min-w-[100px] touch-manipulation"
                        >
                          {payingOrderId === order._id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 xl:mr-1"></div>
                              <span className="hidden xl:inline ml-1 text-xs">
                                Paying...
                              </span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3 xl:mr-1 shrink-0" />
                              <span className="hidden xl:inline ml-1 text-xs font-medium">
                                Pay Now
                              </span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveOrdersComponent;
