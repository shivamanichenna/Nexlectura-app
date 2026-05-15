
"use client"

import { useState, useEffect } from "react"
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
  Bookmark,
  BookmarkCheck,
  ListRestart,
  Share2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { autoLectureNotesSummary, type AutoLectureNotesSummaryOutput } from "@/ai/flows/auto-lecture-notes-summary-flow"
import { generateLectureBilingualSubtitles, type LectureBilingualSubtitlesOutput } from "@/ai/flows/lecture-bilingual-subtitles"
import { useToast } from "@/hooks/use-toast"

export default function LecturePlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [bilingual, setBilingual] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
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
      toast({
        title: "AI Materials Ready",
        description: "Notes, key points, and bilingual subtitles generated.",
      })
    } catch (error) {
      console.error("AI Generation failed:", error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Please try again later.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: !isBookmarked ? "Section Bookmarked" : "Bookmark Removed",
      description: !isBookmarked ? "You can find this in your Saved Hub." : "Removed from your library.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen -mt-8 -mx-4 bg-secondary">
      {/* Video Player Area */}
      <div className="relative aspect-video bg-black w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/wani-lecture/800/450')] bg-cover opacity-50 blur-sm" />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Classroom Mode Active</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={toggleBookmark}>
              {isBookmarked ? <BookmarkCheck className="text-primary fill-primary" /> : <Bookmark />}
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md">
              <Settings />
            </Button>
          </div>
        </div>

        {/* Play State */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 z-10"
        >
          {isPlaying ? <Pause className="fill-white text-white" /> : <Play className="fill-white text-white translate-x-0.5" />}
        </button>

        {/* Subtitles Overlay */}
        <div className="absolute bottom-14 left-0 right-0 px-6 text-center z-10">
          <div className="bg-black/70 backdrop-blur-md p-4 rounded-3xl inline-block max-w-[90%] border border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-white font-medium text-sm leading-relaxed">
              {subtitleData?.bilingualSegments[0]?.original || "When price goes up, demand usually goes down."}
            </p>
            {bilingual && (
              <p className="text-primary text-xs font-bold mt-2">
                {subtitleData?.bilingualSegments[0]?.translated || "ధర పెరిగినప్పుడు, సాధారణంగా డిమాండ్ తగ్గుతుంది."}
              </p>
            )}
          </div>
        </div>

        {/* Smart Timeline Segments */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-0 z-10">
          <div className="flex gap-1 h-1.5 mb-2">
            <div className="flex-1 bg-primary rounded-full" />
            <div className="flex-1 bg-white/20 rounded-full" />
            <div className="flex-1 bg-white/20 rounded-full" />
            <div className="flex-1 bg-white/20 rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] text-white/60 font-bold uppercase tracking-widest px-1">
             <span className="text-primary">05:12 - Intro</span>
             <span>12:45 - Concept</span>
             <span>22:10 - Example</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-background rounded-t-[3rem] mt-[-2.5rem] relative z-20 shadow-2xl border-t">
        <div className="p-7 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-headline font-bold text-secondary">Macroeconomics: Supply & Demand</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Prof. S. Murali Krishna <Badge variant="secondary" className="text-[10px] h-4">Unit 1</Badge>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={bilingual ? "default" : "outline"}
                onClick={() => setBilingual(!bilingual)}
                className="flex-1 rounded-2xl h-11 flex gap-2 font-bold shadow-sm"
              >
                <Languages className="h-4 w-4" />
                {bilingual ? "Bilingual On" : "English Only"}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="flex-1 rounded-2xl h-11 border-primary text-primary hover:bg-primary/5 font-bold gap-2 shadow-sm"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                AI Power-Up
              </Button>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-muted/30 rounded-2xl p-1 h-12">
              <TabsTrigger value="notes" className="rounded-xl flex gap-1.5 text-xs">
                <FileText className="h-4 w-4" /> Notes
              </TabsTrigger>
              <TabsTrigger value="key" className="rounded-xl flex gap-1.5 text-xs">
                <Lightbulb className="h-4 w-4" /> Core
              </TabsTrigger>
              <TabsTrigger value="bilingual" className="rounded-xl flex gap-1.5 text-[10px]">
                <Languages className="h-4 w-4" /> Mixed
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-xl flex gap-1.5 text-xs">
                <Sparkles className="h-4 w-4" /> Exam
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[45vh] mt-6 pr-4">
              <TabsContent value="notes" className="space-y-4 m-0">
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-5 flex items-start gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
                    <Smile className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-secondary leading-relaxed">
                    <span className="font-bold text-primary uppercase text-[10px] block mb-1">Classroom Context</span>
                    Remember Sir's "Coffee vs Tea" example? That perfectly illustrates the law of demand.
                  </p>
                </div>
                {aiData ? (
                  <div className="prose prose-sm text-secondary bg-white p-6 rounded-3xl border shadow-sm">
                    <div dangerouslySetInnerHTML={{ __html: aiData.revisionNotes.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                     <FileText className="h-10 w-10 text-muted-foreground mx-auto opacity-20" />
                     <p className="text-sm text-muted-foreground italic">AI Notes will appear here once generated.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="key">
                 <div className="space-y-3">
                    {(aiData?.keyPoints || ["Fundamental Law of Demand", "Price vs Quantity", "The Inverse Relation"]).map((point, i) => (
                      <Card key={i} className="p-5 bg-white border-2 border-muted hover:border-primary/20 transition-all rounded-3xl">
                         <div className="flex gap-4">
                            <span className="text-primary font-bold text-lg">0{i + 1}</span>
                            <div>
                               <h4 className="font-bold text-sm text-secondary mb-1">Key Concept</h4>
                               <p className="text-sm text-muted-foreground">{point}</p>
                            </div>
                         </div>
                      </Card>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="bilingual">
                <div className="space-y-4">
                  {(subtitleData?.bilingualSegments || [
                    { original: "Today we will explore supply and demand.", translated: "ఈరోజు మనం సప్లై మరియు డిమాండ్ గురించి తెలుసుకుందాం." },
                    { original: "When price drops, demand increases.", translated: "ధర తగ్గినప్పుడు, డిమాండ్ పెరుగుతుంది." }
                  ]).map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-muted shadow-sm">
                      <p className="text-sm font-semibold text-secondary leading-relaxed">{item.original}</p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-muted/50">
                        <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-bold">తెలుగు</Badge>
                        <p className="text-sm text-primary font-medium italic">{item.translated}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <Card className="bg-secondary text-white p-7 rounded-[2.5rem] border-none shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5 fill-current" />
                      Exam-Ready Roadmap
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      {aiData?.examSummary || "Use 'AI Power-Up' to generate an exam-focused summary of this lecture transcript."}
                    </p>
                    <div className="pt-2">
                       <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl">
                          Test My Knowledge
                       </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
