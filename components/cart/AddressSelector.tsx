"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, List } from "lucide-react";
import { AddAddressSidebar } from "./AddAddressSidebar";
import { AddressSelectorSkeleton } from "./CartSkeleton";
import { AllAddressesSidebar } from "./AllAddressesSidebar";

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

interface AddressSelectorProps {
  userEmail: string;
  addresses: Address[];
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
<<<<<<< HEAD
  onAddressesRefresh?: (newAddress?: Address) => Promise<void>;
=======
  onAddressesRefresh?: () => Promise<void>;
>>>>>>> origin/main
}

export function AddressSelector({
  userEmail,
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddressesRefresh,
}: AddressSelectorProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAllAddressesSidebarOpen, setIsAllAddressesSidebarOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_VISIBLE_ADDRESSES = 3;
  const hasMoreAddresses = addresses.length > MAX_VISIBLE_ADDRESSES;
  const visibleAddresses = addresses.slice(0, MAX_VISIBLE_ADDRESSES);

<<<<<<< HEAD
  const handleAddressAdded = async (newAddress?: Address) => {
    if (onAddressesRefresh) {
      setIsLoading(true);
      await onAddressesRefresh(newAddress);
=======
  const handleAddressAdded = async () => {
    if (onAddressesRefresh) {
      setIsLoading(true);
      await onAddressesRefresh();
>>>>>>> origin/main
      setIsLoading(false);
    }
    setIsSidebarOpen(false);
  };

  if (isLoading) {
    return <AddressSelectorSkeleton />;
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </CardTitle>
          <CardDescription>Add a shipping address to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No saved addresses yet</p>
            <Button onClick={() => setIsSidebarOpen(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </div>

          <AddAddressSidebar
            userEmail={userEmail}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onAddressAdded={handleAddressAdded}
            isFirstAddress={true}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Address
        </CardTitle>
        <CardDescription>
          Select a shipping address for your order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAddress?._id || ""}
          onValueChange={(value) => {
            const address = addresses.find((addr) => addr._id === value);
            if (address) onAddressSelect(address);
          }}
        >
          {visibleAddresses.map((address) => (
            <div key={address._id} className="flex items-start space-x-2">
              <RadioGroupItem
                value={address._id}
                id={address._id}
                className="mt-1"
              />
              <Label htmlFor={address._id} className="flex-1 cursor-pointer">
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    {address.name}
                    {address.default && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {address.address}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.zip}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {hasMoreAddresses && (
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={() => setIsAllAddressesSidebarOpen(true)}
          >
            <List className="w-4 h-4 mr-2" />
            Show All {addresses.length} Addresses
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>

        <AddAddressSidebar
          userEmail={userEmail}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onAddressAdded={handleAddressAdded}
        />

        <AllAddressesSidebar
          isOpen={isAllAddressesSidebarOpen}
          onClose={() => setIsAllAddressesSidebarOpen(false)}
          addresses={addresses}
          selectedAddress={selectedAddress}
          onAddressSelect={onAddressSelect}
        />
      </CardContent>
    </Card>
  );
}
