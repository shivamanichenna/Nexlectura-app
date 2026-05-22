"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, Sparkles, Layers, BarChart2, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Learn", icon: GraduationCap, path: "/study" },
  { name: "AI Coach", icon: Sparkles, path: "/chat" },
  { name: "Flashcards", icon: Layers, path: "/revision" },
  { name: "Insights", icon: BarChart2, path: "/home" },
  { name: "Profile", icon: User, path: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fafafa] border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 h-16 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          
          if (item.name === "Learn" || isActive) {
            // Wait, in course_explorer 'Learn' is active and it is an orange circle! 
            // In the UI, the active item has the orange circle.
            // Let's make the active item an orange circle.
          }
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200 group",
                isActive ? "-mt-6" : "mt-2"
              )}
            >
              {isActive ? (
                 <div className="flex flex-col items-center justify-center">
                   <div className="h-14 w-14 rounded-full bg-[#ff6b2b] text-white flex items-center justify-center shadow-lg shadow-[#ff6b2b]/30 group-hover:scale-105 transition-transform border-4 border-[#fafafa]">
                     <item.icon className="h-6 w-6 fill-white text-white" />
                   </div>
                   <span className="text-[10px] font-medium tracking-wide mt-1 text-gray-800">{item.name}</span>
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <item.icon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  <span className="text-[10px] font-medium tracking-wide text-gray-400">{item.name}</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
