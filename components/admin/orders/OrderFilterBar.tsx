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
}

export default function OrderFilterBar({
    status,
    onStatusChange,
    searchQuery,
    onSearchChange,
    perPage,
    onPerPageChange,
    onReset
}: OrderFilterBarProps) {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const hasActiveFilters = status !== "all" || searchQuery.length > 0;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">

            {/* Search */}
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search order #, customer, email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                {/* Status Filter */}
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
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
                    <SelectTrigger className="w-[80px]">
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
                        <X className="w-4 h-4 mr-1" /> Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
