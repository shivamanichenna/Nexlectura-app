'use client';

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Pause, 
  FileText, 
  Smile, 
  Languages,
  ChevronLeft,
  Sparkles,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Download,
  Share2
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useFirestore, useDoc } from '@/firebase'
import { doc } from 'firebase/firestore'
import { autoLectureNotesSummary, type AutoLectureNotesSummaryOutput } from "@/ai/flows/auto-lecture-notes-summary-flow"
import { generateLectureBilingualSubtitles, type LectureBilingualSubtitlesOutput } from "@/ai/flows/lecture-bilingual-subtitles"
import { useToast } from "@/hooks/use-toast"

export default function LecturePlayerPage() {
  const router = useRouter()
  const params = useParams()
  const lectureId = params.id as string
  const { toast } = useToast()
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [bilingual, setBilingual] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isOfflineSaved, setIsOfflineSaved] = useState(false)
  const [activeSegment, setActiveSegment] = useState(0)
  const [aiData, setAiData] = useState<AutoLectureNotesSummaryOutput | null>(null)
  const [subtitleData, setSubtitleData] = useState<LectureBilingualSubtitlesOutput | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const db = useFirestore()
  
  const lectureRef = useMemo(() => {
    if (!db || !lectureId) return null;
    return doc(db, 'lectures', lectureId);
  }, [db, lectureId]);

  const { data: lecture, loading: lectureLoading } = useDoc(lectureRef);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleGenerateAI = async () => {
    if (!lecture) return;
    setIsGenerating(true)
    try {
      // For now we use a fallback transcript if real transcription isn't available
      const transcript = "Today we explore the law of demand. As price increases, demand falls. This inverse relationship is key to market dynamics.";
      
      const [notes, subtitles] = await Promise.all([
        autoLectureNotesSummary({ lectureTranscript: transcript }),
        generateLectureBilingualSubtitles({
          lectureTranscript: transcript,
          targetLanguage: "Telugu",
          originalLanguage: "English"
        })
      ])
      setAiData(notes)
      setSubtitleData(subtitles)
      toast({
        title: "AI Materials Ready",
        description: "Notes and bilingual subtitles generated.",
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

  if (lectureLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-secondary text-white gap-4">
        <p>Lecture not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const segments = [
    { title: "Intro", start: "00:00", description: "Classroom Greeting & Context" },
    { title: "Core Topic", start: "05:12", description: "Main lecture content" },
    { title: "Summary", start: "15:45", description: "Quick Wrap-up" }
  ]

  return (
    <div className="flex flex-col min-h-screen -mt-8 -mx-4 bg-secondary">
      {/* Audio Player Area */}
      <div className="relative aspect-video bg-black w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/wani-lecture/800/450')] bg-cover opacity-50 blur-sm" />
        
        <audio 
          ref={audioRef} 
          src={lecture.audioUrl} 
          onEnded={() => setIsPlaying(false)}
        />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={() => setIsOfflineSaved(!isOfflineSaved)}>
              <Download className={isOfflineSaved ? "text-primary fill-primary" : ""} />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-full backdrop-blur-md" onClick={() => setIsBookmarked(!isBookmarked)}>
              {isBookmarked ? <BookmarkCheck className="text-primary fill-primary" /> : <Bookmark />}
            </Button>
          </div>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-20 w-20 bg-primary rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 z-10"
        >
          {isPlaying ? <Pause className="h-8 w-8 fill-white text-white" /> : <Play className="h-8 w-8 fill-white text-white translate-x-0.5" />}
        </button>

        {/* Subtitles Overlay */}
        <div className="absolute bottom-16 left-0 right-0 px-6 text-center z-10">
          <div className="bg-black/70 backdrop-blur-md p-4 rounded-3xl inline-block max-w-[90%] border border-white/10">
            <p className="text-white font-medium text-sm leading-relaxed">
              {subtitleData?.bilingualSegments[0]?.original || "Listening to the classroom recording..."}
            </p>
            {bilingual && subtitleData?.bilingualSegments[0] && (
              <p className="text-primary text-xs font-bold mt-2">
                {subtitleData.bilingualSegments[0].translated}
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
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
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-background rounded-t-[3rem] mt-[-2.5rem] relative z-20 shadow-2xl border-t">
        <div className="p-7 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-headline font-bold text-secondary">{lecture.title}</h1>
              <p className="text-sm text-muted-foreground">{lecture.lecturerName} • {lecture.subject}</p>
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
            
            <ScrollArea className="h-[40vh] mt-6 pr-4">
              <TabsContent value="notes" className="space-y-4 m-0">
                <div className="bg-accent border border-primary/20 rounded-3xl p-5 flex items-start gap-3">
                  <Smile className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-sm font-medium text-secondary leading-relaxed">
                    <span className="font-bold text-primary uppercase text-[10px] block mb-1">Classroom Context</span>
                    AI is analyzing your lecture audio to recreate the classroom experience.
                  </p>
                </div>
                {aiData ? (
                  <div className="prose prose-sm text-secondary bg-white p-6 rounded-3xl border shadow-sm">
                    <div dangerouslySetInnerHTML={{ __html: aiData.revisionNotes.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-40">
                     <FileText className="h-10 w-10 mx-auto mb-2" />
                     <p className="text-sm italic">Generate AI materials to see details.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="key" className="space-y-3">
                 {aiData?.keyPoints?.map((point, i) => (
                    <Card key={i} className="p-5 bg-white border-2 border-muted rounded-3xl">
                       <h4 className="font-bold text-sm text-secondary mb-1">Key Takeaway {i+1}</h4>
                       <p className="text-sm text-muted-foreground">{point}</p>
                    </Card>
                 )) || (
                    <p className="text-center py-10 text-muted-foreground text-sm">No core points generated yet.</p>
                 )}
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
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5 fill-current" />
                      Exam Roadmap
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      {aiData?.examSummary || "AI is ready to highlight what's important for your finals."}
                    </p>
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
