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
        description: "Nexlectra has prepared 5 questions tailored to your progress.",
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
    <div className="space-y-6 pb-24 font-sans bg-[#fafafa] min-h-screen px-2">
      <div className="flex justify-between items-center py-2 px-1">
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Assessments</h1>
        <Badge className="bg-[#ffebdb] text-[#b04a11] hover:bg-[#ffebdb] border-none rounded-lg py-1 px-3 font-bold">8.4 CGPA</Badge>
      </div>

      {!quizQuestions && !isFinished && (
        <div className="space-y-6 px-1">
          <Card className="bg-[#b04a11] text-white rounded-3xl overflow-hidden relative shadow-lg shadow-[#b04a11]/20 border-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
            <CardContent className="p-6 relative z-10 flex items-center justify-between">
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <TrendingUp className="h-4 w-4" />
                    Exam Readiness
                 </div>
                 <h2 className="text-[40px] font-bold leading-none">78%</h2>
                 <p className="text-white/80 text-sm font-medium">You are 12% more prepared than last week.</p>
              </div>
              <div className="h-20 w-20 rounded-full border-[6px] border-white/20 flex items-center justify-center shrink-0">
                 <div className="h-full w-full border-t-[6px] border-white rounded-full rotate-45 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-white transform -rotate-45" />
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-900">AI Practice Sets</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="text-[#b04a11] border-[#b04a11] hover:bg-[#ffebdb] hover:text-[#b04a11] rounded-xl font-bold gap-2"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate New
              </Button>
            </div>
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm flex flex-col items-center">
               <div className="h-14 w-14 rounded-full bg-[#ffebdb] flex items-center justify-center text-[#b04a11] mb-3">
                 <Sparkles className="h-6 w-6" />
               </div>
               <p className="text-sm font-medium text-gray-500">Get a personalized AI test based on your weak topics.</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-xl text-gray-900">Official Mock Tests</h3>
            <div className="space-y-3">
              {[
                { title: "Macroeconomics Mid-Term", subject: "Economics", questions: 30, time: "45 min", type: "Weekly Mock" },
                { title: "Introduction to Calculus", subject: "Mathematics", questions: 20, time: "30 min", type: "Practice" },
              ].map((test, idx) => (
                <Card key={idx} className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-[#b04a11]/20 transition-all group">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-[#ffebdb] group-hover:text-[#b04a11] transition-colors">
                        <ClipboardCheck className="h-7 w-7" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold text-gray-900 text-[15px]">{test.title}</h4>
                           <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 uppercase bg-gray-100 text-gray-600">{test.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {test.time}</span>
                          <span>•</span>
                          <span>{test.questions} Questions</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-400 group-hover:bg-[#ffebdb] group-hover:text-[#b04a11] transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="p-5 bg-red-50 rounded-3xl border border-red-100 flex gap-4 mt-4">
             <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
             <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Mistake Analysis</h4>
                <p className="text-sm font-medium text-gray-600 leading-relaxed pr-2">
                  In your last Mock, you lost points in <span className="text-red-600 font-bold">Macro-Dynamics</span>. Nexlectra has updated your study path.
                </p>
             </div>
          </div>
        </div>
      )}

      {quizQuestions && !isFinished && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 px-1">
          <div className="flex justify-between items-center">
             <div className="space-y-1">
               <p className="text-[11px] font-bold text-gray-500 uppercase">Question {currentQuestionIdx + 1} of {quizQuestions.length}</p>
               <h4 className="text-sm font-bold text-gray-900">Dynamic Practice Session</h4>
             </div>
             <Badge variant="secondary" className="bg-[#ffebdb] text-[#b04a11] border-none font-bold">Score: {score}</Badge>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b04a11] rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          <Card className="rounded-[2rem] border border-gray-100 overflow-hidden bg-white shadow-md">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-[22px] font-medium text-gray-900 leading-snug">
                {quizQuestions[currentQuestionIdx].question}
              </h3>
              
              <div className="grid gap-3">
                {quizQuestions[currentQuestionIdx].options.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === quizQuestions[currentQuestionIdx].correctAnswer;
                  
                  let variantStyles = "bg-white border-gray-200 text-gray-700";
                  if (selectedAnswer) {
                    if (isCorrect) variantStyles = "bg-green-500 text-white border-green-600 shadow-md shadow-green-500/20";
                    else if (isSelected) variantStyles = "bg-red-500 text-white border-red-600 shadow-md shadow-red-500/20";
                  }

                  return (
                    <button 
                      key={i} 
                      onClick={() => handleAnswerSelect(option)}
                      disabled={!!selectedAnswer}
                      className={`w-full p-4 rounded-2xl text-left text-[15px] font-medium border-2 transition-all flex items-center justify-between group ${variantStyles} ${!selectedAnswer && 'hover:border-gray-300'}`}
                    >
                      <span className="flex-1 pr-4">{option}</span>
                      {selectedAnswer && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                      {selectedAnswer && isSelected && !isCorrect && <XCircle className="h-5 w-5 shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 p-5 bg-[#fafafa] rounded-2xl border border-gray-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b04a11]" />
                  <div className="flex items-center gap-1.5 mb-2 text-[#b04a11]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Nexlectra's Explanation</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
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
              className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-[#b04a11]/20 bg-[#b04a11] hover:bg-[#9a3f0e] text-white text-lg group"
            >
              {currentQuestionIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      )}

      {isFinished && (
        <div className="flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500 py-10 px-4">
          <div className="relative">
            <div className="h-32 w-32 rounded-[2.5rem] bg-[#ffebdb] flex items-center justify-center animate-bounce shadow-sm">
              <Trophy className="h-14 w-14 text-[#b04a11]" />
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 bg-green-500 rounded-full border-[3px] border-white flex items-center justify-center text-white shadow-md">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight">Session Complete!</h2>
            <p className="text-gray-500 font-medium text-[15px]">You scored <span className="text-[#b04a11] font-bold">{score}</span> out of <span className="font-bold">{quizQuestions?.length}</span></p>
          </div>

          <div className="w-full space-y-3">
            <Button onClick={resetQuiz} size="lg" className="w-full h-14 rounded-2xl font-bold gap-2 text-[15px] bg-[#b04a11] hover:bg-[#9a3f0e] text-white shadow-md shadow-[#b04a11]/20">
              <RotateCcw className="h-5 w-5" />
              Try Another Set
            </Button>
            <Button variant="ghost" className="w-full h-14 rounded-2xl text-gray-500 hover:bg-gray-100 font-bold text-[15px]">
              Review Mistakes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
