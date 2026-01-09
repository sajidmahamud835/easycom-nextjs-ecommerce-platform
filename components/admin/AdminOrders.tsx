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
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Trash2, Eye, Package, Plus, LayoutGrid, List, Download, Printer } from "lucide-react";
import { OrdersSkeleton } from "./SkeletonLoaders";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import OrderDetailsSidebar from "./OrderDetailsSidebar";
import { Order } from "./types";
import { safeApiCall, handleApiError } from "./apiHelpers";
import OrderStats from "./orders/OrderStats";
import OrderFilterBar from "./orders/OrderFilterBar";
import OrderCard from "./orders/OrderCard";
import Link from "next/link";

const AdminOrders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
  const [perPage, setPerPage] = useState("20");
  const [pagination, setPagination] = useState({
    totalCount: 0,
    hasNextPage: false,
    totalPages: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const limit = parseInt(perPage);

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
    async (page: number) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          limit: perPage,
          offset: (page * parseInt(perPage)).toString(),
          status: orderStatus === "all" ? "" : orderStatus,
          startDate,
          endDate,
        });

        const response = await fetch(`/api/admin/orders?${queryParams}`);
        const data = await response.json();

        if (response.ok) {
          if (searchQuery) {
            const filtered = data.orders.filter((order: Order) =>
              order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setOrders(filtered);
            setPagination({ ...data.pagination, totalCount: filtered.length });
          } else {
            setOrders(data.orders);
            setPagination(data.pagination);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    },
    [perPage, orderStatus, startDate, endDate, searchQuery]
  );

  // Fetch orders when dependencies change
  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  // Reset page when filters change
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
    setSelectedOrders([]);
  }, [orderStatus, perPage, debouncedSearch, startDate, endDate]);



  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleExportCSV = () => {
    const ordersToExport = orders.filter(o => selectedOrders.includes(o._id));
    if (ordersToExport.length === 0) return;

    const headers = ["Order Number", "Date", "Customer", "Email", "Status", "Total", "Payment Method"];
    const csvContent = [
      headers.join(","),
      ...ordersToExport.map(order => [
        order.orderNumber,
        new Date(order.orderDate).toLocaleDateString(),
        `"${order.customerName}"`,
        order.email,
        order.status,
        order.totalPrice,
        order.paymentMethod
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

      setIsDeleteDialogOpen(false);
      setSelectedOrders([]);

      const newTotal = Math.max(0, pagination.totalCount - selectedOrders.length);
      const newTotalPages = Math.ceil(newTotal / limit);

      // If we deleted everything on the current page, go back one page if possible
      if (currentPage >= newTotalPages && currentPage > 0) {
        setCurrentPage(Math.max(0, currentPage - 1));
      } else {
        // Just refresh current page
        await fetchOrders(currentPage);
      }

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
      setDebouncedSearch(""); // optional: clear search on hard refresh
      setSearchQuery("");
      await fetchOrders(0);
      setCurrentPage(0);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchOrders]);


  return (
    <>
      <div className="space-y-6 p-6 bg-gray-50/50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-500">View and manage all customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border rounded-lg p-1 flex items-center shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-1" /> List
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4 mr-1" /> Grid
              </Button>
            </div>
            <Link href="/admin/orders/create">
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Create Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <OrderStats />

        {/* Filter Bar */}
        <OrderFilterBar
          status={orderStatus}
          onStatusChange={setOrderStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          perPage={perPage}
          onPerPageChange={setPerPage}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onReset={() => {
            setOrderStatus("all");
            setSearchQuery("");
            setPerPage("20");
            setStartDate("");
            setEndDate("");
          }}
        />

        {/* Main Content */}
        <div className="space-y-4">
          {/* Selection Toolbar */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2">
              <span className="text-sm font-medium text-blue-900 px-2">
                {selectedOrders.length} order{selectedOrders.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                  className="gap-2 shadow-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-700 hover:text-blue-800"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shadow-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-700 hover:text-blue-800"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  onClick={openDeleteDialog}
                  variant="destructive"
                  size="sm"
                  className="gap-2 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <OrdersSkeleton />
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
              <p className="text-gray-500 max-w-sm mt-1 mb-6">
                {orderStatus !== "all" || searchQuery
                  ? "No orders match your current filters. Try resetting them."
                  : "There are no orders in the system yet."}
              </p>
              {(orderStatus !== "all" || searchQuery) && (
                <Button variant="outline" onClick={() => { setOrderStatus("all"); setSearchQuery(""); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : viewMode === "list" ? (
            <Card className="rounded-xl overflow-hidden shadow-sm border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-12 py-4">
                      <Checkbox
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700">Order #</TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700">Customer</TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700">Amount</TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700">Payment</TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="text-right py-4 font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order._id)}
                          onCheckedChange={() => toggleOrderSelection(order._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{order.customerName}</span>
                          <span className="text-xs text-gray-500">{order.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} border-0 font-normal`}>
                            {order.status.replace(/_/g, " ")}
                          </Badge>
                          {(order as any).cancellationRequested && (
                            <Badge className="bg-red-50 text-red-600 border-red-100 text-[10px] px-1.5 py-0.5 animate-pulse">
                              Cancellation
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-gray-600 text-sm">
                        {order.paymentMethod.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{formatDate(order.orderDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShowOrderDetails(order)}
                          className="hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <Eye className="h-4 w-4" /> <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  selected={selectedOrders.includes(order._id)}
                  onSelect={toggleOrderSelection}
                  onViewDetails={handleShowOrderDetails}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{orders.length}</span> of <span className="font-medium text-gray-900">{pagination.totalCount}</span> orders
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  Previous
                </Button>
                <div className="flex items-center justify-center px-4 text-sm font-medium">
                  Page {currentPage + 1}
                </div>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs & Sidebar */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteOrders}
        title="Delete Orders"
        description={`Are you sure you want to delete ${selectedOrders.length} order${selectedOrders.length > 1 ? "s" : ""}?`}
        itemCount={selectedOrders.length}
        isLoading={isDeleting}
      />

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
