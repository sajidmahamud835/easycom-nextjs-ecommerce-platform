"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useIsAdmin } from "@/lib/adminUtils";
import Container from "@/components/Container";
import AdminTopNavigation from "@/components/admin/AdminTopNavigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen">
      <Header />
      <Container className="py-6">
        <div className="flex flex-col gap-6">
          {/* Top Navigation */}
          <AdminTopNavigation currentPath={pathname} user={user} />

          {/* Main Content */}
          <div className="admin-content-push bg-white rounded-2xl shadow-xl border border-shop_light_green/10 overflow-hidden">
            {children}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminLayout;
