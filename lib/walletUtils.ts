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

/**
 * Add credit to user wallet (used for refunds)
 * This is an internal utility function, not a server action.
 * It should only be called by trusted server-side code (admins, system events).
 */
export async function addWalletCredit(
  userId: string,
  amount: number,
  description: string,
  orderId?: string,
  processedBy?: string
): Promise<{ success: boolean; message: string; newBalance?: number }> {
  try {
    // Get user's current balance
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
    const newBalance = currentBalance + amount;

    // Create transaction record
    const transaction: WalletTransaction = {
      id: uuidv4(),
      type: "credit_refund",
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description,
      orderId,
      processedBy,
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    // Update user with new balance and transaction
    await backendClient
      .patch(user._id)
      .set({
        walletBalance: newBalance,
        walletTransactions: [transaction, ...(user.walletTransactions || [])],
      })
      .commit();

    return {
      success: true,
      message: "Credit added successfully",
      newBalance,
    };
  } catch (error) {
    console.error("Error adding wallet credit:", error);
    return {
      success: false,
      message: "Failed to add credit to wallet",
    };
  }
}
