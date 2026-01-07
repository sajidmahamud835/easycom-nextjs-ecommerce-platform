import { writeClient } from "@/sanity/lib/client";

export const generateGiftCardCode = () => {
    const randomSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GIFT-${randomSegment()}-${randomSegment()}-${randomSegment()}`;
};

export const createGiftCardDocument = async (amount: number, recipientEmail: string, message: string, userId?: string, orderId?: string) => {
    const code = generateGiftCardCode();

    // Calculate expiry (1 year from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const giftCard = await writeClient.create({
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
        relatedOrder: orderId ? { _type: "reference", _ref: orderId } : undefined
    });

    return { success: true, code, giftCardId: giftCard._id };
};
