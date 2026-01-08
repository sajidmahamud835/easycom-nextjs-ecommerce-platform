"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { auth } from "@clerk/nextjs/server";

export async function searchCustomers(query: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        if (!query || query.length < 2) return [];

        // Search by name, email, or phone (if available) assuming user schema has these
        // Note: Adjust fields based on actual user schema
        const sanityQuery = groq`*[_type == "user" && (
      name match $query + "*" || 
      email match $query + "*" ||
      phone match $query + "*"
    )] | order(name asc) [0...10] {
      _id,
      clerkId,
      name,
      email,
      phone,
      address
    }`;

        const customers = await client.fetch(sanityQuery, { query });
        return customers;
    } catch (error) {
        console.error("Error searching customers:", error);
        return [];
    }
}

export async function searchProducts(query: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        if (!query || query.length < 2) return [];

        const sanityQuery = groq`*[_type == "product" && (
      name match $query + "*" || 
      description match $query + "*" ||
      tags[] match $query + "*"
    ) && !(_id in path('drafts.**'))] | order(name asc) [0...20] {
      _id,
      name,
      price,
      "image": images[0].asset->url,
      stock,
      sku,
      currency
    }`;

        const products = await client.fetch(sanityQuery, { query });
        return products;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}

export async function createAdminOrder(orderData: any) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // Basic validation
        if (!orderData.products || orderData.products.length === 0) {
            throw new Error("No products selected");
        }

        // Prepare Sanity document
        const doc = {
            _type: "order",
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            orderDate: new Date().toISOString(),
            status: "pending",
            paymentStatus: orderData.paymentStatus || "pending",
            paymentMethod: orderData.paymentMethod || "cash_on_delivery",
            currency: orderData.currency || "USD",

            // Customer Info
            customerName: orderData.customerName,
            email: orderData.email,
            clerkUserId: orderData.clerkUserId || "admin-created", // differentiating admin created orders if needed

            // Address
            address: orderData.address,

            // Financials
            subtotal: orderData.subtotal,
            tax: orderData.tax || 0,
            shipping: orderData.shipping || 0,
            amountDiscount: orderData.amountDiscount || 0,
            totalPrice: orderData.totalPrice,

            // Products
            products: orderData.products.map((p: any) => ({
                _key: Math.random().toString(36).substring(7),
                product: { _type: "reference", _ref: p._id },
                quantity: p.quantity,
                price: p.price // Capturing price at time of order is crucial
            })),

            statusHistory: [
                {
                    _key: Math.random().toString(36).substring(7),
                    status: "pending",
                    changedBy: "Admin", // Should really be the admin's email/name
                    changedAt: new Date().toISOString(),
                    notes: "Order created manually by admin"
                }
            ]
        };

        const createdOrder = await client.create(doc);
        return { success: true, orderId: createdOrder._id, orderNumber: createdOrder.orderNumber };

    } catch (error: any) {
        console.error("Error creating admin order:", error);
        return { success: false, error: error.message };
    }
}
