"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useUserData } from "@/contexts/UserDataContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NotificationBell() {
  const { isSignedIn } = useUser();
  const { unreadNotifications } = useUserData();

  if (!isSignedIn) {
    return null;
  }

  const displayCount = unreadNotifications > 9 ? "9+" : unreadNotifications;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/user/notifications"
            className="relative group"
            aria-label={`View notifications${unreadNotifications > 0 ? `, ${unreadNotifications} unread` : ""}`}
          >
            <Bell className="text-shop_dark_green/80 group-hover:text-shop_dark_green hoverEffect" />
            <span
              className={`absolute -top-1 -right-1 bg-shop_btn_dark_green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px] h-[14px] ${
                unreadNotifications > 9 ? "px-1" : ""
              }`}
            >
              {displayCount}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>View notifications</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
