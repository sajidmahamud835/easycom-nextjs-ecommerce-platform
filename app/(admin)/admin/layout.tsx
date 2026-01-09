"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useIsAdmin } from "@/lib/adminUtils";
import Container from "@/components/Container";
import AdminTopNavigation from "@/components/admin/AdminTopNavigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useIsAdmin(user?.primaryEmailAddress?.emailAddress);

  // Redirect non-admin users
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push("/access-denied");
    }
  }, [isLoaded, isAdmin, router]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop_dark_green"></div>
        </div>
      </Container>
    );
  }

  // If not admin, don't render anything (redirect will happen)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-50 via-white to-gray-50 selection:bg-shop_light_green/20">
      <Header />
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 min-h-[600px] overflow-hidden">
              <div className="p-6 lg:p-10 animate-fade-in">
                {children}
              </div>
            </div>
          </main>
        </div>
      </Container>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
