"use server";

import { writeClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function createGiftCardOrder(amount: number, recipientEmail: string, message: string, userId: string, userEmail: string, userName: string) {
    try {
        // 1. Ensure "Gift Card" product exists
        const productSlug = "gift-card-digital";
        let product = await writeClient.fetch<{ _id: string }>(`*[_type == "product" && slug.current == $slug][0]`, { slug: productSlug });

        if (!product) {
            console.log("Creating Gift Card Product...");
            product = await writeClient.create({
                _type: "product",
                name: "Digital Gift Card",
                slug: { _type: "slug", current: productSlug },
                price: 0, // Placeholder, overridden in order
                discount: 0,
                description: "EasyCom Digital Gift Card",
                images: [], // Optionally add a default image reference here if available
                categories: [],
                status: "new",
                variant: "others"
            });
        }

        // 2. Create Order
        const orderNumber = `ORD-GIFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const order = await writeClient.create({
            _type: "order",
            orderNumber,
            clerkUserId: userId,
            customerName: userName,
            email: userEmail,
            products: [{
                _key: Math.random().toString(36).substring(7),
                product: { _type: "reference", _ref: product._id },
                quantity: 1,
                price: amount // Override price
            }],
            totalPrice: amount,
            subtotal: amount,
            tax: 0,
            shipping: 0,
            currency: "USD",
            amountDiscount: 0,
            status: "pending",
            paymentStatus: "pending",
            orderDate: new Date().toISOString(),
            paymentMethod: "stripe",
            // Store gift card specific details in notes or a custom field?
            // Actually, we need to persist recipientEmail and message.
            // Let's rely on creating the Gift Card in pending state OR add specific fields to order?
            // "deliveryNotes" could store the message, but it's hacky.
            // Better: Create the Gift Card document NOW with status 'pending' and link it?
            // YES. Create Gift Card as "inactive" / "pending_payment" and link to order.
        });

        // 3. Create Pending Gift Card
        // We can use our util but we need to pass orderId
        // Also status should be 'pending_payment' if possible, but our schema only has active|redeemed|expired
        // Let's use 'active' but relying on the fact the code isn't user-facing until paid?
        // OR add 'pending' to schema.
        // For simplicity, let's just use metadata in the order or rely on the webhook to create it.
        // If we want the webhook to create it, we need to pass recipientEmail/message.
        // We can create the GiftCard doc now with status "pending" (need schema update) or just reuse "expired" (confusing).
        // Let's add "pending" to giftCardType options?
        // Or simplified: Just store the details in the Order's "deliveryNotes" or similar field.
        // Or: creating the GiftCard doc now is fine, just don't show it to user.
        // Let's create it with status 'active' but since user doesn't have code, it's fine.
        // WAIT. If I create it now, the code exists.
        // Use createGiftCardDocument from utils?

        // Let's stick to the plan: Webhook creates it.
        // Pass details via Order metadata? Order schema doesn't have metadata field.
        // I'll add deliveryNotes as JSON string for now.

        await writeClient.patch(order._id).set({
            deliveryNotes: JSON.stringify({ recipientEmail, message, isGiftCard: true })
        }).commit();

        return { success: true, orderId: order._id, orderNumber };

    } catch (error) {
        console.error("Error creating gift card order:", error);
        return { success: false, error: "Failed to create order" };
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
