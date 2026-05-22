"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, GraduationCap, Sparkles, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/lecturer" },
  { name: "Classes", icon: GraduationCap, path: "/lecturer/classes" },
  { name: "AI Lab", icon: Sparkles, path: "/lecturer/ai-assistant", isSpecial: true },
  { name: "Inbox", icon: Mail, path: "/lecturer/notifications" },
  { name: "Profile", icon: User, path: "/profile" },
]

export function LecturerNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fafafa] border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 h-16 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          
          if (item.isSpecial) {
            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="h-14 w-14 rounded-full bg-[#ff6b2b] text-white flex items-center justify-center shadow-lg shadow-[#ff6b2b]/30 group-hover:scale-105 transition-transform border-4 border-[#fafafa]">
                  <item.icon className="h-6 w-6 fill-white text-white" />
                </div>
                <span className="text-[10px] font-medium tracking-wide mt-1 text-gray-800">{item.name}</span>
              </Link>
            )
          }
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200 mt-2",
                isActive ? "text-gray-900 scale-105" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
