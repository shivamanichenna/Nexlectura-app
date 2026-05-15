
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Pause, 
  Settings, 
  MessageSquare, 
  FileText, 
  Lightbulb, 
  Smile, 
  AlertCircle,
  Languages,
  ChevronLeft,
  Sparkles,
  Loader2,
  RotateCcw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { autoLectureNotesSummary, type AutoLectureNotesSummaryOutput } from "@/ai/flows/auto-lecture-notes-summary-flow"
import { generateLectureBilingualSubtitles, type LectureBilingualSubtitlesOutput } from "@/ai/flows/lecture-bilingual-subtitles"

export default function LecturePlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [bilingual, setBilingual] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiData, setAiData] = useState<AutoLectureNotesSummaryOutput | null>(null)
  const [subtitleData, setSubtitleData] = useState<LectureBilingualSubtitlesOutput | null>(null)

  const rawTranscript = "Today we will explore the fundamental concept of supply and demand. When price goes up, demand usually goes down. This is the law of demand. Think of it like a movie ticket. If it's too expensive, fewer people go. Conversely, when price drops, more people are willing to buy. This inverse relationship is what we call the Demand Curve."

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      const [notes, subtitles] = await Promise.all([
        autoLectureNotesSummary({ lectureTranscript: rawTranscript }),
        generateLectureBilingualSubtitles({
          lectureTranscript: rawTranscript,
          targetLanguage: "Telugu",
          originalLanguage: "English"
        })
      ])
      setAiData(notes)
      setSubtitleData(subtitles)
    } catch (error) {
      console.error("AI Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen -mt-8 -mx-4 bg-secondary">
      {/* Video Player Area */}
      <div className="relative aspect-video bg-black w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/wani-lecture/800/450')] bg-cover opacity-50 blur-sm" />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">Live Support Active</span>
          </div>
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full">
            <Settings />
          </Button>
        </div>

        {/* Play State */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 z-10"
        >
          {isPlaying ? <Pause className="fill-white text-white" /> : <Play className="fill-white text-white translate-x-0.5" />}
        </button>

        {/* Subtitles Overlay */}
        <div className="absolute bottom-12 left-0 right-0 px-6 text-center z-10">
          <div className="bg-black/60 backdrop-blur-sm p-3 rounded-2xl inline-block max-w-[85%] border border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-white font-medium text-sm leading-relaxed">
              {subtitleData?.bilingualSegments[0]?.original || "When price goes up, demand usually goes down."}
            </p>
            {bilingual && (
              <p className="text-primary text-xs font-medium mt-1">
                {subtitleData?.bilingualSegments[0]?.translated || "ధర పెరిగినప్పుడు, సాధారణంగా డిమాండ్ తగ్గుతుంది."}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
          <div className="h-full bg-primary w-[45%]" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-background rounded-t-[2.5rem] mt-[-2.5rem] relative z-20 shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-xl font-headline font-bold text-secondary">Macroeconomics: Supply & Demand</h1>
              <p className="text-sm text-muted-foreground">Prof. S. Murali Krishna • Unit 1</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                variant={bilingual ? "default" : "outline"}
                onClick={() => setBilingual(!bilingual)}
                className="rounded-full h-9 flex gap-2 font-bold"
              >
                <Languages className="h-4 w-4" />
                {bilingual ? "Bilingual On" : "English Only"}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="rounded-full h-9 border-primary text-primary hover:bg-primary/5 font-bold gap-2"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                AI Materials
              </Button>
            </div>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-muted/50 rounded-2xl p-1 h-12">
              <TabsTrigger value="notes" className="rounded-xl flex gap-1.5">
                <FileText className="h-4 w-4" /> Notes
              </TabsTrigger>
              <TabsTrigger value="key" className="rounded-xl flex gap-1.5">
                <Lightbulb className="h-4 w-4" /> Key
              </TabsTrigger>
              <TabsTrigger value="bilingual" className="rounded-xl flex gap-1.5 text-[10px]">
                <Languages className="h-4 w-4" /> Transcript
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-xl flex gap-1.5">
                <Smile className="h-4 w-4" /> Exam
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[40vh] mt-4 pr-4">
              <TabsContent value="notes" className="space-y-4 m-0">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm font-medium text-secondary">
                    <span className="font-bold text-primary uppercase text-[10px] block mb-1">Exam Tip</span>
                    Direct vs Inverse proportionality is a common question in final exams.
                  </p>
                </div>
                {aiData ? (
                  <div className="prose prose-sm text-secondary">
                    <div dangerouslySetInnerHTML={{ __html: aiData.revisionNotes.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Generate AI materials to see detailed revision notes.</p>
                )}
              </TabsContent>

              <TabsContent value="key">
                 <div className="space-y-3">
                    {(aiData?.keyPoints || ["Fundamental Law of Demand", "Substitution Effect"]).map((point, i) => (
                      <div key={i} className="p-4 bg-muted/30 rounded-2xl">
                         <h4 className="font-bold text-sm text-secondary mb-1">Key Point {i + 1}</h4>
                         <p className="text-sm text-muted-foreground">{point}</p>
                      </div>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="bilingual">
                <div className="space-y-4">
                  {(subtitleData?.bilingualSegments || [
                    { original: "Today we will explore supply and demand.", translated: "ఈరోజు మనం సప్లై మరియు డిమాండ్ గురించి తెలుసుకుందాం." }
                  ]).map((item, i) => (
                    <div key={i} className="border-b border-muted pb-4 last:border-0">
                      <p className="text-sm font-medium text-secondary">{item.original}</p>
                      <p className="text-sm text-muted-foreground mt-1 italic">{item.translated}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="bg-accent/50 p-4 rounded-2xl border border-accent">
                  <h4 className="font-bold text-sm text-secondary mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Exam Summary
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aiData?.examSummary || "Generate AI materials to see an exam-focused summary of this lecture."}
                  </p>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
