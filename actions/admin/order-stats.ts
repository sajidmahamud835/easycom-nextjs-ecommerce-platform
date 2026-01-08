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
}

export async function getOrderStats(): Promise<OrderStats> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // We use a single query to get all necessary aggregations
        // calculating today's start date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();

        const query = groq`{
      "allOrders": *[_type == "order" && status != "cancelled"],
      "pendingOrders": count(*[_type == "order" && status == "pending"]),
      "todaysOrders": *[_type == "order" && orderDate >= $todayIso && status != "cancelled"]
    }`;

        const result = await client.fetch(query, { todayIso });

        const allOrders = result.allOrders || [];
        const todaysOrders = result.todaysOrders || [];

        const totalRevenue = allOrders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
        const totalOrders = allOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const todaysRevenue = todaysOrders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

        return {
            totalRevenue,
            totalOrders,
            pendingOrders: result.pendingOrders || 0,
            todaysOrders: todaysOrders.length,
            todaysRevenue,
            averageOrderValue
        };

    } catch (error) {
        console.error("Error fetching order stats:", error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            pendingOrders: 0,
            todaysOrders: 0,
            todaysRevenue: 0,
            averageOrderValue: 0
        };
    }
}
