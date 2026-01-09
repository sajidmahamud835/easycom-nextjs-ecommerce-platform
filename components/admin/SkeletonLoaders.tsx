import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";

// Admin Layout Skeleton
export const AdminLayoutSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink/20">
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          {/* Header Skeleton */}
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <Skeleton className="h-6 w-12 mx-auto" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </Card>

          {/* Content Card Skeleton */}
          <Card>
            <div className="p-6">
              <Skeleton className="h-96 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

// Dashboard Overview Skeleton
export const DashboardOverviewSkeleton = () => (
  <div className="p-6 space-y-8">
    {/* Header Skeleton */}
    <div className="text-center space-y-2">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-1 bg-gray-200 animate-pulse"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Quick Actions Skeleton */}
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-7 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    {/* Recent Activity Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-6 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 space-y-3">
          <Skeleton className="w-12 h-12 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Analytics Page Skeleton
export const AnalyticsSkeleton = () => (
  <div className="p-6 space-y-8">
    {/* Header Skeleton */}
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-1 bg-gray-200 animate-pulse"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-6 w-40" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Activity Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-6 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Users Page Skeleton
export const UsersSkeleton = () => (
  <div className="space-y-6">
    {/* Modern Gradient Header Skeleton */}
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-white/20" />
            <Skeleton className="h-4 w-64 bg-white/20" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-24 rounded-xl bg-white/20" />
          <Skeleton className="h-12 w-24 rounded-xl bg-white/20" />
          <Skeleton className="h-12 w-24 rounded-xl bg-white/20" />
        </div>
      </div>
    </div>

    {/* Search and Controls Bar Skeleton */}
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>

    {/* Table Skeleton */}
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 px-4 py-4">
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 px-4 py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pagination Skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// Products Page Skeleton
export const ProductsSkeleton = () => (
  <div className="space-y-4 p-4">
    {/* Header */}
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0">
        <Skeleton className="h-9 w-full sm:w-48" />
        <Skeleton className="h-9 w-full sm:w-32" />
        <Skeleton className="h-9 w-full sm:w-9" />
      </div>
    </div>

    {/* Desktop Table Skeleton */}
    <div className="hidden md:block">
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>

    {/* Mobile Card Skeleton */}
    <div className="md:hidden space-y-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <div className="p-4 space-y-4">
            {/* Product Header */}
            <div className="flex items-start gap-3">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Pagination Skeleton */}
    <div className="flex justify-center gap-2">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-16" />
    </div>
  </div>
);

// Orders Page Skeleton
export const OrdersSkeleton = () => (
  <div className="space-y-6">
    {/* Modern Gradient Header Skeleton */}
    <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-white/20" />
            <Skeleton className="h-4 w-64 bg-white/20" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-24 rounded-xl bg-white/20" />
          <Skeleton className="h-12 w-24 rounded-xl bg-white/20" />
        </div>
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Orders Table Skeleton */}
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 px-4 py-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// General Stats Cards Skeleton (for reuse)
export const StatsCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-16" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// General Charts Skeleton (for reuse)
export const ChartsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {[...Array(2)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// Order Details Sidebar Skeleton
export const OrderDetailsSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Order Status Card Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Customer Information Card Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-5 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Financial Details Card Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-5 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Shipping Information Card Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-5 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="bg-gray-50 p-3 rounded-md space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Order Items Card Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border"
            >
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Order Dates Card Skeleton */}
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-5 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Notes Card Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>

    {/* Action Buttons Skeleton */}
    <div className="flex gap-4 pt-6 pb-4 px-2">
      <Skeleton className="flex-1 h-10 rounded-xl" />
      <Skeleton className="h-10 w-24 rounded-xl" />
    </div>
  </div>
);

// Notifications Page Skeleton
export const NotificationsSkeleton = () => (
  <div className="space-y-6">
    {/* Modern Gradient Header Skeleton */}
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-white/20" />
            <Skeleton className="h-4 w-64 bg-white/20" />
          </div>
        </div>
        <Skeleton className="h-12 w-40 rounded-xl bg-white/20" />
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Notifications Table Skeleton */}
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Account Requests Page Skeleton
export const AccountRequestsSkeleton = () => (
  <div className="space-y-6">
    {/* Modern Gradient Header Skeleton */}
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-white/20" />
            <Skeleton className="h-4 w-64 bg-white/20" />
          </div>
        </div>
        <Skeleton className="h-12 w-28 rounded-xl bg-white/20" />
      </div>
    </div>

    {/* Overview Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Tabs Skeleton */}
    <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-gray-100">
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
    </div>

    {/* Requests Table Skeleton */}
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-48" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
