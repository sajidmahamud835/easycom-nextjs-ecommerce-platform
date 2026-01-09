"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { auth } from "@clerk/nextjs/server";

export interface OrderStats {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    todaysOrders: number;
    todaysRevenue: number;
    averageOrderValue: number;
    revenueHistory: { date: string; revenue: number }[];
}

export async function getOrderStats(): Promise<OrderStats> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();

        // Calculate 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const sevenDaysAgoIso = sevenDaysAgo.toISOString();

        const query = groq`{
          "allOrders": *[_type == "order" && status != "cancelled"],
          "pendingOrders": count(*[_type == "order" && status == "pending"]),
          "todaysOrders": *[_type == "order" && orderDate >= $todayIso && status != "cancelled"],
          "last7DaysOrders": *[_type == "order" && orderDate >= $sevenDaysAgoIso && status != "cancelled"] {
             totalPrice,
             orderDate
          }
        }`;

        const result = await client.fetch(query, { todayIso, sevenDaysAgoIso });

        const allOrders = result.allOrders || [];
        const todaysOrders = result.todaysOrders || [];
        const last7DaysOrders = result.last7DaysOrders || [];

        const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
        const totalOrders = allOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const todaysRevenue = todaysOrders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

        // Process revenue history
        const revenueMap: Record<string, number> = {};

        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            revenueMap[dateStr] = 0;
        }

        // Aggregate revenue
        last7DaysOrders.forEach((order: any) => {
            const dateStr = new Date(order.orderDate).toISOString().split('T')[0];
            if (revenueMap[dateStr] !== undefined) {
                revenueMap[dateStr] += (order.totalPrice || 0);
            }
        });

        // Convert to array and sort by date
        const revenueHistory = Object.entries(revenueMap)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return {
            totalRevenue,
            totalOrders,
            pendingOrders: result.pendingOrders || 0,
            todaysOrders: todaysOrders.length,
            todaysRevenue,
            averageOrderValue,
            revenueHistory
        };

    } catch (error) {
        console.error("Error fetching order stats:", error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            pendingOrders: 0,
            todaysOrders: 0,
            todaysRevenue: 0,
            averageOrderValue: 0,
            revenueHistory: []
        };
    }
}
