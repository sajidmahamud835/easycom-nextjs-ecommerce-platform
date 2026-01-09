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
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

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

    return (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">

            {/* Search */}
            <div className="relative w-full xl:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search order #, customer, email..."
                    className="pl-10 text-gray-900 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                {/* Date Range */}
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-md border border-gray-200">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => onDateChange(e.target.value, endDate)}
                        className="w-[130px] h-8 bg-transparent border-none text-xs focus-visible:ring-0"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => onDateChange(startDate, e.target.value)}
                        className="w-[130px] h-8 bg-transparent border-none text-xs focus-visible:ring-0"
                    />
                </div>

                {/* Status Filter */}
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 text-gray-900">
                        <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-gray-500" />
                            <SelectValue placeholder="Filter by Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="address_confirmed">Address Confirmed</SelectItem>
                        <SelectItem value="order_confirmed">Order Confirmed</SelectItem>
                        <SelectItem value="packed">Packed</SelectItem>
                        <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        <SelectItem value="failed_delivery">Failed Delivery</SelectItem>
                    </SelectContent>
                </Select>

                {/* Per Page */}
                <Select value={perPage} onValueChange={onPerPageChange}>
                    <SelectTrigger className="w-[70px] text-gray-900">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <X className="w-4 h-4 mr-1" />
                    </Button>
                )}
            </div>
        </div>
    );
}
