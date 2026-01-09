"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Tag,
  BarChart3,
  Globe,
  Shield,
  Menu,
  X,
  Star,
  Mail,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Reports & insights",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Customer management",
  },
  {
    title: "Account Requests",
    href: "/admin/account-requests",
    icon: Shield, // Replaced UserCheck with Shield as default icon or import UserCheck
    description: "Approve new accounts",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Inventory management",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag, // Or ShoppingCart
    description: "Track orders",
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star, // Need to import Star
    description: "Customer feedback",
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: Mail, // Need to import Mail
    description: "Email marketing",
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell, // Need to import Bell
    description: "Alerts & updates",
  },
];

export default function AdminSidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border border-gray-100/50 backdrop-blur-sm sticky top-20 z-40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-shop_light_green/10 flex items-center justify-center text-shop_dark_green font-bold text-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-500 font-medium">Store Management</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-shop_light_green/10 text-gray-600 hover:text-shop_dark_green transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={cn(
        "lg:w-72 lg:block lg:shrink-0 transition-all duration-300",
        sidebarOpen ? "fixed inset-0 z-50 lg:static lg:z-auto" : "hidden"
      )}>
        {/* Mobile Overlay */}
        <div
          className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden", sidebarOpen ? "block" : "hidden")}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Content */}
        <div className={cn(
          "bg-white h-full lg:h-auto lg:rounded-3xl lg:shadow-xl lg:sticky lg:top-24 border border-gray-100 overflow-hidden flex flex-col",
          sidebarOpen ? "fixed inset-y-0 left-0 w-80 shadow-2xl z-50" : ""
        )}>
          {/* Admin Profile Header */}
          <div className="relative p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-shop_light_green/10 to-transparent opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-shop_light_green/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Admin Avatar"
                    className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-shop_light_green to-shop_dark_green flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    A
                  </div>
                )}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full place-items-center grid">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {user?.firstName || 'Admin'}
              </h2>
              <p className="text-xs text-gray-500 mb-4 px-4 truncate max-w-full uppercase tracking-wider font-bold">
                Store Administrator
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] lg:max-h-none custom-scrollbar">
            <div className="space-y-1">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Management
              </p>
              {adminItems.map((item) => {
                const isActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin');

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                      isActive
                        ? "bg-shop_dark_green text-white shadow-lg shadow-shop_dark_green/25"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
                      isActive ? "bg-gradient-to-r from-white/10 to-transparent opacity-100" : ""
                    )} />

                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-shop_dark_green"
                    )} />
                    <span className="font-medium relative z-10">{item.title}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-white/80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              onClick={() => signOut()}
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl py-6 group"
            >
              <div className="p-2 rounded-lg bg-gray-200 group-hover:bg-red-100 transition-colors mr-3">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Exit Admin</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
