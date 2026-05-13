"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCcw, ThumbsUp, ThumbsDown, Brain, Flame, Info } from "lucide-react"

export default function RevisionHub() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)

  const flashcards = [
    { q: "What is the Law of Demand?", a: "As price increases, quantity demanded decreases (ceteris paribus)." },
    { q: "Define Inflation.", a: "A general increase in prices and fall in the purchasing value of money." },
    { q: "What is GDP?", a: "Gross Domestic Product - the total value of goods and services produced in a country." }
  ]

  const nextCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentCard((currentCard + 1) % flashcards.length)
    }, 150)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Revision Hub</h1>
        <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
           <Flame className="h-4 w-4 fill-current" />
           <span className="text-sm font-bold">12 Day Streak</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-muted-foreground">
           <span>Daily Cards: {currentCard + 1}/{flashcards.length}</span>
           <span>82% Mastery</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
           <div className="h-full bg-primary" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard Component */}
      <div className="perspective-1000 h-[400px] w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* Front */}
          <Card className="absolute inset-0 w-full h-full bg-white [backface-visibility:hidden] rounded-[2.5rem] border-2 shadow-xl flex flex-col items-center justify-center p-8 text-center">
            <Badge variant="outline" className="absolute top-6 left-6 text-primary border-primary">Question</Badge>
            <h2 className="text-2xl font-headline font-bold text-secondary leading-tight">
              {flashcards[currentCard].q}
            </h2>
            <div className="absolute bottom-6 text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <RefreshCcw className="h-3 w-3" />
              Tap to Flip
            </div>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 w-full h-full bg-primary text-white [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center">
            <Badge variant="outline" className="absolute top-6 left-6 text-white border-white">Answer</Badge>
            <h2 className="text-xl font-medium leading-relaxed">
              {flashcards[currentCard].a}
            </h2>
            <div className="absolute bottom-6 text-white/60 text-xs font-bold uppercase tracking-widest">
              Tap to see question
            </div>
          </Card>
        </div>
      </div>

      {/* Rating Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" size="lg" className="h-16 rounded-2xl border-2 border-destructive/20 text-destructive hover:bg-destructive/5 gap-2" onClick={nextCard}>
          <ThumbsDown className="h-5 w-5" />
          Still Learning
        </Button>
        <Button variant="outline" size="lg" className="h-16 rounded-2xl border-2 border-green-500/20 text-green-500 hover:bg-green-500/5 gap-2" onClick={nextCard}>
          <ThumbsUp className="h-5 w-5" />
          Got It!
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-2xl border-none bg-blue-50">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Brain className="h-8 w-8 text-blue-500" />
            <div className="space-y-0.5">
               <p className="text-lg font-bold text-secondary">248</p>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">New Concepts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none bg-primary/5">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <div className="space-y-0.5">
               <p className="text-lg font-bold text-secondary">15</p>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">AI Summaries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tip */}
      <div className="bg-secondary p-5 rounded-3xl text-white flex items-start gap-4">
         <Info className="h-6 w-6 text-primary shrink-0" />
         <p className="text-sm leading-relaxed text-white/80">
           <span className="font-bold text-white">Vani's Advice:</span> Spaced repetition works best if you review these cards every 3 days. Your next set is scheduled for Saturday.
         </p>
      </div>
    </div>
  )
}
