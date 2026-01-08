"use client";

import { motion } from "framer-motion";
import { Lock, ExternalLink, Rocket, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PaidFeatureMessage() {
  const paidVersionUrl =
    process.env.NEXT_PUBLIC_PAID_VERION || "https://sajidmahamud.vercel.app";

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-purple-200 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Employee Management
            </CardTitle>
            <p className="text-lg text-purple-600 font-semibold">
              Coming Soon
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden"
            >
              <div
                className="bg-linear-to-r from-blue-500 to-purple-600 h-4 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </motion.div>
            <p className="text-center text-sm text-gray-500 font-medium -mt-4">Development Progress: 65%</p>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <Rocket className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Building the Future of Work
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We are actively building a comprehensive Employee Management System. This module will empower your team with advanced tools for operations, logistics, and performance tracking.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-gray-900 mb-3">
                Planned Features Include:
              </h4>
              {[
                "Employee Dashboard with Performance Metrics",
                "Order Processing & Management",
                "Call Center Order Confirmation",
                "Packing & Warehouse Operations",
                "Delivery Management System",
                "Employee Performance Tracking",
                "Role-based Access Control",
                "Real-time Order Updates",
                "Internal Chat System",
                "Shift Scheduling & Payroll Integration"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-4"
            >
              <Link
                href={paidVersionUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="w-full h-14 text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-purple-300 transition-all duration-300"
                  size="lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  View Portfolio
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center text-sm text-gray-500 pt-2"
            >
              <p>Under development — coming soon.</p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
