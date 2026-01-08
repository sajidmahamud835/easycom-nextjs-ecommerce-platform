import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex gap-4">
        {/* Product Image Skeleton */}
        <div className="w-24 h-24 flex-shrink-0">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>

        {/* Product Details Skeleton */}
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-6 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Stock Status Skeleton */}
          <Skeleton className="h-5 w-24 mt-2" />

          {/* Controls Skeleton */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-16 ml-4" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderSummarySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-emerald-500">
      <Skeleton className="h-7 w-32 mb-6" />
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-14" />
        </div>
        <div className="my-4 border-t border-dashed border-gray-200" />
        <div className="flex justify-between items-end">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function AddressSelectorSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-4 h-4 rounded-full mt-1" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 opacity-50">
          <div className="flex items-start gap-3">
            <Skeleton className="w-4 h-4 rounded-full mt-1" />
            <div className="flex-1">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8 pb-10">
      {/* Cart Items Skeleton */}
      <div className="lg:col-span-2 space-y-6">
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>

      {/* Sidebar Skeleton */}
      <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
        <AddressSelectorSkeleton />
        <OrderSummarySkeleton />
      </div>
    </div>
  );
}
