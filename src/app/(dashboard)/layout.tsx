
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
  const [isLecturer, setIsLecturer] = useState(false)

  useEffect(() => {
    // Determine if the user is a lecturer based on path or persisted role
    const hasLecturerPath = pathname.includes('/lecturer')
    const savedRole = typeof window !== 'undefined' ? localStorage.getItem('vani-role') : null
    
    setIsLecturer(hasLecturerPath || savedRole === 'lecturer')
  }, [pathname])

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-md mx-auto w-full px-4 pt-8 animate-in fade-in duration-500">
        {children}
      </main>
      {isLecturer ? <LecturerNav /> : <BottomNav />}
    </div>
  )
}
