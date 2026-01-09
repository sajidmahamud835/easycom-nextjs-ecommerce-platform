"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function uploadOrderAttachment(formData: FormData) {
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

        const orderId = formData.get("orderId") as string;
        const file = formData.get("file") as File;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;

        if (!orderId || !file) {
            return { success: false, error: "Missing required fields" };
        }

        // Convert file to buffer for Sanity upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Sanity
        const asset = await writeClient.assets.upload("file", buffer, {
            filename: file.name,
            contentType: file.type,
        });

        // Patch order
        await writeClient
            .patch(orderId)
            .setIfMissing({ attachments: [] })
            .append("attachments", [
                {
                    _type: "file",
                    asset: { _type: "reference", _ref: asset._id },
                    description: description || "",
                    category: category || "other",
                },
            ])
            .commit();

        revalidatePath(`/admin/orders/${orderId}`); // Or wherever the order is viewed

        return { success: true };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { success: false, error: error.message };
    }
}
