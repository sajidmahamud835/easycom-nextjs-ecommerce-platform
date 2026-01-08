"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MoreHorizontal, Copy, Calendar, CreditCard, DollarSign } from "lucide-react";
import { Order } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface OrderCardProps {
    order: Order;
    selected: boolean;
    onSelect: (orderId: string) => void;
    onViewDetails: (order: Order) => void;
    getStatusColor: (status: string) => string;
}

export default function OrderCard({
    order,
    selected,
    onSelect,
    onViewDetails,
    getStatusColor
}: OrderCardProps) {

    const formattedDate = new Date(order.orderDate).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    });

    return (
        <div className={`
      relative bg-white rounded-xl border p-4 transition-all hover:shadow-md
      ${selected ? "border-emerald-500 bg-emerald-50/10 shadow-sm" : "border-gray-200"}
    `}>
            {/* Selection Checkbox */}
            <div className="absolute top-4 left-4">
                <Checkbox checked={selected} onCheckedChange={() => onSelect(order._id)} />
            </div>

            {/* Card Header / Status */}
            <div className="pl-8 flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-400 mb-1">{order.orderNumber}</span>
                    <h4 className="font-semibold text-gray-900 truncate max-w-[180px]" title={order.customerName}>
                        {order.customerName}
                    </h4>
                </div>
                <Badge className={`${getStatusColor(order.status)} border-0`}>
                    {order.status.replace(/_/g, " ")}
                </Badge>
            </div>

            {/* Order Details Grid */}
            <div className="pl-8 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2" title="Order Date">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2" title="Payment Method">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    <span className="capitalize">{order.paymentMethod.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 mt-1">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalPrice)}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                        ({order.products?.length || 0} items)
                    </span>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pl-8 flex items-center justify-between border-t pt-3 mt-auto">
                <div className="text-xs text-gray-400 truncate max-w-[120px]">
                    {order.email}
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewDetails(order)}>
                        <Eye className="w-4 h-4 text-gray-500 hover:text-emerald-600" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewDetails(order)}>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.orderNumber)}>
                                Copy Order ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
