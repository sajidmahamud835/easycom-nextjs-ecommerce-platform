import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const ticketType = defineType({
    name: "ticket",
    title: "Support Ticket",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "ticketId",
            title: "Ticket ID",
            type: "string",
            readOnly: true,
            description: "Unique identifier for this ticket",
        }),
        defineField({
            name: "subject",
            title: "Subject",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "message",
            title: "Message",
            type: "text",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Open", value: "open" },
                    { title: "In Progress", value: "in-progress" },
                    { title: "Resolved", value: "resolved" },
                    { title: "Closed", value: "closed" },
                ],
                layout: "radio",
            },
            initialValue: "open",
        }),
        defineField({
            name: "priority",
            title: "Priority",
            type: "string",
            options: {
                list: [
                    { title: "Low", value: "low" },
                    { title: "Medium", value: "medium" },
                    { title: "High", value: "high" },
                ],
            },
            initialValue: "medium",
        }),
        defineField({
            name: "userEmail",
            title: "User Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "userName",
            title: "User Name",
            type: "string",
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
            readOnly: true,
        }),
    ],
    preview: {
        select: {
            title: "ticketId",
            subtitle: "subject",
            status: "status",
        },
        prepare({ title, subtitle, status }) {
            return {
                title: `[${status?.toUpperCase()}] ${title}`,
                subtitle: subtitle,
            };
        },
    },
});
