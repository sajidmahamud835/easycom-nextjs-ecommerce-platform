"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function deleteOrderAttachment(orderId: string, assetRef: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Check admin status
        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;

        if (!userEmail || !isUserAdmin(userEmail)) {
            return { success: false, error: "Forbidden" };
        }

        if (!orderId || !assetRef) {
            return { success: false, error: "Missing required fields" };
        }

        // Remove the file reference from the order attachments array
        // We target the specific object in the array that has this asset reference
        await writeClient
            .patch(orderId)
            .unset([`attachments[asset._ref == "${assetRef}"]`])
            .commit();

        // Optionally valid to also delete the asset itself if it's orphaned, 
        // but typically we just unlink it from the document for safety.
        // If we wanted to delete the asset: await writeClient.delete(assetRef);

        revalidatePath(`/admin/orders/${orderId}`);

        return { success: true };
    } catch (error: any) {
        console.error("Delete attachment error:", error);
        return { success: false, error: error.message };
    }
}
