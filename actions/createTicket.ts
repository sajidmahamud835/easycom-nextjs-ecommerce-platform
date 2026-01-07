"use server";

import { writeClient } from "@/sanity/lib/client";

export async function createTicket(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;
        const priority = formData.get("priority") as string || "medium";

        if (!email || !subject || !message) {
            return { success: false, error: "Missing required fields" };
        }

        // Generate a short ID (e.g., TKT-123456)
        const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

        await writeClient.create({
            _type: "ticket",
            ticketId,
            userName: name,
            userEmail: email,
            subject,
            message,
            priority,
            status: "open",
            createdAt: new Date().toISOString(),
        });

        return { success: true, ticketId };
    } catch (error) {
        console.error("Error creating ticket:", error);
        return { success: false, error: "Failed to create ticket. Please try again." };
    }
}
