"use server";

import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateOrder(orderId: string, updates: any) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Filter out undefined values
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
        );

        await client
            .patch(orderId)
            .set(cleanUpdates)
            .commit();

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating order:", error);
        return { success: false, error: error.message };
    }
}
