"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  User,
  Bell,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    title: "Orders",
    href: "/user/orders",
    icon: Package,
    description: "Track your orders",
  },
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
    description: "Personal information",
  },
  {
    title: "Notifications",
    href: "/user/notifications",
    icon: Bell,
    description: "Updates & alerts",
  },
  {
    title: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    description: "Saved items",
  },
  {
    title: "Settings",
    href: "/user/settings",
    icon: Settings,
    description: "Account preferences",
  },
];

const adminItems = [
  {
    title: "Manage Users",
    href: "/user/admin/manage-users",
    icon: Users,
    description: "User premium status",
  },
  {
    title: "Premium Accounts",
    href: "/user/admin/premium-accounts",
    icon: Shield,
    description: "Premium approvals",
  },
  {
    title: "Business Accounts",
    href: "/user/admin/business-accounts",
    icon: Building2,
    description: "Business approvals",
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen pb-10 pt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 selection:bg-shop_light_green/20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Header (Keep for mobile visibility) */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border border-gray-100/50 backdrop-blur-sm sticky top-20 z-40">
              <div className="flex items-center space-x-3">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-shop_light_green/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-shop_light_green/10 flex items-center justify-center text-shop_dark_green font-bold text-lg">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-gray-900 leading-tight">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Dashboard</p>
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
            "lg:w-80 lg:block lg:shrink-0 transition-all duration-300 z-50",
            sidebarOpen ? "fixed inset-0 z-50 lg:static" : "hidden"
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
              {/* Profile Card Header */}
              <div className="relative p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-shop_light_green/10 to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-shop_light_green/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-shop_light_green to-shop_dark_green flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                        {user?.firstName?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Active"></div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 px-4 truncate max-w-full">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-6 border-shop_light_green/30 text-shop_dark_green hover:bg-shop_light_green/5 hover:text-shop_dark_green"
                    asChild
                  >
                    <Link href="/user/profile">Edit Profile</Link>
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] lg:max-h-none custom-scrollbar">
                <div className="space-y-1">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Menu
                  </p>
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
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

                {/* Admin Tools Section */}
                {user?.emailAddresses?.[0]?.emailAddress === "sajidmahamud835@gmail.com" && (
                  <div className="mt-8 space-y-1">
                    <p className="px-4 py-2 text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Admin Tools</span>
                      <Shield className="w-3 h-3" />
                    </p>
                    {adminItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                            isActive
                              ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                              : "text-gray-600 hover:bg-red-50 hover:text-red-700"
                          )}
                        >
                          <item.icon className={cn(
                            "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-red-500"
                          )} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
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
                  <span className="font-medium">Sign Out</span>
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 min-h-[500px]">
              {/* Content Overlay Fade (Optional aesthetic) */}
              <div className="p-6 lg:p-10 animate-fade-in">
                {children}
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
