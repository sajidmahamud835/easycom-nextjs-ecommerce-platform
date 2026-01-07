"use server";

import { writeClient } from "@/sanity/lib/client";

export async function createSellerRequest(formData: FormData) {
    try {
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const businessName = formData.get("businessName") as string;
        const businessDescription = formData.get("businessDescription") as string;

        if (!email || !firstName || !businessName) {
            return { success: false, error: "Missing required fields" };
        }

        // Check if request already exists for this email
        const existing = await writeClient.fetch(
            `*[_type == "userAccessRequest" && email == $email][0]`,
            { email }
        );

        if (existing) {
            return { success: false, error: "An application with this email already exists." };
        }

        await writeClient.create({
            _type: "userAccessRequest",
            clerkUserId: "pending_registration", // Placeholder until they actually sign up/link
            firstName,
            lastName,
            email,
            businessName,
            businessDescription,
            status: "pending",
            requestedAt: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating seller request:", error);
        return { success: false, error: "Failed to submit application. Please try again." };
    }
}
