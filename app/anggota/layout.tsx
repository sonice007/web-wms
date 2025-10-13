import type React from "react";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <Logo className="justify-center" />
            <p className="text-sm text-muted-foreground">
              Sistem Keanggotaan Digital
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}