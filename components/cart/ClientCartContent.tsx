"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { ServerCartContent } from "./ServerCartContent";
import { CartSkeleton } from "./CartSkeleton";
import { trackCartView } from "@/lib/analytics";

interface Address {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
}

interface UserOrder {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  currency: string;
  status: string;
  orderDate: string;
  customerName: string;
  email: string;
}

interface UserData {
  addresses: Address[];
  orders: UserOrder[];
}

export function ClientCartContent() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!isLoaded || !user) return;

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      setError("Email not found. Please contact support.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch user data from API endpoint
      const response = await fetch(
        `/api/user-data?email=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  const refreshAddresses = async (newAddress?: Address) => {
    if (!user) return;

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    // If new address is provided, optimize update without fetch
    if (newAddress) {
      setUserData((prev) => {
        if (!prev) return prev;

        let updatedAddresses = [...prev.addresses];

        // If new address is default, uncheck others
        if (newAddress.default) {
          updatedAddresses = updatedAddresses.map(addr => ({
            ...addr,
            default: false
          }));
        }

        // Add new address to the beginning
        updatedAddresses.unshift(newAddress);

        return {
          ...prev,
          addresses: updatedAddresses
        };
      });
      return;
    }

    try {
      // Only fetch addresses to refresh them
      const response = await fetch(
        `/api/user-data?email=${encodeURIComponent(userEmail)}`,
        { headers: { "Cache-Control": "no-cache" } }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh addresses");
      }

      const data = await response.json();
      setUserData((prev) =>
        prev ? { ...prev, addresses: data.addresses } : data
      );
    } catch (err) {
      console.error("Failed to refresh addresses:", err);
      // Don't show error toast for refresh failures
    }
  };

  useEffect(() => {
    fetchUserData();
    // Track cart view
    if (user) {
      trackCartView(user.id);
    }
  }, [user, fetchUserData]);

  if (!isLoaded || loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Please sign in to view your cart.
        </p>
      </div>
    );
  }

  const userEmail = user.emailAddresses[0]?.emailAddress || "";

  return (
    <ServerCartContent
      userEmail={userEmail}
      userAddresses={userData?.addresses || []}
      userOrders={userData?.orders || []}
      onAddressesRefresh={refreshAddresses}
    />
  );
}
