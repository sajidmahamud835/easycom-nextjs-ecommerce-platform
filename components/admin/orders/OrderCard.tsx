"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MoreHorizontal, Calendar, CreditCard, Package, ArrowUpRight } from "lucide-react";
import { Order } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderCardProps {
    order: Order;
    isSelected: boolean;
    onSelect: () => void;
    onClick: () => void;
    statusColor: string;
}

export default function OrderCard({
    order,
    isSelected,
    onSelect,
    onClick,
    statusColor
}: OrderCardProps) {
    const formattedDate = new Date(order.orderDate).toLocaleDateString("en-US", {
        month: "short", day: "numeric"
    });

    // Get gradient based on status
    const getStatusGradient = (status: string) => {
        switch (status) {
            case "pending":
                return "from-amber-500 to-orange-500";
            case "processing":
            case "order_confirmed":
            case "packed":
                return "from-blue-500 to-indigo-500";
            case "shipped":
            case "ready_for_delivery":
            case "out_for_delivery":
                return "from-violet-500 to-purple-500";
            case "delivered":
            case "completed":
                return "from-emerald-500 to-teal-500";
            case "cancelled":
                return "from-red-500 to-rose-500";
            default:
                return "from-gray-400 to-gray-500";
        }
    };

    return (
        <div
            className={`
                group relative bg-white rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer
                hover:shadow-xl hover:-translate-y-1
                ${isSelected
                    ? "border-emerald-500 shadow-lg shadow-emerald-100"
                    : "border-transparent shadow-md hover:border-gray-200"
                }
            `}
            onClick={onClick}
        >
            {/* Top Gradient Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${getStatusGradient(order.status)} opacity-80`} />

            {/* Selection Checkbox */}
            <div
                className="absolute top-4 right-4 z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                <div className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300 bg-white group-hover:border-gray-400"
                    }
                `}>
                    {isSelected && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Header */}
            <div className="mb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                            {order.orderNumber}
                        </p>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight truncate max-w-[180px]">
                            {order.customerName}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
                <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white
                    bg-gradient-to-r ${getStatusGradient(order.status)} shadow-sm
                `}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {order.status.replace(/_/g, " ")}
                </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 rounded-lg bg-blue-50">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 rounded-lg bg-purple-50">
                        <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <span className="capitalize truncate">{order.paymentMethod?.replace(/_/g, " ") || "N/A"}</span>
                </div>
            </div>

            {/* Price & Items */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div>
                    <p className="text-2xl font-bold text-gray-900">
                        ${order.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {order.products?.length || 0} items
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-emerald-50 transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                >
                    <ArrowUpRight className="w-5 h-5 text-gray-600" />
                </Button>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400 truncate max-w-[150px]">{order.email}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-gray-100">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={onClick} className="rounded-lg">
                            <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(order.orderNumber)}
                            className="rounded-lg"
                        >
                            Copy Order ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
