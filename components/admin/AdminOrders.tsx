"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  RefreshCw,
  List,
  LayoutGrid,
  Download,
  Package,
  Eye,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderDetailsSidebar from "./OrderDetailsSidebar";
import { Order } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import OrderCard from "./orders/OrderCard";
import OrderStats from "./orders/OrderStats";
import OrderFilterBar from "./orders/OrderFilterBar";
import { Skeleton } from "@/components/ui/skeleton";

interface Pagination {
  limit: number;
  offset: number;
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function AdminOrders() {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    limit: 10,
    offset: 0,
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState("10");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Status color and gradient mapping
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700", gradient: "from-amber-500 to-orange-500" };
      case "processing":
      case "order_confirmed":
      case "packed":
        return { bg: "bg-blue-100", text: "text-blue-700", gradient: "from-blue-500 to-indigo-500" };
      case "shipped":
      case "ready_for_delivery":
      case "out_for_delivery":
        return { bg: "bg-violet-100", text: "text-violet-700", gradient: "from-violet-500 to-purple-500" };
      case "delivered":
      case "completed":
        return { bg: "bg-emerald-100", text: "text-emerald-700", gradient: "from-emerald-500 to-teal-500" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", gradient: "from-red-500 to-rose-500" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", gradient: "from-gray-400 to-gray-500" };
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
      setSelectedOrders(orders.map((o) => o._id));
    }
  }, [orders, selectedOrders.length]);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/80">Order Management</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              Orders Dashboard
            </h1>
            <p className="text-white/70 text-lg">
              Track, manage, and fulfill your store orders seamlessly
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm rounded-xl"
              onClick={() => fetchOrders(currentPage)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg ${viewMode === "list" ? "bg-white text-gray-900" : "text-white hover:bg-white/20 hover:text-white"}`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg ${viewMode === "grid" ? "bg-white text-gray-900" : "text-white hover:bg-white/20 hover:text-white"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <OrderStats />

      {/* Filters */}
      <OrderFilterBar
        status={orderStatus}
        onStatusChange={setOrderStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        perPage={perPage}
        onPerPageChange={setPerPage}
        onReset={() => {
          setOrderStatus("all");
          setSearchQuery("");
          setStartDate("");
          setEndDate("");
          setCurrentPage(0);
        }}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-6 animate-in slide-in-from-bottom-5 fade-in duration-300 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-lg font-bold">
              {selectedOrders.length}
            </div>
            <span className="font-medium">orders selected</span>
          </div>
          <div className="h-8 w-px bg-gray-600" />
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-9"
            onClick={handleExportCSV}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      )}

      {/* Orders Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-xl"
                onClick={() => {
                  setOrderStatus("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "list" ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Table Header Bar */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-gray-600">
                      Showing <span className="text-gray-900 font-bold">{orders.length}</span> of{" "}
                      <span className="text-gray-900 font-bold">{pagination.total || orders.length}</span> orders
                    </p>
                    {selectedOrders.length > 0 && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        {selectedOrders.length} selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Processing
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50/80">
                      <th className="w-[50px] min-w-[50px] pl-6 py-4 text-left sticky left-0 bg-gray-50/80 z-10">
                        <Checkbox
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onCheckedChange={toggleSelectAll}
                          className="rounded-md border-gray-300"
                        />
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[180px]">Order</th>
                      <th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">Customer</th>
                      <th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">Date</th>
                      <th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[160px]">Status</th>
                      <th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[130px]">Payment</th>
                      <th className="py-4 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">Amount</th>
                      <th className="py-4 px-4 text-center pr-6 text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order, idx) => {
                      const statusStyle = getStatusStyle(order.status);
                      const initials = order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                      return (
                        <tr
                          key={order._id}
                          className={`
                            cursor-pointer transition-all duration-200 group relative
                            ${selectedOrders.includes(order._id)
                              ? 'bg-gradient-to-r from-emerald-50 to-teal-50'
                              : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-white'
                            }
                          `}
                          onClick={() => setSelectedOrder(order)}
                        >
                          {/* Selection indicator bar */}
                          <td className="relative pl-6 py-4 sticky left-0 bg-white group-hover:bg-gray-50 z-10" onClick={(e) => e.stopPropagation()}>
                            {selectedOrders.includes(order._id) && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full" />
                            )}
                            <Checkbox
                              checked={selectedOrders.includes(order._id)}
                              onCheckedChange={() => toggleOrderSelection(order._id)}
                              className="rounded-md border-gray-300"
                            />
                          </td>

                          {/* Order Number with Icon */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-11 h-11 rounded-xl bg-gradient-to-br ${statusStyle.gradient} 
                                flex items-center justify-center text-white font-bold text-xs shadow-lg
                                group-hover:scale-105 transition-transform duration-200
                              `}>
                                #{order.orderNumber.slice(-3)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-mono text-sm font-semibold text-gray-900">
                                  {order.orderNumber}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {order.products?.length || 0} items
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Customer with Avatar */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm">{order.customerName}</span>
                                <span className="text-xs text-gray-500 truncate max-w-[150px]">{order.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Date with relative time */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {format(new Date(order.orderDate), "MMM d, yyyy")}
                              </span>
                              <span className="text-xs text-gray-400">
                                {format(new Date(order.orderDate), "h:mm a")}
                              </span>
                            </div>
                          </td>

                          {/* Status with Progress Bar */}
                          <td className="py-4 px-4">
                            <div className="space-y-1.5">
                              <span className={`
                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide
                                ${statusStyle.bg} ${statusStyle.text}
                              `}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                {order.status.replace(/_/g, " ")}
                              </span>
                              {/* Mini progress bar */}
                              <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${statusStyle.gradient} rounded-full transition-all duration-500`}
                                  style={{
                                    width: order.status === 'completed' || order.status === 'delivered'
                                      ? '100%'
                                      : order.status === 'cancelled'
                                        ? '0%'
                                        : order.status === 'pending'
                                          ? '15%'
                                          : '60%'
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Payment Method */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`
                                p-2 rounded-lg 
                                ${order.paymentMethod === 'card' || order.paymentMethod === 'credit_card'
                                  ? 'bg-blue-100'
                                  : order.paymentMethod === 'cash' || order.paymentMethod === 'cod'
                                    ? 'bg-green-100'
                                    : 'bg-purple-100'
                                }
                              `}>
                                <svg className={`w-4 h-4 ${order.paymentMethod === 'card' || order.paymentMethod === 'credit_card'
                                  ? 'text-blue-600'
                                  : order.paymentMethod === 'cash' || order.paymentMethod === 'cod'
                                    ? 'text-green-600'
                                    : 'text-purple-600'
                                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {order.paymentMethod === 'card' || order.paymentMethod === 'credit_card' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  ) : order.paymentMethod === 'cash' || order.paymentMethod === 'cod' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {(order.paymentMethod || 'N/A').replace(/_/g, " ")}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-lg font-bold text-gray-900">
                                ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              {order.status === 'completed' || order.status === 'delivered' ? (
                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Paid
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  {order.status === 'cancelled' ? 'Refunded' : 'Awaiting'}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 pr-6">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-gray-100 hover:bg-emerald-100 text-gray-500 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Tip: Click on any row to view order details</span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">↑↓</kbd>
                    <span>Navigate</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">Enter</kbd>
                    <span>Select</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isSelected={selectedOrders.includes(order._id)}
                  onSelect={() => toggleOrderSelection(order._id)}
                  onClick={() => setSelectedOrder(order)}
                  statusColor={getStatusStyle(order.status).bg}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="rounded-xl px-6"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                  if (pageNum >= pagination.totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        w-10 h-10 rounded-xl text-sm font-semibold transition-all
                        ${currentPage === pageNum
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                disabled={currentPage >= pagination.totalPages - 1}
                className="rounded-xl px-6"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Order Details Sidebar */}
      <OrderDetailsSidebar
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdate={() => fetchOrders(currentPage)}
      />
    </div>
  );
}
