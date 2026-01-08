"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Trash2, Eye, Package, Plus } from "lucide-react";
import Link from "next/link";
import { OrdersSkeleton } from "./SkeletonLoaders";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import OrderDetailsSidebar from "./OrderDetailsSidebar";
import { Order } from "./types";
import { safeApiCall, handleApiError } from "./apiHelpers";

const AdminOrders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderStatus, setOrderStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    hasNextPage: false,
    totalPages: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const limit = perPage;

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  // Fetch orders
  const fetchOrders = useCallback(
    async (page = 0) => {
      setLoading(true);
      try {
        const statusParam = orderStatus === "all" ? "" : orderStatus;
        const timestamp = Date.now(); // Add timestamp to bust cache
        const url = `/api/admin/orders?limit=${limit}&offset=${page * limit
          }&status=${statusParam}&_t=${timestamp}`;

        const data = await safeApiCall(url);

        setOrders(data.orders);
        setPagination({
          totalCount: data.totalCount,
          hasNextPage: data.hasNextPage,
          totalPages: data.pagination.totalPages,
        });
      } catch (error) {
        console.error("Error in fetchOrders:", error);
        handleApiError(error, "Orders fetch");
      } finally {
        setLoading(false);
      }
    },
    [orderStatus, limit]
  );

  // Selection functions
  const toggleOrderSelection = useCallback((orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedOrders.length === orders.length && orders.length > 0) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order._id));
    }
  }, [selectedOrders.length, orders]);

  // Order details functions
  const handleShowOrderDetails = async (order: Order) => {
    setIsSidebarOpen(true);
    setIsLoadingOrderDetails(true);
    setSelectedOrder(null); // Clear previous order

    try {
      // Fetch complete order details from the individual order API
      const response = await fetch(`/api/admin/orders/${order._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setSelectedOrder(data.order);
    } catch (error) {
      console.error("Error fetching order details:", error);
      handleApiError(error, "Order details fetch");
      // Fall back to the basic order data from the list
      setSelectedOrder(order);
    } finally {
      setIsLoadingOrderDetails(false);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedOrder(null);
    setIsLoadingOrderDetails(false);
    // Fetch latest orders when sidebar closes to reflect any updates
    fetchOrders(currentPage);
  };

  const handleOrderUpdate = async (updatedOrderId?: string) => {
    setIsRefreshing(true);
    try {
      // Small delay to ensure Sanity has processed the update
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Refresh orders list from server to ensure consistency
      await fetchOrders(currentPage);

      // Also refresh the selected order details if sidebar is still open
      if (selectedOrder && isSidebarOpen && updatedOrderId) {
        try {
          const timestamp = Date.now();
          const updatedOrderData = await safeApiCall(
            `/api/admin/orders/${updatedOrderId}?_t=${timestamp}`
          );
          if (updatedOrderData?.order) {
            setSelectedOrder(updatedOrderData.order);
          }
        } catch (error) {
          console.error("Error refreshing order details:", error);
        }
      }
    } catch (error) {
      console.error("Error updating orders:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Pagination functions
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedOrders([]); // Clear selections when changing page
  };

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(parseInt(newPerPage));
    setCurrentPage(0); // Reset to first page
    setSelectedOrders([]);
  };

  // Delete functions
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOrders = async () => {
    setIsDeleting(true);
    try {
      const timestamp = Date.now();
      await safeApiCall(`/api/admin/orders?_t=${timestamp}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      // Close dialog and clear selections first
      setIsDeleteDialogOpen(false);
      setSelectedOrders([]);

      // Immediately update local state to remove deleted orders
      setOrders((prevOrders) =>
        prevOrders.filter((order) => !selectedOrders.includes(order._id))
      );

      // Update pagination count
      setPagination((prev) => ({
        ...prev,
        totalCount: Math.max(0, prev.totalCount - selectedOrders.length),
      }));

      // If all orders on current page were deleted, go back to page 0
      const willBeEmpty = selectedOrders.length === orders.length;
      const pageToFetch = willBeEmpty && currentPage > 0 ? 0 : currentPage;

      if (pageToFetch !== currentPage) {
        setCurrentPage(0);
      }

      // Wait a moment for Sanity to propagate changes
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Refresh the orders list to ensure consistency
      await fetchOrders(pageToFetch);
    } catch (error) {
      handleApiError(error, "Orders delete");
    } finally {
      setIsDeleting(false);
    }
  };

  // Manual refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchOrders(currentPage);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchOrders, currentPage]);

  // Effects - Combined to avoid multiple re-renders
  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  // Reset page when filters change - Combined effect
  useEffect(() => {
    setCurrentPage(0);
    setSelectedOrders([]);
  }, [orderStatus, perPage]);

  return (
    <>
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Orders Management</h3>
          <div className="flex items-center gap-2">
            <Link href="/admin/orders/create">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Create Order
              </Button>
            </Link>
            <div className="border-l h-6 mx-1"></div>
            <Select
              value={perPage.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="address_confirmed">
                  Address Confirmed
                </SelectItem>
                <SelectItem value="order_confirmed">Order Confirmed</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="ready_for_delivery">
                  Ready for Delivery
                </SelectItem>
                <SelectItem value="out_for_delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
                <SelectItem value="failed_delivery">Failed Delivery</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              size="sm"
              disabled={loading || isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading || isRefreshing ? "animate-spin" : ""
                  }`}
              />
            </Button>
          </div>
        </div>

        {loading ? (
          <OrdersSkeleton />
        ) : (
          <>
            {selectedOrders.length > 0 && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border">
                <span className="text-sm font-medium">
                  {selectedOrders.length} order
                  {selectedOrders.length > 1 ? "s" : ""} selected
                </span>
                <Button
                  onClick={openDeleteDialog}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )}

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedOrders.length === orders.length &&
                          orders.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-12 w-12 text-gray-400" />
                          <p className="text-lg font-medium text-gray-900">
                            No orders found
                          </p>
                          <p className="text-sm text-gray-500">
                            {orderStatus !== "all"
                              ? `No orders with status "${orderStatus}". Try selecting "All Status".`
                              : "There are no orders in the system yet."}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Total orders in database: {pagination.totalCount}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order._id)}
                            onCheckedChange={() =>
                              toggleOrderSelection(order._id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(order.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            {(order as any).cancellationRequested && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                ⏳ Cancellation Pending
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {order.paymentMethod}
                        </TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleShowOrderDetails(order)}
                              title="Show Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {orders.length} of {pagination.totalCount} orders
                {currentPage > 0 &&
                  ` (Page ${currentPage + 1} of ${pagination.totalPages})`}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteOrders}
        title="Delete Orders"
        description={`Are you sure you want to delete ${selectedOrders.length
          } order${selectedOrders.length > 1 ? "s" : ""
          }? This action cannot be undone.`}
        itemCount={selectedOrders.length}
        isLoading={isDeleting}
      />

      {/* Order Details Sidebar */}
      <OrderDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        order={selectedOrder}
        onOrderUpdate={handleOrderUpdate}
        isLoading={isLoadingOrderDetails}
      />
    </>
  );
};

export default AdminOrders;
