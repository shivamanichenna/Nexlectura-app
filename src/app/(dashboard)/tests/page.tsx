
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
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw
} from "lucide-react"
import { generateDynamicQuiz, type GenerateDynamicQuizOutput } from "@/ai/flows/dynamic-ai-quizzes"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export default function AssessmentsPage() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<GenerateDynamicQuizOutput | null>(null)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleGenerateQuiz = async () => {
    setIsGenerating(true)
    setQuizQuestions(null)
    setIsFinished(false)
    setCurrentQuestionIdx(0)
    setScore(0)
    
    try {
      const questions = await generateDynamicQuiz({
        weakTopics: ["Macro-Dynamics", "Inflation calculations"],
        conceptsToCover: ["CPI vs WPI", "Demand-pull inflation"],
        numberOfQuestions: 5,
        language: "English"
      })
      setQuizQuestions(questions)
      toast({
        title: "Quiz Ready!",
        description: "Vani has prepared 5 questions tailored to your progress.",
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not connect to AI. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return // Prevent multiple selections
    setSelectedAnswer(option)
    setShowExplanation(true)
    
    if (option === quizQuestions![currentQuestionIdx].correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)
    if (currentQuestionIdx < quizQuestions!.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const resetQuiz = () => {
    setQuizQuestions(null)
    setIsFinished(false)
    setCurrentQuestionIdx(0)
    setScore(0)
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Assessments</h1>
        <Badge className="bg-primary/10 text-primary border-none rounded-lg py-1 px-3 font-bold">8.4 CGPA</Badge>
      </div>

      {!quizQuestions && !isFinished && (
        <>
          <Card className="bg-secondary text-white rounded-3xl overflow-hidden relative shadow-2xl">
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
            <div className="p-10 text-center border-2 border-dashed rounded-3xl text-muted-foreground bg-muted/5">
               <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-20" />
               <p className="text-sm font-medium">Get a personalized AI test based on your weak topics.</p>
            </div>
          </div>
        </>
      )}

      {quizQuestions && !isFinished && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center px-1">
             <div className="space-y-1">
               <p className="text-[10px] font-bold text-muted-foreground uppercase">Question {currentQuestionIdx + 1} of {quizQuestions.length}</p>
               <h4 className="text-sm font-bold text-secondary">Dynamic Practice Session</h4>
             </div>
             <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Score: {score}</Badge>
          </div>

          <Progress value={((currentQuestionIdx + 1) / quizQuestions.length) * 100} className="h-2 bg-muted" />

          <Card className="rounded-[2rem] border-2 border-muted overflow-hidden bg-white shadow-xl">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-lg font-headline font-bold text-secondary leading-tight">
                {quizQuestions[currentQuestionIdx].question}
              </h3>
              
              <div className="grid gap-3">
                {quizQuestions[currentQuestionIdx].options.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === quizQuestions[currentQuestionIdx].correctAnswer;
                  
                  let variantStyles = "bg-muted/30 border-transparent text-secondary";
                  if (selectedAnswer) {
                    if (isCorrect) variantStyles = "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-200";
                    else if (isSelected) variantStyles = "bg-destructive text-white border-destructive shadow-lg shadow-destructive-200";
                  }

                  return (
                    <button 
                      key={i} 
                      onClick={() => handleAnswerSelect(option)}
                      disabled={!!selectedAnswer}
                      className={`w-full p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all flex items-center justify-between group ${variantStyles} ${!selectedAnswer && 'hover:bg-primary/5 hover:border-primary/20'}`}
                    >
                      {option}
                      {selectedAnswer && isCorrect && <CheckCircle2 className="h-5 w-5" />}
                      {selectedAnswer && isSelected && !isCorrect && <XCircle className="h-5 w-5" />}
                    </button>
                  )
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Vani's Explanation</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    {quizQuestions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedAnswer && (
            <Button 
              onClick={handleNextQuestion}
              size="lg"
              className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 group"
            >
              {currentQuestionIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      )}

      {isFinished && (
        <div className="flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500 py-10">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
              <Trophy className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold text-secondary">Session Complete!</h2>
            <p className="text-muted-foreground">You scored <span className="text-primary font-bold">{score}</span> out of <span className="font-bold">{quizQuestions?.length}</span></p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <Button onClick={resetQuiz} size="lg" className="w-full h-14 rounded-2xl font-bold gap-2">
              <RotateCcw className="h-5 w-5" />
              Try Another Set
            </Button>
            <Button variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground font-bold">
              Review Mistakes
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h3 className="font-headline font-bold text-lg">Official Mock Tests</h3>
        <div className="space-y-3">
          {[
            { title: "Macroeconomics Mid-Term", subject: "Economics", questions: 30, time: "45 min", type: "Weekly Mock" },
            { title: "Introduction to Calculus", subject: "Mathematics", questions: 20, time: "30 min", type: "Practice" },
          ].map((test, idx) => (
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

      <div className="p-5 bg-destructive/5 rounded-3xl border border-destructive/10 flex gap-4">
         <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
         <div className="space-y-1">
            <h4 className="font-bold text-secondary text-sm">Mistake Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In your last Mock, you lost points in <span className="text-destructive font-bold">Macro-Dynamics</span>. Vani has updated your study path.
            </p>
         </div>
      </div>
    </div>
  )
}
