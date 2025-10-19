"use client";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import TourSection from "@/components/tour-section";

export default function Page() {
  return (
    <div className="relative">
      {/* Fixed Background - Luôn hiển thị để tránh nhấp nháy */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 -z-10" />

      {/* Fixed Header */}
      <Header />

      {/* Hero Banner - Full screen */}
      <HeroBanner />

      {/* 3D Tour Section - Kích hoạt sau khi scroll qua hero */}
      <TourSection />
    </div>
  );
}
