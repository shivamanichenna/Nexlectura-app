"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, GraduationCap, Zap, Brain } from "lucide-react"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function LandingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const onboardingSteps = [
    {
      title: "Recreating the Classroom Experience with AI",
      description: "Vani AI preserves the magic of a real teacher while giving you the power of personalized AI tools.",
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'onboarding-classroom')?.imageUrl,
    },
    {
      title: "Bilingual Learning Support",
      description: "Switch between Telugu, Hindi, and English seamlessly. AI-generated notes follow your local teaching style.",
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'student-dashboard-hero')?.imageUrl,
    },
    {
      title: "Smart Revision & Doubt Solving",
      description: "Get context-aware summaries and a 24/7 AI Tutor that explains everything in simple language.",
      icon: <Zap className="h-12 w-12 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'lecture-thumbnail')?.imageUrl,
    },
    {
      title: "Personalized Study Path",
      description: "Track your weak topics and master them with AI-generated flashcards and mock tests tailored for you.",
      icon: <Brain className="h-12 w-12 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'ai-tutor-avatar')?.imageUrl,
    }
  ]

  const nextStep = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32 blur-3xl" />

      {step < onboardingSteps.length ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            <div className="z-10 bg-white rounded-3xl shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <Image 
                 src={onboardingSteps[step].image || "https://picsum.photos/seed/placeholder/400/400"} 
                 alt="onboarding" 
                 width={240} 
                 height={240} 
                 className="rounded-2xl"
               />
            </div>
          </div>

          <div className="space-y-4 px-2">
            <div className="flex justify-center mb-2">{onboardingSteps[step].icon}</div>
            <h1 className="text-3xl font-headline font-bold text-secondary leading-tight">
              {onboardingSteps[step].title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {onboardingSteps[step].description}
            </p>
          </div>

          <div className="flex gap-2 mb-12">
            {onboardingSteps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'}`} 
              />
            ))}
          </div>

          <div className="w-full flex flex-col gap-4">
            {step < onboardingSteps.length - 1 ? (
              <Button onClick={nextStep} size="lg" className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20 group">
                Continue
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <Button onClick={() => router.push('/login')} size="lg" className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20">
                  Get Started as Student
                </Button>
                <Button variant="outline" onClick={() => router.push('/home')} className="w-full h-14 rounded-2xl text-lg font-semibold border-2">
                  Continue as Guest
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Lecturer? <button onClick={() => router.push('/login?role=lecturer')} className="text-primary font-bold">Login Here</button>
                </p>
              </div>
            )}
            {step < onboardingSteps.length - 1 && (
              <Button variant="ghost" onClick={() => setStep(onboardingSteps.length - 1)} className="text-muted-foreground font-medium">
                Skip
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
