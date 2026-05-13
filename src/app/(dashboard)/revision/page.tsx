
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCcw, ThumbsUp, ThumbsDown, Brain, Flame, Info, Loader2 } from "lucide-react"
import { generateFlashcards, type AIGeneratedFlashcardsOutput } from "@/ai/flows/ai-generated-flashcards"

export default function RevisionHub() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [flashcards, setFlashcards] = useState<AIGeneratedFlashcardsOutput['flashcards']>([
    { question: "What is the Law of Demand?", answer: "As price increases, quantity demanded decreases (ceteris paribus)." },
    { question: "Define Inflation.", answer: "A general increase in prices and fall in the purchasing value of money." },
    { question: "What is GDP?", answer: "Gross Domestic Product - the total value of goods and services produced in a country." }
  ])

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      const response = await generateFlashcards({
        lectureText: "The Demand Curve shifts due to factors like income, tastes, and expectations. Elasticity measures responsiveness. Perfect competition involves many buyers and sellers."
      })
      setFlashcards(response.flashcards)
      setCurrentCard(0)
      setIsFlipped(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

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

      {/* Header Actions */}
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-secondary">AI Personalization</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Based on weak topics</p>
        </div>
        <Button 
          size="sm" 
          onClick={handleGenerateAI} 
          disabled={isGenerating}
          className="rounded-xl h-10 font-bold gap-2 shadow-lg shadow-primary/20"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Refresh Cards
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-muted-foreground">
           <span>Card {currentCard + 1}/{flashcards.length}</span>
           <span>82% Mastery</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
           <div className="h-full bg-primary" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard Component */}
      <div className="perspective-1000 h-[380px] w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* Front */}
          <Card className="absolute inset-0 w-full h-full bg-white [backface-visibility:hidden] rounded-[2.5rem] border-2 shadow-xl flex flex-col items-center justify-center p-8 text-center">
            <Badge variant="outline" className="absolute top-6 left-6 text-primary border-primary font-bold">Question</Badge>
            <h2 className="text-2xl font-headline font-bold text-secondary leading-tight">
              {flashcards[currentCard].question}
            </h2>
            <div className="absolute bottom-6 text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <RefreshCcw className="h-3 w-3" />
              Tap to Flip
            </div>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 w-full h-full bg-primary text-white [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center">
            <Badge variant="outline" className="absolute top-6 left-6 text-white border-white font-bold">Answer</Badge>
            <h2 className="text-lg font-medium leading-relaxed">
              {flashcards[currentCard].answer}
            </h2>
            <div className="absolute bottom-6 text-white/60 text-xs font-bold uppercase tracking-widest">
              Tap to see question
            </div>
          </Card>
        </div>
      </div>

      {/* Rating Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" size="lg" className="h-16 rounded-2xl border-2 border-destructive/20 text-destructive hover:bg-destructive/5 gap-2 font-bold" onClick={nextCard}>
          <ThumbsDown className="h-5 w-5" />
          Still Learning
        </Button>
        <Button variant="outline" size="lg" className="h-16 rounded-2xl border-2 border-green-500/20 text-green-500 hover:bg-green-500/5 gap-2 font-bold" onClick={nextCard}>
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
               <p className="text-[10px] text-muted-foreground uppercase font-bold">Mastered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none bg-primary/5">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <div className="space-y-0.5">
               <p className="text-lg font-bold text-secondary">{flashcards.length}</p>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">Active Cards</p>
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
