import { defineField, defineType } from "sanity";
import { CreditCard } from "lucide-react";

export const giftCardType = defineType({
    name: "giftCard",
    title: "Gift Card",
    type: "document",
    icon: CreditCard,
    fields: [
        defineField({
            name: "code",
            title: "Card Code",
            type: "string",
            validation: (Rule) => Rule.required().min(8).max(20),
            description: "Unique code for redemption (auto-generated)",
        }),
        defineField({
            name: "initialValue",
            title: "Initial Value",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "currentValue",
            title: "Current Value",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Redeemed", value: "redeemed" },
                    { title: "Expired", value: "expired" },
                ],
                layout: "radio"
            },
            initialValue: "active",
        }),
        defineField({
            name: "purchasedBy",
            title: "Purchased By",
            type: "reference",
            to: [{ type: "user" }],
        }),
        defineField({
            name: "redeemedBy",
            title: "Redeemed By",
            type: "reference",
            to: [{ type: "user" }],
            hidden: ({ parent }) => parent?.status !== "redeemed",
        }),
        defineField({
            name: "redeemedAt",
            title: "Redeemed At",
            type: "datetime",
            hidden: ({ parent }) => parent?.status !== "redeemed",
        }),
        defineField({
            name: "expiryDate",
            title: "Expiry Date",
            type: "datetime",
        }),
        defineField({
            name: "message",
            title: "Gift Message",
            type: "text",
        }),
        defineField({
            name: "recipientEmail",
            title: "Recipient Email",
            type: "string",
        }),
        defineField({
            name: "relatedOrder",
            title: "Related Order",
            type: "reference",
            to: [{ type: "order" }],
        })
    ],
    preview: {
        select: {
            title: "code",
            value: "currentValue",
            status: "status",
        },
        prepare(selection) {
            const { title, value, status } = selection;
            return {
                title: `${title} - $${value}`,
                subtitle: status.toUpperCase(),
            };
        },
    },
});
