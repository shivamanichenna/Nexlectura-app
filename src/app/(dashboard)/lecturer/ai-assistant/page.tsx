
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, FileText, ClipboardCheck, Lightbulb, Wand2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LecturerAIAssistant() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleQuickAction = (action: string) => {
    setPrompt(action)
  }

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    
    // Simulate AI Generation for Lecturer Tools
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Content Generated!",
        description: "Your requested material is ready and added to your library.",
      })
      setPrompt("")
    }, 2000)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-headline font-bold text-secondary">AI Classroom Assistant</h1>
        <p className="text-sm text-muted-foreground">Automate your teaching workflow with Vani AI.</p>
      </div>

      {/* Quick Tools Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: FileText, label: "Create Assignment", prompt: "Generate a 3-question assignment on Money Multiplier for 2nd year students." },
          { icon: ClipboardCheck, label: "Generate Quiz", prompt: "Create a 5-question MCQ quiz on CRR vs SLR dynamics." },
          { icon: Lightbulb, label: "Exam Questions", prompt: "Suggest 5 important long-answer questions for the upcoming Macroeconomics mid-term." },
          { icon: Wand2, label: "Summarize PDF", prompt: "Create a 200-word summary of the recently uploaded Banking Case Study." },
        ].map((tool, idx) => (
          <Card 
            key={idx} 
            className="rounded-2xl border-none bg-accent/30 p-4 cursor-pointer hover:bg-accent/50 transition-colors group"
            onClick={() => handleQuickAction(tool.prompt)}
          >
            <tool.icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-secondary uppercase leading-tight block">{tool.label}</span>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="rounded-[2.5rem] border-2 border-muted overflow-hidden bg-white shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-secondary">Vani for Lecturers</h3>
          </div>
          
          <Textarea 
            placeholder="E.g., 'Generate an assignment based on my last lecture' or 'Who are the bottom 5 performers in Class CSE-A?'"
            className="min-h-[120px] rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <Button 
            className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Vani is Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask Assistant
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent AI Outputs */}
      <div className="space-y-4 pt-2">
        <h3 className="font-headline font-bold text-lg">Recent AI Tasks</h3>
        {[
          { title: "Weekly Quiz: Inflation", type: "Quiz", date: "2h ago" },
          { title: "Notes: CRR vs SLR", type: "Revision", date: "Yesterday" },
        ].map((task, i) => (
          <Card key={i} className="rounded-2xl border-none bg-muted/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
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
    </div>
  )
}
