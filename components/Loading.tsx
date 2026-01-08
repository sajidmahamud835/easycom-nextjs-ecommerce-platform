"use client";
import { motion } from "motion/react";
import { Skeleton } from "./ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Hero Skeleton */}
      <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Section Title Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Image Skeleton */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />

                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Bottom Section Skeleton */}
        <div className="flex justify-center pt-4">
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>

      {/* Subtle Loading Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-gray-200 border-t-emerald-500 rounded-full"
          style={{ borderWidth: "3px" }}
        />
      </div>
    </div>
  );
};

export default Loading;
