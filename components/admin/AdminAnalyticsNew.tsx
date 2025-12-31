"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsSkeleton } from "@/components/admin/SkeletonLoaders";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    trend: number[];
  };
  orders: {
    total: number;
    change: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  customers: {
    total: number;
    change: number;
    active: number;
    new: number;
  };
  products: {
    total: number;
    change: number;
    lowStock: number;
    outOfStock: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    action: string;
    time: string;
    value: string;
  }>;
}

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/analytics?period=${timeRange}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  // Chart colors
  const COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"];

  // Prepare chart data
  const prepareOrderStatusChartData = () => {
    if (!analytics?.orders) return [];

    return [
      {
        name: "Completed",
        value: analytics.orders.completed,
        color: "#10B981",
      },
      { name: "Pending", value: analytics.orders.pending, color: "#F59E0B" },
      {
        name: "Cancelled",
        value: analytics.orders.cancelled,
        color: "#EF4444",
      },
    ].filter((item) => item.value > 0);
  };

  const prepareTopProductsChartData = () => {
    if (!analytics?.topProducts) return [];

    return analytics.topProducts.map((product, index) => ({
      name:
        product.name && product.name.length > 15
          ? product.name.substring(0, 15) + "..."
          : product.name || "Unknown Product",
      revenue: product.revenue,
      sales: product.sales,
    }));
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    color,
    format = "number",
    subtitle,
  }: {
    title: string;
    value: number;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    format?: "number" | "currency";
    subtitle?: string;
  }) => {
    const isPositive = change >= 0;
    const formatValue = (val: number) => {
      if (format === "currency") return `$${val.toLocaleString()}`;
      return val.toLocaleString();
    };

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-shop_light_green/20 hover:border-shop_light_green/40 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${color}`}></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-light-color flex items-center justify-between">
            {title}
            <Icon className="w-4 h-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-dark-color">
              {formatValue(value)}
            </div>
            {subtitle && (
              <div className="text-xs text-light-color">{subtitle}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className="text-xs"
            >
              {isPositive ? "+" : ""}
              {change}%
            </Badge>
            <span className="text-xs text-light-color">vs last period</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Error Loading Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={fetchAnalytics}
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-color flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-shop_light_green" />
            Business Analytics
          </h1>
          <p className="text-light-color mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            className="border-shop_light_green/20 hover:border-shop_light_green"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <StatCard
            title="Total Revenue"
            value={analytics?.revenue?.total || 0}
            change={analytics?.revenue?.change || 0}
            icon={DollarSign}
            color="from-green-500 to-emerald-600"
            format="currency"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Total Orders"
            value={analytics?.orders?.total || 0}
            change={analytics?.orders?.change || 0}
            icon={ShoppingCart}
            color="from-blue-500 to-cyan-600"
            subtitle={`${analytics?.orders?.pending || 0} pending`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Total Customers"
            value={analytics?.customers?.total || 0}
            change={analytics?.customers?.change || 0}
            icon={Users}
            color="from-purple-500 to-pink-600"
            subtitle={`${analytics?.customers?.new || 0} new this period`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard
            title="Total Products"
            value={analytics?.products?.total || 0}
            change={analytics?.products?.change || 0}
            icon={Package}
            color="from-orange-500 to-red-600"
            subtitle={`${analytics?.products?.lowStock || 0} low stock`}
          />
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-shop_light_green/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-shop_light_green" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {prepareOrderStatusChartData().length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareOrderStatusChartData()}
                        cx="50%"
                        cy="45%"
                        outerRadius={100}
                        innerRadius={40}
                        paddingAngle={3}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareOrderStatusChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} orders`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => (
                          <span
                            style={{ color: entry.color, fontSize: "14px" }}
                          >
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-light-color">
                  <PieChartIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No order data available</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <Badge variant="outline">
                    {analytics?.orders?.completed || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <Badge variant="outline">
                    {analytics?.orders?.pending || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <Badge variant="outline">
                    {analytics?.orders?.cancelled || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border-shop_light_green/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-shop_light_green" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prepareTopProductsChartData().length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareTopProductsChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: any) => [
                          name === "revenue"
                            ? `$${(value || 0).toLocaleString()}`
                            : value,
                          name === "revenue" ? "Revenue" : "Sales",
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#10B981" name="revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-light-color">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No product data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="border-shop_light_green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-shop_light_green" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${analytics?.revenue?.total.toLocaleString() || 0}
                </div>
                <div className="text-sm text-green-500">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.orders?.total || 0}
                </div>
                <div className="text-sm text-blue-500">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  $
                  {analytics?.revenue?.total && analytics?.orders?.total
                    ? (
                      analytics.revenue.total / analytics.orders.total
                    ).toFixed(2)
                    : 0}
                </div>
                <div className="text-sm text-purple-500">Avg Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Card className="border-shop_light_green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-shop_light_green" />
              Recent Business Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.recentActivity?.slice(0, 8).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-shop_light_green/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-shop_light_green rounded-full"></div>
                    <span className="text-sm text-dark-color">
                      {activity.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.value}
                    </Badge>
                    <span className="text-xs text-light-color">
                      {activity.time}
                    </span>
                  </div>
                </div>
              )) || (
                  <div className="text-center py-6 text-light-color">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity available</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
