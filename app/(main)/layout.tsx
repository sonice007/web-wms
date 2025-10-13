"use client";

import type React from "react";
import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-lg mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}

