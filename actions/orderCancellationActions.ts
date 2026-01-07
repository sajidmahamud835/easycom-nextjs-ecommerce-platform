"use server";

import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { addWalletCredit } from "@/lib/walletUtils";
import { sendOrderStatusNotification } from "@/lib/notificationService";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/adminUtils";

/**
 * Admin: Approve cancellation request and cancel order with refund
 */
export async function approveCancellationRequest(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: "Unauthorized" };
    }

    // Verify admin status - check both database field and environment variable
    const adminUser = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]{ email, isAdmin }`,
      { clerkUserId }
    );

    if (!isAdmin(adminUser)) {
      return {
        success: false,
        message: "Admin access required to approve cancellation requests",
      };
    }

    // Fetch order details
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        status,
        paymentStatus,
        totalPrice,
        amountPaid,
        clerkUserId,
        cancellationRequested,
        cancellationRequestReason
      }`,
      { orderId }
    );

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    if (!order.cancellationRequested) {
      return {
        success: false,
        message: "No cancellation request found for this order",
      };
    }

    if (order.status === "cancelled") {
      return { success: false, message: "Order is already cancelled" };
    }

    // Determine refund amount
    let refundAmount = 0;
    let shouldRefund = false;

    if (order.paymentStatus === "paid") {
      refundAmount = order.amountPaid || order.totalPrice || 0;
      shouldRefund = refundAmount > 0;
    }

    // Add refund to wallet if payment was made
    let walletRefunded = false;
    if (shouldRefund && refundAmount > 0) {
      const refundResult = await addWalletCredit(
        order.clerkUserId,
        refundAmount,
        `Refund for cancelled order #${order.orderNumber}`,
        orderId,
        adminUser.email
      );

      if (refundResult.success) {
        walletRefunded = true;
      } else {
        console.error("Failed to add refund to wallet:", refundResult.message);
      }
    }

    // Update order status to cancelled
    await backendClient
      .patch(orderId)
      .set({
        status: "cancelled",
        paymentStatus: walletRefunded ? "refunded" : "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelledBy: adminUser.email,
        cancellationReason: order.cancellationRequestReason,
        refundedToWallet: walletRefunded,
        refundAmount: walletRefunded ? refundAmount : 0,
        cancellationRequested: false,
      })
      .commit();

    // Send notification to customer
    try {
      await sendOrderStatusNotification({
        clerkUserId: order.clerkUserId,
        orderNumber: order.orderNumber,
        orderId: order._id,
        status: "cancelled",
      });
    } catch (notificationError) {
      console.error(
        "Failed to send cancellation notification:",
        notificationError
      );
    }

    revalidatePath("/admin/orders");
    revalidatePath("/user/orders");

    const message = shouldRefund
      ? `Cancellation approved. $${refundAmount.toFixed(
          2
        )} has been credited to the customer's wallet.`
      : "Cancellation approved successfully.";

    return { success: true, message };
  } catch (error) {
    console.error("Error approving cancellation request:", error);
    return {
      success: false,
      message: "Failed to approve cancellation request",
    };
  }
}

/**
 * Admin: Reject cancellation request and proceed with order confirmation
 */
export async function rejectCancellationRequest(
  orderId: string,
  rejectionReason?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: "Unauthorized" };
    }

    // Verify admin status - check both database field and environment variable
    const adminUser = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]{ email, isAdmin }`,
      { clerkUserId }
    );

    if (!isAdmin(adminUser)) {
      return {
        success: false,
        message: "Admin access required to reject cancellation requests",
      };
    }

    // Fetch order details
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        status,
        cancellationRequested,
        clerkUserId
      }`,
      { orderId }
    );

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    if (!order.cancellationRequested) {
      return {
        success: false,
        message: "No cancellation request found for this order",
      };
    }

    // Update order - clear cancellation request and confirm the order
    await backendClient
      .patch(orderId)
      .set({
        cancellationRequested: false,
        cancellationRequestedAt: null,
        cancellationRequestReason: null,
        status: "confirmed",
        orderConfirmedBy: adminUser.email,
        orderConfirmedAt: new Date().toISOString(),
      })
      .commit();

    // Send notification to customer
    try {
      await sendOrderStatusNotification({
        clerkUserId: order.clerkUserId,
        orderNumber: order.orderNumber,
        orderId: order._id,
        status: "confirmed",
        previousStatus: order.status,
      });
    } catch (notificationError) {
      console.error(
        "Failed to send confirmation notification:",
        notificationError
      );
    }

    revalidatePath("/admin/orders");
    revalidatePath("/user/orders");

    return {
      success: true,
      message: rejectionReason
        ? `Cancellation request rejected: ${rejectionReason}. Order confirmed.`
        : "Cancellation request rejected. Order confirmed and will be processed.",
    };
  } catch (error) {
    console.error("Error rejecting cancellation request:", error);
    return { success: false, message: "Failed to reject cancellation request" };
  }
}

