import { defineField, defineType } from "sanity";

export const faqType = defineType({
    name: "faq",
    title: "FAQ",
    type: "document",
    icon: () => "❓",
    fields: [
        defineField({
            name: "question",
            title: "Question",
            type: "string",
            validation: (Rule) => Rule.required().min(10).max(200),
        }),
        defineField({
            name: "answer",
            title: "Answer",
            type: "text",
            rows: 4,
            validation: (Rule) => Rule.required().min(20).max(1000),
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "Orders & Shipping", value: "orders" },
                    { title: "Returns & Refunds", value: "returns" },
                    { title: "Payments", value: "payments" },
                    { title: "Account", value: "account" },
                    { title: "Products", value: "products" },
                    { title: "General", value: "general" },
                ],
            },
            initialValue: "general",
        }),
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first",
            initialValue: 0,
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            description: "Show this FAQ on the website",
            initialValue: true,
        }),
    ],
    orderings: [
        {
            title: "Display Order",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "question",
            subtitle: "category",
        },
    },
});
