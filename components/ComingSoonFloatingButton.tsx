"use client";

import { useState } from "react";
import { Crown, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PremiumFloatingButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const upgradeUrl =
    process.env.NEXT_PUBLIC_PAID_VERION ||
    "https://sajidmahamud.vercel.app";

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-20 right-0 w-96 bg-linear-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl"
                />
              </div>

              <div className="relative p-6">
                {/* Close button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  aria-label="Close premium features modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="bg-white/20 backdrop-blur-sm p-3 rounded-xl"
                    >
                      <Crown className="w-8 h-8 text-yellow-300" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Go Premium
                      </h3>
                      <p className="text-sm text-purple-100">
                        Unlock All Features
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    {[
                      "Employee Management System - Coming Soon",
                      "Advanced Analytics Dashboard - Coming Soon",
                      "Review Management Tools - Coming Soon",
                      "Subscription Management - Coming Soon",
                      "Customer Insights & Reports - Coming Soon",
                      "Export Data to Excel/CSV - Coming Soon",
                      "Custom Admin Branding - Coming Soon",
                      "Priority Support & Updates - Coming Soon",
                    ].map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-white/90 text-sm"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    href={upgradeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform text-center"
                  >
                    View Portfolio
                  </Link>

                  <p className="text-xs text-purple-100 text-center">
                    One-time payment • Lifetime access
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group border-none bg-transparent cursor-pointer p-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open premium features modal"
        >
          {/* Pulse animation ring */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full blur-md"
          />

          {/* Main button */}
          <div className="relative bg-linear-to-br from-purple-600 via-indigo-600 to-purple-700 p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-shadow">
            {/* Sparkle effect */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full"
            />

            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Crown className="w-7 h-7 text-yellow-300 relative z-10" />
            </motion.div>
          </div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl pointer-events-none"
          >
            Coming Soon
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="border-8 border-transparent border-l-gray-900" />
            </div>
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
