"use client";

import { useEffect, useState } from "react";
import { getOrderStats, OrderStats as StatsType } from "@/actions/admin/order-stats";
import { DollarSign, ShoppingBag, Clock, TrendingUp, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from "recharts";

export default function OrderStats() {
    const [stats, setStats] = useState<StatsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getOrderStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        );
    }

    if (!stats) return null;

    const mainCards = [
        {
            title: "Today's Revenue",
            value: `$${stats.todaysRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtext: `${stats.todaysOrders} orders today`,
            icon: TrendingUp,
            gradient: "from-emerald-500 to-teal-600",
            iconBg: "bg-white/20",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders.toString(),
            subtext: "Awaiting action",
            icon: Clock,
            gradient: "from-amber-500 to-orange-600",
            iconBg: "bg-white/20",
        },
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            subtext: "All-time sales",
            icon: DollarSign,
            gradient: "from-blue-500 to-indigo-600",
            iconBg: "bg-white/20",
        },
        {
            title: "Avg. Order Value",
            value: `$${stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            subtext: "Per transaction",
            icon: ShoppingBag,
            gradient: "from-purple-500 to-pink-600",
            iconBg: "bg-white/20",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats Cards with Gradients */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={idx}
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
                        >
                            {/* Decorative circles */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80 mb-1">{card.title}</p>
                                    <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                                    <p className="text-xs text-white/70 mt-2 flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
                                        {card.subtext}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${card.iconBg} backdrop-blur-sm`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Chart with Modern Design */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                            <p className="text-sm text-gray-500">Last 7 days performance</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                                <span className="text-gray-600">Revenue</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-[250px] w-full px-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.revenueHistory} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                stroke="#9ca3af"
                            />
                            <Tooltip
                                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-gray-900 text-white rounded-lg px-4 py-3 shadow-xl border border-gray-800">
                                                <p className="text-xs text-gray-400 mb-1">{payload[0].payload.date}</p>
                                                <p className="text-lg font-bold text-emerald-400">
                                                    ${(payload[0].value as number).toLocaleString()}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
