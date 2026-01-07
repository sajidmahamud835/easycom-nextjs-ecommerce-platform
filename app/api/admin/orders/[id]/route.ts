import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient } from "@/sanity/lib/client";
import { sendOrderStatusNotification } from "@/lib/notificationService";
import { addWalletCredit } from "@/lib/walletUtils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Not logged in" },
        { status: 401 }
      );
    }

    // Get current user details to check admin status
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    // Check if current user is admin
    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const updateData = await req.json();

    // Fetch the current order to get previous status and user info
    const currentOrder = await writeClient.fetch(
      `*[_type == "order" && _id == $id][0] {
        _id,
        orderNumber,
        status,
        paymentStatus,
        totalPrice,
        amountPaid,
        clerkUserId,
        user -> {
          clerkUserId,
          email,
          firstName,
          lastName
        }
      }`,
      { id }
    );

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Validate update data
    const allowedFields = [
      "status",
      "totalPrice",
      "paymentStatus",
      "trackingNumber",
      "notes",
      "estimatedDelivery",
      "actualDelivery",
      // Employee tracking fields
      "addressConfirmedBy",
      "addressConfirmedAt",
      "orderConfirmedBy",
      "orderConfirmedAt",
      "packedBy",
      "packedAt",
      "packingNotes",
      "dispatchedBy",
      "dispatchedAt",
      "assignedWarehouseBy",
      "assignedWarehouseAt",
      "assignedDeliverymanId",
      "assignedDeliverymanName",
      "deliveredBy",
      "deliveredAt",
      "deliveryNotes",
      "deliveryAttempts",
      "rescheduledDate",
      "rescheduledReason",
      // Cash collection
      "cashCollected",
      "cashCollectedAmount",
      "cashCollectedAt",
      "paymentReceivedBy",
      "paymentReceivedAt",
      // Cancellation fields
      "cancelledAt",
      "cancelledBy",
      "refundedToWallet",
      "refundAmount",
    ];

    const filteredUpdateData: Record<string, string | number | boolean | Date> =
      {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    // Add update timestamp
    filteredUpdateData._updatedAt = new Date().toISOString();

    // Handle order cancellation and wallet refund
    let walletRefunded = false;
    let refundAmount = 0;

    if (
      updateData.status === "cancelled" &&
      currentOrder.status !== "cancelled"
    ) {
      // Order is being cancelled, check if we need to refund
      const isPaidOrder = currentOrder.paymentStatus === "paid";
      const amountToRefund =
        currentOrder.amountPaid || currentOrder.totalPrice || 0;

      if (isPaidOrder && amountToRefund > 0) {
        // Get the user's clerkUserId
        const userClerkId =
          currentOrder.clerkUserId || currentOrder.user?.clerkUserId;

        if (userClerkId) {
          try {
            const refundResult = await addWalletCredit(
              userClerkId,
              amountToRefund,
              `Refund for cancelled order #${currentOrder.orderNumber}`,
              id,
              userEmail || "admin"
            );

            if (refundResult.success) {
              walletRefunded = true;
              refundAmount = amountToRefund;

              // Add refund information to the update
              filteredUpdateData.refundedToWallet = true;
              filteredUpdateData.refundAmount = refundAmount;
              filteredUpdateData.cancelledAt = new Date().toISOString();
              filteredUpdateData.cancelledBy = userEmail || "admin";
              filteredUpdateData.paymentStatus = "refunded";

              console.log(
                `✅ Refunded $${refundAmount} to user wallet for order ${currentOrder.orderNumber}`
              );
            } else {
              console.error(
                "Failed to add refund to wallet:",
                refundResult.message
              );
            }
          } catch (walletError) {
            console.error("Error processing wallet refund:", walletError);
          }
        } else {
          console.warn(
            `⚠️ Cannot process refund: No clerkUserId found for order ${id}`
          );
        }
      }

      // Always add cancellation metadata
      if (!filteredUpdateData.cancelledAt) {
        filteredUpdateData.cancelledAt = new Date().toISOString();
        filteredUpdateData.cancelledBy = userEmail || "admin";
      }
    }

    // Update the order in Sanity
    const updatedOrder = await writeClient
      .patch(id)
      .set(filteredUpdateData)
      .commit();

    // Track order status update and send notification if status was changed
    if (updateData.status && updateData.status !== currentOrder.status) {
      // Track analytics
      try {
        await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/analytics/track`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventName: "order_status_update",
              eventParams: {
                orderId: id,
                status: updateData.status,
                previousStatus: currentOrder.status,
                adminUserId: userId,
              },
            }),
          }
        );
      } catch (analyticsError) {
        console.error(
          "Failed to track order status update event:",
          analyticsError
        );
      }

      // Send notification to user
      try {
        const userClerkId =
          currentOrder.clerkUserId || currentOrder.user?.clerkUserId;

        if (userClerkId) {
          await sendOrderStatusNotification({
            clerkUserId: userClerkId,
            orderNumber: currentOrder.orderNumber,
            orderId: id,
            status: updateData.status,
            previousStatus: currentOrder.status,
          });
        } else {
          console.warn(
            `⚠️ Cannot send notification: No clerkUserId found for order ${id}`
          );
        }
      } catch (notificationError) {
        console.error(
          "Failed to send order status notification:",
          notificationError
        );
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      message: walletRefunded
        ? `Order updated successfully. $${refundAmount.toFixed(
            2
          )} refunded to customer's wallet.`
        : "Order updated successfully",
      order: updatedOrder,
      walletRefunded,
      refundAmount: walletRefunded ? refundAmount : 0,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Not logged in" },
        { status: 401 }
      );
    }

    // Get current user details to check admin status
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    // Check if current user is admin
    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Fetch the specific order from Sanity
    const query = `
      *[_type == "order" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        orderNumber,
        customerName,
        email,
        totalPrice,
        currency,
        status,
        paymentMethod,
        paymentStatus,
        orderDate,
        address,
        products[] {
          _key,
          quantity,
          product-> {
            _id,
            name,
            price,
            image
          }
        },
        subtotal,
        tax,
        shipping,
        amountDiscount,
        trackingNumber,
        notes,
        estimatedDelivery,
        actualDelivery,
        // Employee tracking fields
        addressConfirmedBy,
        addressConfirmedAt,
        orderConfirmedBy,
        orderConfirmedAt,
        packedBy,
        packedAt,
        packingNotes,
        dispatchedBy,
        dispatchedAt,
        assignedWarehouseBy,
        assignedWarehouseAt,
        assignedDeliverymanId,
        assignedDeliverymanName,
        deliveredBy,
        deliveredAt,
        deliveryNotes,
        deliveryAttempts,
        rescheduledDate,
        rescheduledReason,
        // Cash collection
        cashCollected,
        cashCollectedAmount,
        cashCollectedAt,
        paymentReceivedBy,
        paymentReceivedAt,
        // Cancellation request fields
        cancellationRequested,
        cancellationRequestedAt,
        cancellationRequestReason,
        // Cancellation fields
        cancelledAt,
        cancelledBy,
        cancellationReason,
        refundedToWallet,
        refundAmount,
        amountPaid
      }
    `;

    const order = await writeClient.fetch(query, { id });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