/**
 * Admin: Cancel order and refund to wallet if paid
 */
export async function cancelOrder(
  orderId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: "Unauthorized" };
    }

    // Verify admin status - check both database field and environment variable
    const adminUser = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]{ email, isAdmin }`,
      { clerkUserId }
    );

    if (!isAdmin(adminUser)) {
      return {
        success: false,
        message: "Admin access required to cancel orders",
      };
    }

    // Fetch order details
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        status,
        paymentStatus,
        totalPrice,
        amountPaid,
        paymentMethod,
        clerkUserId
      }`,
      { orderId }
    );

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    if (order.status === "cancelled") {
      return { success: false, message: "Order is already cancelled" };
    }

    if (order.status === "delivered") {
      return {
        success: false,
        message:
          "Cannot cancel delivered orders. Please process a return instead.",
      };
    }

    // Determine refund amount
    let refundAmount = 0;
    let shouldRefund = false;

    // For paid orders, use amountPaid if available, otherwise use totalPrice
    if (order.paymentStatus === "paid") {
      refundAmount = order.amountPaid || order.totalPrice || 0;
      shouldRefund = refundAmount > 0;
    }

    // Add refund to wallet if payment was made
    let walletRefunded = false;
    if (shouldRefund && refundAmount > 0) {
      const refundResult = await addWalletCredit(
        order.clerkUserId,
        refundAmount,
        `Refund for cancelled order #${order.orderNumber}`,
        orderId,
        adminUser.email
      );

      if (refundResult.success) {
        walletRefunded = true;
      } else {
        console.error("Failed to add refund to wallet:", refundResult.message);
      }
    }

    // Update order status
    await backendClient
      .patch(orderId)
      .set({
        status: "cancelled",
        paymentStatus: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelledBy: adminUser.email,
        cancellationReason: reason,
        refundedToWallet: walletRefunded,
        refundAmount: walletRefunded ? refundAmount : 0,
      })
      .commit();

    // Send notification to customer
    try {
      await sendOrderStatusNotification({
        clerkUserId: order.clerkUserId,
        orderNumber: order.orderNumber,
        orderId: order._id,
        status: "cancelled",
      });
    } catch (notificationError) {
      console.error(
        "Failed to send cancellation notification:",
        notificationError
      );
    }

    const message = shouldRefund
      ? `Order cancelled successfully. $${refundAmount.toFixed(
          2
        )} has been credited to the customer's wallet.`
      : "Order cancelled successfully.";

    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      message: "Failed to cancel order",
    };
  }
}

/**
 * User: Request order cancellation (before shipping)
 * Sets cancellationRequested flag for admin approval
 */
export async function requestOrderCancellation(
  orderId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: "Unauthorized" };
    }

    // Get order details
    const order = await backendClient.fetch(
      `*[_type == "order" && _id == $orderId && clerkUserId == $clerkUserId][0]{
        _id,
        orderNumber,
        status,
        paymentStatus,
        totalPrice,
        amountPaid,
        paymentMethod,
        cancellationRequested
      }`,
      { orderId, clerkUserId }
    );

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    // Check if order can be cancelled
    if (order.status === "cancelled") {
      return { success: false, message: "Order is already cancelled" };
    }

    if (order.cancellationRequested) {
      return {
        success: false,
        message: "Cancellation request already pending admin approval",
      };
    }

    if (order.status === "delivered") {
      return {
        success: false,
        message:
          "Cannot cancel delivered orders. Please contact support for returns.",
      };
    }

    if (order.status === "shipped" || order.status === "out_for_delivery") {
      return {
        success: false,
        message:
          "Order is already shipped. Please contact support to process cancellation.",
      };
    }

    // For pending orders, set cancellation request flag for admin approval
    await backendClient
      .patch(orderId)
      .set({
        cancellationRequested: true,
        cancellationRequestedAt: new Date().toISOString(),
        cancellationRequestReason: reason,
      })
      .commit();

    return {
      success: true,
      message:
        "Cancellation request submitted. Our team will review and process your request shortly.",
    };
  } catch (error) {
    console.error("Error requesting order cancellation:", error);
    return {
      success: false,
      message: "Failed to submit cancellation request",
    };
  }
}
