
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ClipboardCheck, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Trophy,
  AlertCircle,
  Sparkles,
  Loader2
} from "lucide-react"
import { generateDynamicQuiz, type GenerateDynamicQuizOutput } from "@/ai/flows/dynamic-ai-quizzes"

export default function AssessmentsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<GenerateDynamicQuizOutput | null>(null)

  const handleGenerateQuiz = async () => {
    setIsGenerating(true)
    try {
      const questions = await generateDynamicQuiz({
        weakTopics: ["Macro-Dynamics", "Inflation calculations"],
        conceptsToCover: ["CPI vs WPI", "Demand-pull inflation"],
        numberOfQuestions: 5,
        language: "English"
      })
      setQuizQuestions(questions)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const tests = [
    { title: "Macroeconomics Mid-Term", subject: "Economics", questions: 30, time: "45 min", type: "Weekly Mock" },
    { title: "Introduction to Calculus", subject: "Mathematics", questions: 20, time: "30 min", type: "Practice" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Assessments</h1>
        <Badge className="bg-primary/10 text-primary border-none rounded-lg py-1 px-3 font-bold">8.4 CGPA</Badge>
      </div>

      {/* Readiness Widget */}
      <Card className="bg-secondary text-white rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <CardContent className="p-6 relative z-10 flex items-center justify-between">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="h-4 w-4" />
                Exam Readiness
             </div>
             <h2 className="text-3xl font-headline font-bold">78%</h2>
             <p className="text-white/60 text-sm">You are 12% more prepared than last week.</p>
          </div>
          <div className="h-24 w-24 rounded-full border-8 border-primary/20 flex items-center justify-center">
             <div className="h-full w-full border-t-8 border-primary rounded-full rotate-45 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
             </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Quiz Generator */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">AI Practice Sets</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="text-primary border-primary rounded-xl font-bold gap-2"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate New
          </Button>
        </div>

        {quizQuestions ? (
          <div className="space-y-3">
            {quizQuestions.map((q, idx) => (
              <Card key={idx} className="rounded-2xl border-none bg-accent/30 p-4">
                <p className="font-bold text-sm text-secondary mb-3">Q{idx+1}: {q.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className="text-xs p-2 bg-white rounded-lg border border-border">{opt}</div>
                  ))}
                </div>
              </Card>
            ))}
            <Button className="w-full rounded-xl h-12 font-bold">Start Practice Quiz</Button>
          </div>
        ) : (
          <div className="p-10 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
             <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-20" />
             <p className="text-sm font-medium">Click "Generate New" to get a personalized AI test based on your weak topics.</p>
          </div>
        )}
      </div>

      {/* Upcoming Tests */}
      <div className="space-y-4 pt-4">
        <h3 className="font-headline font-bold text-lg">Official Mock Tests</h3>
        <div className="space-y-3">
          {tests.map((test, idx) => (
            <Card key={idx} className="rounded-2xl border-2 border-muted overflow-hidden hover:border-primary/20 transition-all group">
              <CardContent className="p-0">
                <div className="p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-secondary">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-secondary text-sm">{test.title}</h4>
                       <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 uppercase">{test.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {test.time}</span>
                      <span>•</span>
                      <span>{test.questions} Questions</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mistake Analysis */}
      <div className="p-5 bg-destructive/5 rounded-3xl border border-destructive/10 flex gap-4">
         <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
         <div className="space-y-1">
            <h4 className="font-bold text-secondary text-sm">Mistake Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In your last Mock, you lost points in <span className="text-destructive font-bold">Macro-Dynamics</span>. Vani has updated your study path to fix this.
            </p>
         </div>
      </div>
    </div>
  )
}
