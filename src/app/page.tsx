"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  // Using state to mock the pagination dots if needed, though the design shows static "Get Started"
  const [step, setStep] = useState(0)

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] p-6 max-w-md mx-auto items-center text-center justify-center">
      {/* 3D Illustration Area */}
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className="bg-[#f5f5f5] w-full rounded-2xl p-8 flex flex-col items-center justify-center mb-10 shadow-sm relative overflow-hidden">
           {/* Nexlectra Logo */}
           <div className="relative w-56 h-56 mb-4 flex items-center justify-center">
             <img src="/logo.png" alt="Nexlectra Logo" className="w-full h-full object-contain drop-shadow-xl" />
           </div>
           <h2 className="text-xl font-bold text-[#8c7a6b] mb-4 tracking-wide uppercase">Learn With AI</h2>
           <div className="bg-[#e6ddcf] text-[#8c7a6b] px-4 py-1.5 rounded-full font-bold text-xs uppercase shadow-inner">
             Get Started
           </div>
        </div>

        <div className="space-y-4 px-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Master Your Future
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
            AI-powered personalized learning paths tailored to your unique goals.
          </p>
        </div>
      </div>

      <div className="w-full pb-8">
        <div className="flex justify-center gap-2 mb-8">
          <div className="h-2 w-8 bg-[#ff6b2b] rounded-full" />
          <div className="h-2 w-2 bg-gray-200 rounded-full" />
          <div className="h-2 w-2 bg-gray-200 rounded-full" />
        </div>

        <Button 
          onClick={() => router.push('/role')} 
          size="lg" 
          className="w-full h-14 rounded-2xl text-lg font-bold bg-[#ff6b2b] hover:bg-[#e85a1c] text-white shadow-lg"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

