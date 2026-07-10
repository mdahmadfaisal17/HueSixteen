"use client";

import Footer from "@/components/Layout/footer/Footer";
import Header from "@/components/Layout/Header";
import GoogleAnalytics from "@/components/commonComponent/GoogleAnalytics";
import ScrollToTop from "@/components/commonComponent/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const publicAdminBase = (process.env.NEXT_PUBLIC_ADMIN_PANEL_PATH || "/admin").replace(/\/+$/, "") || "/admin";
  const isAdminRoute = pathname?.startsWith("/admin") || pathname === publicAdminBase || pathname?.startsWith(`${publicAdminBase}/`);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <SessionProvider>
      {!isAdminRoute && measurementId && <GoogleAnalytics measurementId={measurementId} />}
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <ScrollToTop />}
      {!isAdminRoute && <Footer />}
    </SessionProvider>
  );
}

export default AppShell;