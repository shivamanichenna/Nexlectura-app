
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Sparkles, ClipboardCheck, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Study", icon: BookOpen, path: "/study" },
  { name: "Revision", icon: Sparkles, path: "/revision" },
  { name: "Inbox", icon: Bell, path: "/notifications" },
  { name: "Profile", icon: User, path: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe pt-2">
      <div className="flex items-center justify-around max-w-lg mx-auto px-4 h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[9px] font-bold tracking-tight uppercase">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
