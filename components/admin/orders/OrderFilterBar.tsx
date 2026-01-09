"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, SlidersHorizontal } from "lucide-react";

interface OrderFilterBarProps {
    status: string;
    onStatusChange: (value: string) => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    perPage: string;
    onPerPageChange: (value: string) => void;
    onReset: () => void;
    startDate: string;
    endDate: string;
    onDateChange: (start: string, end: string) => void;
}

const statusOptions = [
    { value: "all", label: "All Orders", color: "bg-gray-500" },
    { value: "pending", label: "Pending", color: "bg-amber-500" },
    { value: "address_confirmed", label: "Address Confirmed", color: "bg-sky-500" },
    { value: "order_confirmed", label: "Order Confirmed", color: "bg-blue-500" },
    { value: "packed", label: "Packed", color: "bg-indigo-500" },
    { value: "ready_for_delivery", label: "Ready for Delivery", color: "bg-violet-500" },
    { value: "out_for_delivery", label: "Out for Delivery", color: "bg-purple-500" },
    { value: "delivered", label: "Delivered", color: "bg-emerald-500" },
    { value: "completed", label: "Completed", color: "bg-green-600" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
    { value: "rescheduled", label: "Rescheduled", color: "bg-orange-500" },
    { value: "failed_delivery", label: "Failed Delivery", color: "bg-rose-500" },
];

export default function OrderFilterBar({
    status,
    onStatusChange,
    searchQuery,
    onSearchChange,
    perPage,
    onPerPageChange,
    onReset,
    startDate,
    endDate,
    onDateChange
}: OrderFilterBarProps) {
    const hasActiveFilters = status !== "all" || searchQuery.length > 0 || startDate !== "" || endDate !== "";
    const selectedStatus = statusOptions.find(s => s.value === status);

    return (
        <div className="space-y-4">
            {/* Main Filter Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-gradient-to-r from-gray-50 to-white p-4 rounded-2xl shadow-sm border border-gray-100">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Search className="w-3.5 h-3.5 text-white" />
                    </div>
                    <Input
                        placeholder="Search orders, customers, emails..."
                        className="pl-12 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-blue-300 focus:ring-blue-100 transition-all"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Date Range with Icon */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => onDateChange(e.target.value, endDate)}
                            className="w-[110px] h-7 bg-transparent border-none text-xs p-0 focus-visible:ring-0"
                        />
                        <span className="text-gray-300">→</span>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => onDateChange(startDate, e.target.value)}
                            className="w-[110px] h-7 bg-transparent border-none text-xs p-0 focus-visible:ring-0"
                        />
                    </div>

                    {/* Status Filter with Color Indicator */}
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[200px] h-11 bg-white border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${selectedStatus?.color || 'bg-gray-400'}`} />
                                <SelectValue placeholder="Filter by Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200">
                            {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                        <span>{option.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Per Page */}
                    <Select value={perPage} onValueChange={onPerPageChange}>
                        <SelectTrigger className="w-[80px] h-11 bg-white border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-1">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="h-11 px-4 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <X className="w-4 h-4 mr-1.5" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Status Filters */}
            <div className="flex flex-wrap gap-2">
                {statusOptions.slice(0, 6).map(option => (
                    <button
                        key={option.value}
                        onClick={() => onStatusChange(option.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${status === option.value
                                ? `${option.color} text-white shadow-lg`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
