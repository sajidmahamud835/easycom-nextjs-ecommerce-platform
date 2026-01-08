"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import ResponsiveOrdersComponent from "@/components/ResponsiveOrdersComponent";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";

interface OrdersClientProps {
  initialOrders: MY_ORDERS_QUERYResult;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function OrdersClient({
  initialOrders,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
}: OrdersClientProps) {
  const [orders] = useState(initialOrders || []);
  const [isPending, startTransition] = useTransition();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();

  // Set initial load to false after first render
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 10;

    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
          items.push(i);
        }
        if (totalPages > 5) {
          items.push("ellipsis");
          items.push(totalPages);
        }
      } else if (currentPage >= totalPages - 3) {
        items.push(1);
        items.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`/user/orders?page=${page}`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Orders Content */}
      <div>
        {isPending && !isInitialLoad ? (
          // Show only orders skeleton for pagination loading
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-5">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <Skeleton className="w-16 h-16 rounded-lg" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Skeleton className="w-16 h-16 rounded-lg" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="h-3 w-1/3" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-1/3 space-y-3">
                        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : orders && orders.length > 0 ? (
          <div>
            <ResponsiveOrdersComponent orders={orders} />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No orders found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Start shopping to see your orders here.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Right Aligned Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  size="default"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasPrevPage && !isPending)
                      handlePageChange(currentPage - 1);
                  }}
                  className={
                    !hasPrevPage || isPending
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent"
                  }
                />
              </PaginationItem>

              {generatePaginationItems().map((item, index) => (
                <PaginationItem key={index}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === item}
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof item === "number" && !isPending)
                          handlePageChange(item);
                      }}
                      className={
                        currentPage === item
                          ? "bg-primary text-primary-foreground hover:bg-primary/80" +
                          (isPending ? " opacity-50" : "")
                          : "hover:bg-accent" +
                          (isPending ? " opacity-50 pointer-events-none" : "")
                      }
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  size="default"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasNextPage && !isPending)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    !hasNextPage || isPending
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
