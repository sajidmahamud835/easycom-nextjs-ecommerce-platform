"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddAddressSidebarProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddressAdded?: (address?: any) => Promise<void>;
  isFirstAddress?: boolean;
}

export function AddAddressSidebar({
  userEmail,
  isOpen,
  onClose,
  onAddressAdded,
  isFirstAddress = false,
}: AddAddressSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: isFirstAddress, // First address is default by default
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      try {
        // Use API route instead of server action for better error handling
        const response = await fetch("/api/user/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create address");
        }

        const data = await response.json();
        toast.success("Address saved successfully!");
        setFormData({
          name: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          isDefault: false,
        });
        onClose();

        // Call the callback to refresh addresses if provided
        if (onAddressAdded) {
          await onAddressAdded(data.address);
        } else {
          // Fallback to page refresh if no callback provided
          window.location.reload();
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add address"
        );
        console.error("Address creation error:", error);
      }
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isFirstAddress ? "Add Your First Address" : "Add New Address"}
          </SheetTitle>
          <SheetDescription>
            Add a shipping address to {userEmail}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full px-3">
          <div className="flex-1 space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Address Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Home, Work, Office"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Street Address *
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street, Apt 4B"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={isPending}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="state"
                  placeholder="NY"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) =>
                    handleInputChange("state", e.target.value.toUpperCase())
                  }
                  disabled={isPending}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip" className="text-sm font-medium">
                ZIP Code *
              </Label>
              <Input
                id="zip"
                placeholder="12345"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                disabled={isPending}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  handleInputChange("isDefault", e.target.checked)
                }
                disabled={isPending || isFirstAddress}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isDefault" className="text-sm">
                {isFirstAddress
                  ? "This will be your default address"
                  : "Set as default address"}
              </Label>
            </div>
          </div>

          <SheetFooter className="flex-shrink-0">
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                disabled={isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Address"
                )}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
