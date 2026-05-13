"use client"

import { BottomNav } from "@/components/bottom-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-md mx-auto w-full px-4 pt-8 animate-in fade-in duration-500">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
