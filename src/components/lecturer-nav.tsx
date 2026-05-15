
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Upload, Users, GraduationCap, BarChart3, UserCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dash", icon: LayoutDashboard, path: "/lecturer" },
  { name: "Classes", icon: GraduationCap, path: "/lecturer/classes" },
  { name: "Upload", icon: Upload, path: "/lecturer/upload" },
  { name: "Stats", icon: BarChart3, path: "/lecturer/insights" },
  { name: "Profile", icon: UserCircle, path: "/profile" },
]

export function LecturerNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary text-white pb-safe pt-2">
      <div className="flex items-center justify-around max-w-lg mx-auto px-4 h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                isActive ? "text-primary scale-110" : "text-white/60 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px] text-primary")} />
              <span className="text-[9px] font-bold tracking-wide uppercase">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
