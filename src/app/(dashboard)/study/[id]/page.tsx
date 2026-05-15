
'use client';

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
  Share2,
  Clock,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Brain
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
      const transcript = lecture.transcript || "Today we explore the law of demand. As price increases, demand falls. This inverse relationship is key to market dynamics.";
      
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
        description: "Bilingual notes and summaries generated.",
      })
    } catch (error) {
      console.error("AI Generation failed:", error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Vani AI hit a snag. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (lectureLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-secondary text-white gap-6 p-10 text-center">
        <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center text-primary">
          <FileText className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-bold">Lecture Not Found</h2>
          <p className="text-white/60 text-sm leading-relaxed">This recording might have been removed or is still processing.</p>
        </div>
        <Button onClick={() => router.back()} className="rounded-xl w-full h-12 bg-primary">Go Back</Button>
      </div>
    );
  }

  const segments = [
    { title: "Introduction", start: "00:00", description: "Topic overview and objectives" },
    { title: "Key Definitions", start: "04:20", description: "Defining Law of Demand" },
    { title: "Classroom Example", start: "08:15", description: "Biryani price analogy" },
    { title: "Graph Analysis", start: "12:45", description: "Visualizing the curve" },
    { title: "Conclusion", start: "18:30", description: "Summary and next steps" }
  ]

  return (
    <div className="flex flex-col min-h-screen -mt-8 -mx-4 bg-secondary">
      {/* Smart Audio Player Area */}
      <div className="relative aspect-[16/10] bg-black w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/wani-lecture/800/500')] bg-cover opacity-40 blur-sm scale-110" />
        
        <audio 
          ref={audioRef} 
          src={lecture.audioUrl} 
          onEnded={() => setIsPlaying(false)}
        />

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 h-11 w-11" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 h-11 w-11" onClick={() => setIsOfflineSaved(!isOfflineSaved)}>
              <Download className={isOfflineSaved ? "text-primary fill-primary h-5 w-5" : "h-5 w-5"} />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 h-11 w-11" onClick={() => setIsBookmarked(!isBookmarked)}>
              {isBookmarked ? <BookmarkCheck className="text-primary fill-primary h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-24 w-24 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,107,0,0.4)] transition-all active:scale-90 z-10 hover:scale-105"
        >
          {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current translate-x-1" />}
        </button>

        <div className="absolute bottom-12 left-0 right-0 px-6 text-center z-10">
          <div className="bg-black/80 backdrop-blur-2xl p-5 rounded-[2.5rem] inline-block max-w-[95%] border border-white/10 shadow-2xl">
            <p className="text-white font-medium text-sm leading-relaxed">
              {subtitleData?.bilingualSegments[activeSegment]?.original || "Replaying the classroom explanation..."}
            </p>
            {bilingual && subtitleData?.bilingualSegments[activeSegment] && (
              <p className="text-primary text-xs font-bold mt-3 uppercase tracking-wide">
                {subtitleData.bilingualSegments[activeSegment].translated}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pt-0 z-10 bg-gradient-to-t from-black to-transparent">
          <div className="flex gap-1.5 h-1.5 mb-2 px-2">
            {segments.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActiveSegment(i)}
                className={`flex-1 rounded-full cursor-pointer transition-all duration-300 ${i <= activeSegment ? 'bg-primary' : 'bg-white/20 hover:bg-white/40'}`} 
              />
            ))}
          </div>
          <div className="flex justify-between px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <span>{segments[activeSegment].start}</span>
            <span>{segments[activeSegment].title}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-background rounded-t-[3.5rem] mt-[-3rem] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold px-3 py-1">{lecture.subject}</Badge>
              <h1 className="text-2xl font-headline font-bold text-secondary leading-tight">{lecture.title}</h1>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{lecture.lecturerName} • Classroom ID: {lectureId.slice(0, 6)}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground bg-muted/30 rounded-full h-10 w-10"><Share2 className="h-5 w-5" /></Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
              <Button 
                size="lg" 
                variant={bilingual ? "default" : "outline"}
                onClick={() => setBilingual(!bilingual)}
                className="rounded-2xl h-14 flex gap-2 font-bold shadow-lg shadow-primary/10"
              >
                <Languages className="h-5 w-5" />
                {bilingual ? "Bilingual On" : "English Only"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="rounded-2xl h-14 border-2 border-primary text-primary hover:bg-primary/5 font-bold gap-2"
              >
                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                Gen AI Notes
              </Button>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-muted/40 rounded-[1.5rem] p-1.5 h-14">
              <TabsTrigger value="notes" className="rounded-xl text-xs font-bold data-[state=active]:shadow-lg">Lecture Notes</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-xl text-xs font-bold data-[state=active]:shadow-lg">Timeline</TabsTrigger>
              <TabsTrigger value="exam" className="rounded-xl text-xs font-bold data-[state=active]:shadow-lg">Exam Hub</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[45vh] mt-6 pr-2">
              <TabsContent value="notes" className="space-y-6 m-0 animate-in fade-in duration-500">
                <div className="bg-accent/50 border-2 border-primary/10 rounded-[2rem] p-6 flex items-start gap-4">
                  <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Smile className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Classroom Insight</p>
                    <p className="text-sm font-medium text-secondary leading-relaxed">
                      "I've preserved Prof. Murali's teaching style. These notes focus on the examples he stressed in class."
                    </p>
                  </div>
                </div>

                {aiData ? (
                  <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm">
                      <div className="flex items-center gap-2 mb-6 border-b pb-4">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-secondary uppercase text-xs tracking-widest">Revision Roadmap</h3>
                      </div>
                      <div className="prose prose-sm prose-secondary max-w-none text-secondary/80 leading-relaxed font-medium">
                        <div dangerouslySetInnerHTML={{ __html: aiData.revisionNotes.replace(/\n/g, '<br/>') }} />
                      </div>
                    </Card>

                    <div className="grid gap-3">
                      <h4 className="font-bold text-secondary text-sm px-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Key Class Takeaways
                      </h4>
                      {aiData.keyPoints.map((point, i) => (
                        <Card key={i} className="rounded-3xl border-2 border-muted/50 p-5 bg-white hover:border-primary/20 transition-all">
                          <p className="text-sm font-medium text-secondary/80 leading-relaxed">
                            <span className="text-primary font-bold mr-2">{i + 1}.</span>
                            {point}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 opacity-30 text-center space-y-4">
                     <div className="h-20 w-20 rounded-full border-4 border-dashed border-secondary flex items-center justify-center">
                        <Sparkles className="h-10 w-10" />
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold text-secondary">AI Brain Offline</p>
                        <p className="text-xs">Tap 'Gen AI Notes' to recreate the classroom hub.</p>
                     </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4 m-0 animate-in fade-in duration-500">
                <h3 className="font-headline font-bold text-lg px-1">Smart Lecture Segments</h3>
                <div className="space-y-3">
                  {segments.map((s, i) => (
                    <Card 
                      key={i} 
                      onClick={() => setActiveSegment(i)}
                      className={`rounded-[1.5rem] border-2 transition-all cursor-pointer p-5 flex justify-between items-center group ${activeSegment === i ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/20 bg-white'}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${activeSegment === i ? 'bg-primary' : 'bg-muted-foreground'}`} />
                          <p className="font-bold text-sm text-secondary">{s.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-4">{s.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="text-[10px] h-5 rounded-lg px-2 border-muted-foreground/30">{s.start}</Badge>
                        <ArrowRight className={`h-4 w-4 text-primary transition-transform group-hover:translate-x-1 ${activeSegment === i ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="exam" className="space-y-6 m-0 animate-in fade-in duration-500">
                <Card className="bg-secondary text-white rounded-[2.5rem] border-none p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Sparkles className="h-6 w-6 fill-current" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Exam Prep Assistant</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Context-Aware Insights</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase">Predicted Important Topics</span>
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed font-medium">
                            {aiData?.examSummary || "Tap 'Gen AI Notes' above to analyze this professor's patterns and predict exam focus."}
                          </p>
                       </div>
                       
                       <div className="grid gap-3">
                         <Button onClick={() => router.push('/tests')} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 gap-2">
                           <Brain className="h-5 w-5" />
                           Take Targeted Quiz
                         </Button>
                         <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold gap-2">
                           <TrendingUp className="h-5 w-5" />
                           Review Weak Topics
                         </Button>
                       </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-accent/30 p-6 rounded-[2rem] border-2 border-dashed border-primary/20 space-y-4">
                  <h4 className="font-bold text-secondary text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Student Discussion Hub
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Collaborate with classmates on this specific lecture's concepts using Vani AI as a mediator.
                  </p>
                  <Button variant="link" className="text-primary font-bold p-0 text-xs h-auto group" onClick={() => router.push('/chat')}>
                    Join Conversation <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
