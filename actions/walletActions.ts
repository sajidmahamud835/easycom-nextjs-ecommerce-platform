"use server";

import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";

// Types
interface WalletTransaction {
  id: string;
  type: "credit_refund" | "credit_manual" | "debit_order" | "debit_withdrawal";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  withdrawalRequestId?: string;
  processedBy?: string;
  createdAt: string;
  status: "completed" | "pending" | "failed" | "cancelled";
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  method: "bank" | "paypal" | "stripe" | "check";
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
    swiftCode?: string;
  };
  paypalEmail?: string;
  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "cancelled";
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  notes?: string;
  transactionId?: string;
}

/**
 * Get user's wallet balance
 */
export async function getUserWalletBalance(): Promise<{
  success: boolean;
  balance?: number;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]{ walletBalance }`,
      { clerkUserId: userId }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      balance: user.walletBalance || 0,
    };
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    return { success: false, message: "Failed to fetch wallet balance" };
  }
}

/**
 * Get user's wallet transaction history
 */
export async function getWalletTransactions(): Promise<{
  success: boolean;
  transactions?: WalletTransaction[];
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]{ walletTransactions }`,
      { clerkUserId: userId }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      transactions: user.walletTransactions || [],
    };
  } catch (error) {
    console.error("Error getting wallet transactions:", error);
    return { success: false, message: "Failed to fetch transactions" };
  }
}

/**
 * Deduct amount from wallet (used during checkout)
 */
export async function deductWalletBalance(
  amount: number,
  orderId: string
): Promise<{ success: boolean; message: string; newBalance?: number }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{ 
        _id, 
        walletBalance, 
        walletTransactions 
      }`,
      { userId }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const currentBalance = user.walletBalance || 0;

    if (currentBalance < amount) {
      return {
        success: false,
        message: "Insufficient wallet balance",
      };
    }

    const newBalance = currentBalance - amount;

    // Create transaction record
    const transaction: WalletTransaction = {
      id: uuidv4(),
      type: "debit_order",
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: `Payment for order #${orderId}`,
      orderId,
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    // Update user
    await backendClient
      .patch(user._id)
      .set({
        walletBalance: newBalance,
        walletTransactions: [transaction, ...(user.walletTransactions || [])],
      })
      .commit();

    return {
      success: true,
      message: "Payment deducted from wallet",
      newBalance,
    };
  } catch (error) {
    console.error("Error deducting wallet balance:", error);
    return {
      success: false,
      message: "Failed to deduct from wallet",
    };
  }
}

/**
 * Request withdrawal from wallet
 */
export async function requestWithdrawal(data: {
  amount: number;
  method: "bank" | "paypal" | "stripe" | "check";
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
    swiftCode?: string;
  };
  paypalEmail?: string;
}): Promise<{ success: boolean; message: string; requestId?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    // Validate amount
    if (data.amount <= 0) {
      return { success: false, message: "Invalid amount" };
    }

    // Minimum withdrawal amount
    if (data.amount < 10) {
      return { success: false, message: "Minimum withdrawal amount is $10" };
    }

    const user = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{ 
        _id, 
        walletBalance, 
        withdrawalRequests 
      }`,
      { userId }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const currentBalance = user.walletBalance || 0;

    if (currentBalance < data.amount) {
      return {
        success: false,
        message: `Insufficient balance. Available: $${currentBalance.toFixed(
          2
        )}`,
      };
    }

    // Create withdrawal request
    const withdrawalRequest: WithdrawalRequest = {
      id: uuidv4(),
      amount: data.amount,
      method: data.method,
      bankDetails: data.bankDetails,
      paypalEmail: data.paypalEmail,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    // Add withdrawal request
    await backendClient
      .patch(user._id)
      .set({
        withdrawalRequests: [
          withdrawalRequest,
          ...(user.withdrawalRequests || []),
        ],
      })
      .commit();

    return {
      success: true,
      message:
        "Withdrawal request submitted successfully. It will be processed within 3-5 business days.",
      requestId: withdrawalRequest.id,
    };
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    return {
      success: false,
      message: "Failed to submit withdrawal request",
    };
  }
}

/**
 * Get user's withdrawal requests
 */
export async function getWithdrawalRequests(): Promise<{
  success: boolean;
  requests?: WithdrawalRequest[];
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{ withdrawalRequests }`,
      { userId }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      requests: user.withdrawalRequests || [],
    };
  } catch (error) {
    console.error("Error getting withdrawal requests:", error);
    return { success: false, message: "Failed to fetch withdrawal requests" };
  }
}

/**
 * Cancel withdrawal request (only if pending)
 */
export async function cancelWithdrawalRequest(requestId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $userId][0]{ 
        _id, 
        withdrawalRequests 
      }`,
      { userId }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const requests = user.withdrawalRequests || [];
    const request = requests.find((r: WithdrawalRequest) => r.id === requestId);

    if (!request) {
      return { success: false, message: "Withdrawal request not found" };
    }

    if (request.status !== "pending") {
      return {
        success: false,
        message: `Cannot cancel request with status: ${request.status}`,
      };
    }

    // Update request status to cancelled
    const updatedRequests = requests.map((r: WithdrawalRequest) =>
      r.id === requestId ? { ...r, status: "cancelled" as const } : r
    );

    await backendClient
      .patch(user._id)
      .set({ withdrawalRequests: updatedRequests })
      .commit();

    return {
      success: true,
      message: "Withdrawal request cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling withdrawal request:", error);
    return {
      success: false,
      message: "Failed to cancel withdrawal request",
    };
  }
}
