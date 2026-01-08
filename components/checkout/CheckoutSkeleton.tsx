"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8 pb-10 animate-in fade-in-0 duration-500">
      {/* Left Column - Cart Items and Address */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Method Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 rounded-full mt-1" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 rounded-full mt-1" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-28 mb-2" />
                  <Skeleton className="h-4 w-52" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 rounded-full mt-1" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 opacity-50">
              <div className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 rounded-full mt-1" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-52" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            {/* Item 1 */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-emerald-500">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="my-4 border-t border-dashed border-gray-200" />
            <div className="flex justify-between items-end">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <div className="pt-4 space-y-2 text-center">
            <Skeleton className="h-3 w-48 mx-auto" />
            <Skeleton className="h-3 w-40 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutHeaderSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-4 w-8" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

export function OrderCheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8 pb-10 animate-in fade-in-0 duration-500">
      {/* Left Column - Order Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            {/* Item 1 */}
            <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Payment Summary */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-emerald-500">
          <Skeleton className="h-6 w-36 mb-6" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="my-4 border-t border-dashed border-gray-200" />
          <div className="flex justify-between items-end">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl mt-8" />
        </div>
      </div>
    </div>
  );
}
