"use server";

import { writeClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function purchaseGiftCard(amount: number, recipientEmail: string, message: string, userId?: string) {
    try {
        // Generate a formatted code: GIFT-XXXX-XXXX-XXXX
        const randomSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `GIFT-${randomSegment()}-${randomSegment()}-${randomSegment()}`;

        // Calculate expiry (1 year from now)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        await writeClient.create({
            _type: "giftCard",
            code,
            initialValue: amount,
            currentValue: amount,
            status: "active",
            recipientEmail,
            message,
            purchasedBy: userId ? { _type: "reference", _ref: userId } : undefined,
            expiryDate: expiryDate.toISOString(),
            createdAt: new Date().toISOString(),
        });

        return { success: true, code };
    } catch (error) {
        console.error("Error creating gift card:", error);
        return { success: false, error: "Failed to process purchase" };
    }
}

export async function redeemGiftCard(code: string, userId: string, clerkUserId: string) {
    try {
        // 1. Fetch the gift card
        const query = groq`*[_type == "giftCard" && code == $code][0]`;
        const giftCard = await writeClient.fetch(query, { code });

        // 2. Validation
        if (!giftCard) return { success: false, error: "Invalid gift card code" };
        if (giftCard.status !== "active") return { success: false, error: "Gift card is already redeemed or inactive" };
        if (new Date(giftCard.expiryDate) < new Date()) return { success: false, error: "Gift card has expired" };

        const redeemAmount = giftCard.currentValue;

        // 3. Transaction: Update Gift Card AND User Credit
        const transaction = writeClient.transaction();

        // Mark card as redeemed
        transaction.patch(giftCard._id, {
            set: {
                status: "redeemed",
                redeemedBy: { _type: "reference", _ref: userId },
                redeemedAt: new Date().toISOString(),
                currentValue: 0
            }
        });

        // Add credit to user
        // Note: We need to know the User Document ID, not just Clerk ID. 
        // Assuming 'userId' passed is the Sanity Document ID.
        transaction.patch(userId, {
            inc: { storeCredit: redeemAmount }
        });

        await transaction.commit();

        return { success: true, amount: redeemAmount };

    } catch (error) {
        console.error("Error redeeming gift card:", error);
        return { success: false, error: "Redemption failed. Please try again." };
    }
}
