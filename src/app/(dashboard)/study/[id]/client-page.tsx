'use client';

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Play, 
  Pause, 
  ChevronLeft,
  Sparkles,
  Loader2,
  MoreVertical,
  ListVideo,
  FastForward,
  Rewind,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { useRouter, useParams, usePathname } from "next/navigation"
import { useFirestore, useDoc, useUser } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { generateLectureBilingualSubtitles, type LectureBilingualSubtitlesOutput } from "@/ai/flows/lecture-bilingual-subtitles"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function LecturePlayerClient() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const lectureId = params.id as string
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const isLecturerView = pathname.includes('/lecturer')
  const [isPlaying, setIsPlaying] = useState(false)
  const [bilingual, setBilingual] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSegment, setActiveSegment] = useState(0)
  
  const [subtitleData, setSubtitleData] = useState<LectureBilingualSubtitlesOutput | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const lectureRef = useMemo(() => {
    if (!db || !lectureId) return null;
    return doc(db, 'lectures', lectureId);
  }, [db, lectureId]);

  const { data: lecture, loading: lectureLoading } = useDoc(lectureRef);

  useEffect(() => {
    if (lecture?.status === 'ready') {
      if (lecture.subtitleData && !subtitleData) {
        setSubtitleData(lecture.subtitleData);
      } else if (!lecture.subtitleData && !isGenerating && !subtitleData) {
        handleGenerateAI(); // Just generate subtitles
      }
    }
  }, [lecture]);

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
    if (!lecture || lecture.subtitleData) return;
    setIsGenerating(true)
    try {
      const transcript = lecture.transcript || "Lecture transcript is processing...";
      
      const subtitles = await generateLectureBilingualSubtitles({
          lectureTranscript: transcript,
          targetLanguage: "Hindi",
          originalLanguage: "English"
      })
      setSubtitleData(subtitles)
      
      if (lectureRef) {
        updateDoc(lectureRef, { subtitleData: subtitles });
      }

      toast({
        title: "Bilingual Subtitles Ready",
        description: "Hindi-English subtitles have been generated.",
      })
    } catch (error) {
      console.error("AI Generation failed:", error)
      toast({
        variant: "destructive",
        title: "Subtitles Failed",
        description: "Nexlectra hit a snag while translating.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (lectureLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground gap-6 p-10 text-center">
        <h2 className="text-2xl font-headline font-bold">Lecture Not Found</h2>
        <Button onClick={() => router.back()} className="rounded-full w-full h-12">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top App Bar */}
      <div className="flex items-center justify-between p-4 px-6 pt-6">
        <button onClick={() => router.back()} className="text-foreground hover:opacity-70 transition-opacity">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <div className="text-center">
          <h2 className="font-headline font-bold text-sm text-foreground max-w-[200px] truncate">{lecture.title || 'Neural Network Fundamentals'}</h2>
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Module 3</p>
        </div>
        <button className="text-foreground hover:opacity-70 transition-opacity">
          <MoreVertical className="h-6 w-6 text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-24 space-y-6">
        {/* Big Hero Image */}
        <div className="relative aspect-square w-full max-w-sm mx-auto rounded-[2rem] overflow-hidden shadow-sm border border-border bg-gradient-to-br from-indigo-900 to-slate-900">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600&auto=format&fit=crop')] bg-cover opacity-60 mix-blend-overlay" />
           <div className="absolute top-4 left-4">
             <Badge className="bg-black/50 backdrop-blur-md text-white border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
               Now Playing
             </Badge>
           </div>
        </div>

        {/* Bilingual Transcript Card */}
        <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-foreground">Bilingual Transcript</h3>
              <Badge 
                variant="outline" 
                className={`font-bold cursor-pointer ${bilingual ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
                onClick={() => setBilingual(!bilingual)}
              >
                EN / HI
              </Badge>
           </div>
           
           <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
             {isGenerating ? (
               <div className="flex items-center justify-center py-10 opacity-50">
                 <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                 <span className="text-sm font-bold">Translating to Hindi...</span>
               </div>
             ) : subtitleData?.bilingualSegments ? (
               subtitleData.bilingualSegments.map((seg, idx) => (
                 <div key={idx} className={`space-y-1 p-3 rounded-2xl transition-colors cursor-pointer ${activeSegment === idx ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`} onClick={() => setActiveSegment(idx)}>
                    <p className={`text-sm font-semibold leading-relaxed ${activeSegment === idx ? 'text-foreground' : 'text-foreground/70'}`}>
                      {seg.original}
                    </p>
                    {bilingual && (
                      <p className={`text-xs italic leading-relaxed ${activeSegment === idx ? 'text-primary' : 'text-muted-foreground'}`}>
                        {seg.translated}
                      </p>
                    )}
                 </div>
               ))
             ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">Transcript not available.</p>
                </div>
             )}
           </div>
        </Card>

        {/* Audio Scrubber */}
        <div className="space-y-2 pt-2">
           <div className="h-1.5 w-full bg-muted rounded-full relative">
              <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-[35%]" />
              <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full shadow-md border-2 border-white" style={{ left: '35%' }} />
           </div>
           <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
             <span>12:45</span>
             <span>-32:10</span>
           </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center gap-8">
           <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">1.2x</button>
           <button className="text-foreground hover:opacity-70 transition-opacity">
             <Rewind className="h-6 w-6 fill-current" />
           </button>
           
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="h-16 w-16 bg-[#1e293b] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
           >
             {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current translate-x-1" />}
           </button>

           <button className="text-foreground hover:opacity-70 transition-opacity">
             <FastForward className="h-6 w-6 fill-current" />
           </button>
           <button className="text-muted-foreground hover:text-foreground transition-colors">
             <ListVideo className="h-6 w-6" />
           </button>
        </div>
        
        {/* Hidden audio element */}
        <audio ref={audioRef} src={lecture.audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
      </div>

      {/* Floating Action Button (AI Notes) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-14 rounded-full px-6 shadow-xl shadow-primary/30 flex items-center gap-2 font-bold text-base hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 fill-current" />
              AI Notes
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-[2rem] p-0 flex flex-col bg-[#fafafa]">
            <SheetHeader className="p-6 pb-2 shrink-0">
              <SheetTitle className="font-headline text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#ff6b2b]" />
                Nexlectra AI Notes
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 px-6 pb-6">
              <div className="space-y-8 mt-4">
                
                {lecture.examSummary && (
                  <div className="bg-[#ffebdb] text-[#b84e14] p-5 rounded-2xl border border-[#ffdfc4] shadow-sm">
                    <h4 className="font-bold mb-2 uppercase tracking-widest text-xs flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" /> Exam Focus
                    </h4>
                    <p className="text-sm font-medium leading-relaxed">{lecture.examSummary}</p>
                  </div>
                )}

                {lecture.keyPoints && lecture.keyPoints.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">Key Takeaways</h4>
                    <ul className="space-y-3">
                      {lecture.keyPoints.map((kp: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-700 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          <span className="leading-relaxed">{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lecture.revisionNotes && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">Detailed Revision Notes</h4>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 prose prose-sm max-w-none text-gray-700">
                      {/* Using pre-wrap since we don't have a markdown renderer readily imported */}
                      <div className="whitespace-pre-wrap font-medium leading-relaxed">{lecture.revisionNotes}</div>
                    </div>
                  </div>
                )}

                {lecture.flashcards && lecture.flashcards.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">Flashcards</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {lecture.flashcards.map((card: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group perspective-1000">
                           <div className="p-4 bg-gray-50 border-b border-gray-100">
                             <p className="font-bold text-sm text-gray-900">{card.question}</p>
                           </div>
                           <div className="p-4">
                             <p className="text-sm text-gray-600 font-medium italic">"{card.answer}"</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
