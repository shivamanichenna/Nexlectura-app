
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  RefreshCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Brain, 
  Flame, 
  Info, 
  Loader2,
  BookOpen,
  ArrowRight
} from "lucide-react"
import { generateFlashcards, type AIGeneratedFlashcardsOutput } from "@/ai/flows/ai-generated-flashcards"
import { useFirestore, useCollection } from '@/firebase'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

export default function RevisionHub() {
  const { toast } = useToast()
  const db = useFirestore()
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Default cards
  const [flashcards, setFlashcards] = useState<AIGeneratedFlashcardsOutput['flashcards']>([
    { question: "What is the Law of Demand?", answer: "As price increases, quantity demanded decreases (ceteris paribus)." },
    { question: "Define Inflation.", answer: "A general increase in prices and fall in the purchasing value of money." },
    { question: "What is GDP?", answer: "Gross Domestic Product - the total value of goods and services produced in a country." }
  ])

  // Fetch recent lecture context for smart generation
  const recentLecturesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'lectures'), orderBy('createdAt', 'desc'), limit(1));
  }, [db]);

  const { data: recentLectures } = useCollection(recentLecturesQuery);

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      const context = recentLectures?.[0]?.transcript || "The Demand Curve shifts due to factors like income, tastes, and expectations.";
      const response = await generateFlashcards({ lectureText: context })
      
      if (response.flashcards?.length > 0) {
        setFlashcards(response.flashcards)
        setCurrentCard(0)
        setIsFlipped(false)
        toast({
          title: "Flashcards Refreshed!",
          description: `Generated from: ${recentLectures?.[0]?.title || 'Recent Topics'}`,
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Generation Snag",
        description: "Vani AI couldn't generate cards. Check your connection.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const nextCard = (mastered: boolean) => {
    if (mastered) {
      toast({
        title: "Mastered!",
        description: "Card marked as learned. Spaced repetition updated.",
      })
    }
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentCard((currentCard + 1) % flashcards.length)
    }, 150)
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Revision Hub</h1>
        <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
           <Flame className="h-4 w-4 fill-current" />
           <span className="text-sm font-bold">12 Day Streak</span>
        </div>
      </div>

      {/* Header Actions */}
      <Card className="rounded-[2rem] border-none bg-primary shadow-xl shadow-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <CardContent className="p-6 relative z-10 flex items-center justify-between text-white">
          <div className="space-y-1">
            <h4 className="font-bold text-lg">AI Spaced Repetition</h4>
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Personalized for you</p>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handleGenerateAI} 
            disabled={isGenerating}
            className="rounded-xl h-11 font-bold gap-2 px-4 shadow-lg"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Refresh Hub
          </Button>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="space-y-2 px-1">
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
           <span>Card {currentCard + 1} of {flashcards.length}</span>
           <span>82% Overall Mastery</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
           <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard Component */}
      <div className="perspective-1000 h-[380px] w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* Front */}
          <Card className="absolute inset-0 w-full h-full bg-white [backface-visibility:hidden] rounded-[2.5rem] border-2 shadow-xl flex flex-col items-center justify-center p-8 text-center border-muted">
            <Badge variant="outline" className="absolute top-8 left-8 text-primary border-primary font-bold px-3 py-1 rounded-lg">Question</Badge>
            <h2 className="text-2xl font-headline font-bold text-secondary leading-tight px-2">
              {flashcards[currentCard].question}
            </h2>
            <div className="absolute bottom-8 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <RefreshCcw className="h-3.5 w-3.5" />
              Tap to reveal answer
            </div>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 w-full h-full bg-secondary text-white [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center shadow-2xl">
            <Badge variant="outline" className="absolute top-8 left-8 text-primary border-primary font-bold px-3 py-1 rounded-lg bg-primary/5">Vani's Answer</Badge>
            <h2 className="text-lg font-medium leading-relaxed italic text-white/90">
              "{flashcards[currentCard].answer}"
            </h2>
            <div className="absolute bottom-8 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              Tap to see question
            </div>
          </Card>
        </div>
      </div>

      {/* Rating Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="h-16 rounded-2xl border-2 border-destructive/20 text-destructive hover:bg-destructive/5 gap-2 font-bold transition-all active:scale-95" 
          onClick={() => nextCard(false)}
        >
          <ThumbsDown className="h-5 w-5" />
          Still Learning
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="h-16 rounded-2xl border-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10" 
          onClick={() => nextCard(true)}
        >
          <ThumbsUp className="h-5 w-5" />
          Got It!
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-2xl border-none bg-blue-50/50 p-5 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
            <Brain className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
             <p className="text-xl font-bold text-secondary">248</p>
             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Mastered Concepts</p>
          </div>
        </Card>
        <Card className="rounded-2xl border-none bg-primary/5 p-5 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
             <p className="text-xl font-bold text-secondary">{flashcards.length}</p>
             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Active Topics</p>
          </div>
        </Card>
      </div>

      {/* Context info */}
      <div className="bg-secondary p-6 rounded-[2.5rem] text-white flex items-start gap-4 relative overflow-hidden">
         <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
         <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
         <div className="space-y-2 relative z-10">
           <p className="text-sm leading-relaxed text-white/90">
             <span className="font-bold text-primary">Vani's Pro-Tip:</span> Revisiting difficult cards at bedtime increases retention by 30%.
           </p>
           <Button variant="link" className="text-primary font-bold p-0 text-xs h-auto group">
             Learn about Spaced Repetition <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
           </Button>
         </div>
      </div>
    </div>
  )
}
