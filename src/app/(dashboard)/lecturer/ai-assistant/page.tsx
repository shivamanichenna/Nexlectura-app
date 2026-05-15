
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, FileText, ClipboardCheck, Lightbulb, Wand2, Loader2, BookOpen, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateDynamicQuiz } from "@/ai/flows/dynamic-ai-quizzes"
import { autoLectureNotesSummary } from "@/ai/flows/auto-lecture-notes-summary-flow"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function LecturerAIAssistant() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState<any>(null)
  const { toast } = useToast()
  const db = useFirestore()

  const lecturesQuery = query(collection(db!, 'lectures'), orderBy('createdAt', 'desc'), limit(5));
  const { data: recentLectures } = useCollection(lecturesQuery);

  const handleQuickAction = async (actionType: 'quiz' | 'summary' | 'assignment') => {
    setIsGenerating(true)
    setOutput(null)
    try {
      const context = recentLectures?.[0]?.transcript || "No recent lecture context found. Using general education patterns.";
      
      if (actionType === 'quiz') {
        const res = await generateDynamicQuiz({
          weakTopics: ["Core Concepts"],
          conceptsToCover: ["Introduction"],
          numberOfQuestions: 3
        })
        setOutput({ type: 'quiz', data: res })
      } else {
        const res = await autoLectureNotesSummary({ lectureTranscript: context })
        setOutput({ type: 'summary', data: res })
      }

      toast({
        title: "Content Generated!",
        description: "Vani AI has prepared the requested material.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Snag",
        description: "Could not generate content right now.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-1 px-1">
        <h1 className="text-2xl font-headline font-bold text-secondary">AI Classroom Assistant</h1>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Automate your teaching workflow</p>
      </div>

      {/* Quick Tools Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: ClipboardCheck, label: "Generate Quiz", type: 'quiz' as const },
          { icon: FileText, label: "Class Summary", type: 'summary' as const },
          { icon: Lightbulb, label: "Exam Prep", type: 'summary' as const },
          { icon: Wand2, label: "Notes Refiner", type: 'summary' as const },
        ].map((tool, idx) => (
          <Card 
            key={idx} 
            className="rounded-[1.5rem] border-2 border-muted bg-white p-4 cursor-pointer hover:border-primary/40 transition-all group shadow-sm"
            onClick={() => handleQuickAction(tool.type)}
          >
            <tool.icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-secondary uppercase leading-tight block">{tool.label}</span>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="rounded-[2.5rem] border-2 border-primary/10 overflow-hidden bg-white shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-secondary text-sm">Vani for Lecturers</h3>
          </div>
          
          <Textarea 
            placeholder="E.g., 'Generate an assignment based on my last lecture'..."
            className="min-h-[100px] rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <Button 
            className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
            onClick={() => handleQuickAction('summary')}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Thinking...</>
            ) : (
              <><Send className="h-4 w-4 mr-2" /> Ask Vani Assistant</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Display */}
      {output && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Generated Output
          </h3>
          <Card className="rounded-[2rem] border-none bg-secondary text-white p-6 shadow-2xl">
            <ScrollArea className="h-[300px] pr-4">
              {output.type === 'quiz' ? (
                <div className="space-y-6">
                  {output.data.map((q: any, i: number) => (
                    <div key={i} className="space-y-2 border-b border-white/10 pb-4">
                      <p className="font-bold text-sm">{i+1}. {q.question}</p>
                      <ul className="text-xs text-white/60 space-y-1 list-disc list-inside">
                        {q.options.map((opt: string, j: number) => <li key={j}>{opt}</li>)}
                      </ul>
                      <p className="text-[10px] text-primary font-bold">Ans: {q.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-primary text-xs uppercase mb-2">Key Points</h4>
                    <ul className="text-xs text-white/70 space-y-2">
                      {output.data.keyPoints.map((p: string, i: number) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-xs uppercase mb-2">Revision Summary</h4>
                    <p className="text-xs text-white/70 leading-relaxed">{output.data.examSummary}</p>
                  </div>
                </div>
              )}
            </ScrollArea>
            <div className="flex gap-2 mt-6">
              <Button className="flex-1 bg-primary h-10 rounded-xl font-bold text-xs">Push to Students</Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white h-10 rounded-xl font-bold text-xs">Download PDF</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Recent AI Tasks */}
      {!output && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline font-bold text-lg">Recent AI Logs</h3>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          {[
            { title: "Weekly Quiz: Inflation", type: "Quiz", date: "2h ago" },
            { title: "Notes: CRR vs SLR", type: "Summary", date: "Yesterday" },
          ].map((task, i) => (
            <Card key={i} className="rounded-2xl border-none bg-white shadow-sm p-4 flex items-center justify-between border-2 border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-secondary">{task.title}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">{task.type} • {task.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-bold">View</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
