"use client";

import { useState } from "react";
import { X, Star, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PremiumBannerProps {
  onRegister: () => void;
  onDismiss?: () => void;
}

export default function PremiumBanner({
  onRegister,
  onDismiss,
}: PremiumBannerProps) {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch("/api/user/status", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          data.message || "Successfully registered for premium services!",
          {
            description:
              "Welcome to premium! Enjoy exclusive offers and priority support.",
            duration: 5000,
          }
        );
        onRegister();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to register for premium services");
      }
    } catch (error) {
      console.error("Error registering for premium:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-800 text-white rounded-lg p-4 mb-6 shadow-lg">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
          <Star className="h-6 w-6 text-yellow-300" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Unlock Premium Benefits!
            <Badge
              variant="secondary"
              className="bg-yellow-400 text-yellow-900"
            >
              Free
            </Badge>
          </h3>

          <p className="text-white/90 text-sm mb-4">
            Get access to exclusive offers, priority customer support, early
            access to sales, and personalized recommendations. Join our premium
            community today!
          </p>

          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span>Priority Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-300" />
              <span>Exclusive Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>Early Access</span>
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={isRegistering}
            className="bg-white text-emerald-800 hover:bg-white/90 font-semibold"
          >
            {isRegistering ? "Registering..." : "Apply for Premium Services"}
          </Button>
        </div>
      </div>
    </div>
  );
}
