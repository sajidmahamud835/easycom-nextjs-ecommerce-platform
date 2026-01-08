"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderStats, OrderStats as StatsType } from "@/actions/admin/order-stats";
import { DollarSign, ShoppingBag, Clock, TrendingUp, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        {
            title: "Today's Revenue",
            value: `$${stats.todaysRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtext: `${stats.todaysOrders} orders today`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders.toString(),
            subtext: "Action required",
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            subtext: "Lifetime sales",
            icon: DollarSign,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Avg. Order Value",
            value: `$${stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            subtext: "Per transaction",
            icon: ShoppingBag,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                                <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
                            </div>
                            <div className={`p-3 rounded-full ${card.bg}`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
