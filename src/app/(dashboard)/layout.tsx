"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { usePathname } from "next/navigation"
import { LecturerNav } from "@/components/lecturer-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Initialize based on pathname which is stable between server/client
  const [isLecturer, setIsLecturer] = useState(pathname.includes('/lecturer'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Refine role based on local storage only after mounting
    const savedRole = localStorage.getItem('nexlectra-role')
    if (savedRole === 'lecturer' || pathname.includes('/lecturer')) {
      setIsLecturer(true)
    } else {
      setIsLecturer(false)
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-md mx-auto w-full px-4 pt-8 animate-in fade-in duration-500">
        {children}
      </main>
      {/* Render navigation only after mounting to ensure hydration consistency */}
      {mounted && (isLecturer ? <LecturerNav /> : <BottomNav />)}
    </div>
  )
}
