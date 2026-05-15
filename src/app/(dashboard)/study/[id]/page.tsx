
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
  Languages,
  ChevronLeft,
  Sparkles,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Download,
  Share2,
  Info
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
  const [isOfflineSaved, setIsOfflineSaved] = useState(false)
  const [activeSegment, setActiveSegment] = useState(0)
  const [aiData, setAiData] = useState<AutoLectureNotesSummaryOutput | null>(null)
  const [subtitleData, setSubtitleData] = useState<LectureBilingualSubtitlesOutput | null>(null)

  const rawTranscript = "Today we will explore the fundamental concept of supply and demand. When price goes up, demand usually goes down. This is the law of demand. Think of it like a movie ticket. If it's too expensive, fewer people go. Conversely, when price drops, more people are willing to buy. This inverse relationship is what we call the Demand Curve."

  const segments = [
    { title: "Intro", start: "00:00", description: "Classroom Greeting & Context" },
    { title: "Demand Law", start: "05:12", description: "The Inverse Price Relationship" },
    { title: "Examples", start: "12:45", description: "Coffee vs Tea Analogies" },
    { title: "Summary", start: "22:10", description: "Quick Unit Wrap-up" }
  ]

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

  const toggleOffline = () => {
    setIsOfflineSaved(!isOfflineSaved)
    toast({
      title: !isOfflineSaved ? "Saved for Offline" : "Removed from Offline",
      description: !isOfflineSaved ? "You can access this without internet later." : "Local cache cleared.",
    })
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: !isBookmarked ? "Section Bookmarked" : "Bookmark Removed",
    })
  }

  return (
    <div className="flex flex-col min-h-screen -mt-8 -mx-4 bg-secondary">
      {/* Video Player Area */}
      <div className="relative aspect-video bg-black w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/wani-lecture/800/450')] bg-cover opacity-50 blur-sm" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={toggleOffline}>
              <Download className={isOfflineSaved ? "text-primary fill-primary" : ""} />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={toggleBookmark}>
              {isBookmarked ? <BookmarkCheck className="text-primary fill-primary" /> : <Bookmark />}
            </Button>
          </div>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 z-10"
        >
          {isPlaying ? <Pause className="fill-white text-white" /> : <Play className="fill-white text-white translate-x-0.5" />}
        </button>

        {/* Subtitles Overlay */}
        <div className="absolute bottom-16 left-0 right-0 px-6 text-center z-10">
          <div className="bg-black/70 backdrop-blur-md p-4 rounded-3xl inline-block max-w-[90%] border border-white/10">
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

        {/* Interactive Smart Timeline */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-0 z-10 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex gap-1 h-1.5 mb-2">
            {segments.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActiveSegment(i)}
                className={`flex-1 rounded-full cursor-pointer transition-colors ${i <= activeSegment ? 'bg-primary' : 'bg-white/20'}`} 
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-white/60 font-bold uppercase tracking-widest px-1">
             {segments.map((s, i) => (
               <span key={i} className={i === activeSegment ? "text-primary" : ""}>{s.start} - {s.title}</span>
             ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-background rounded-t-[3rem] mt-[-2.5rem] relative z-20 shadow-2xl border-t">
        <div className="p-7 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-headline font-bold text-secondary">Macroeconomics: Supply & Demand</h1>
              <p className="text-sm text-muted-foreground">Prof. S. Murali Krishna • Unit 1</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><Share2 className="h-5 w-5" /></Button>
          </div>
          
          <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={bilingual ? "default" : "outline"}
                onClick={() => setBilingual(!bilingual)}
                className="flex-1 rounded-2xl h-11 flex gap-2 font-bold"
              >
                <Languages className="h-4 w-4" />
                {bilingual ? "Mixed On" : "English Only"}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="flex-1 rounded-2xl h-11 border-primary text-primary hover:bg-primary/5 font-bold gap-2"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                AI Materials
              </Button>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-muted/30 rounded-2xl p-1 h-12">
              <TabsTrigger value="notes" className="rounded-xl text-xs">Notes</TabsTrigger>
              <TabsTrigger value="key" className="rounded-xl text-xs">Core</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-xl text-xs">Timeline</TabsTrigger>
              <TabsTrigger value="exam" className="rounded-xl text-xs">Exam</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[45vh] mt-6 pr-4">
              <TabsContent value="notes" className="space-y-4 m-0">
                <div className="bg-accent border border-primary/20 rounded-3xl p-5 flex items-start gap-3">
                  <Smile className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-sm font-medium text-secondary leading-relaxed">
                    <span className="font-bold text-primary uppercase text-[10px] block mb-1">Teacher's Context</span>
                    Remember Sir's "Coffee vs Tea" example? That perfectly illustrates the law of demand.
                  </p>
                </div>
                {aiData ? (
                  <div className="prose prose-sm text-secondary bg-white p-6 rounded-3xl border shadow-sm">
                    <div dangerouslySetInnerHTML={{ __html: aiData.revisionNotes.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3 opacity-40">
                     <FileText className="h-10 w-10 mx-auto" />
                     <p className="text-sm italic">Generate AI notes to see classroom insights.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="key" className="space-y-3">
                 {(aiData?.keyPoints || ["Fundamental Law of Demand", "Price vs Quantity", "The Inverse Relation"]).map((point, i) => (
                    <Card key={i} className="p-5 bg-white border-2 border-muted rounded-3xl">
                       <h4 className="font-bold text-sm text-secondary mb-1">Concept {i+1}</h4>
                       <p className="text-sm text-muted-foreground">{point}</p>
                    </Card>
                 ))}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-3">
                {segments.map((s, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveSegment(i)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${activeSegment === i ? 'border-primary bg-primary/5' : 'border-muted bg-white'}`}
                  >
                    <div>
                      <p className="font-bold text-sm text-secondary">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{s.start}</Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="exam">
                <Card className="bg-secondary text-white p-7 rounded-[2.5rem] border-none shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5 fill-current" />
                      Exam Roadmap
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      {aiData?.examSummary || "Generate materials to see exam-focused concepts."}
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl" onClick={() => router.push('/tests')}>
                       Practice Mock Quiz
                    </Button>
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
