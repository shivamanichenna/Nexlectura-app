
'use client';

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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
  Brain,
  Edit,
  Save
} from "lucide-react"
import { useRouter, useParams, usePathname } from "next/navigation"
import { useFirestore, useDoc, useUser } from '@/firebase'
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { autoLectureNotesSummary, type AutoLectureNotesSummaryOutput } from "@/ai/flows/auto-lecture-notes-summary-flow"
import { generateLectureBilingualSubtitles, type LectureBilingualSubtitlesOutput } from "@/ai/flows/lecture-bilingual-subtitles"
import { useToast } from "@/hooks/use-toast"

export default function LecturePlayerPage() {
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
  const [isEditing, setIsEditing] = useState(false)
  const [isOfflineSaved, setIsOfflineSaved] = useState(false)
  const [activeSegment, setActiveSegment] = useState(0)
  
  const [aiData, setAiData] = useState<AutoLectureNotesSummaryOutput | null>(null)
  const [subtitleData, setSubtitleData] = useState<LectureBilingualSubtitlesOutput | null>(null)
  const [editableNotes, setEditableNotes] = useState("")

  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const lectureRef = useMemo(() => {
    if (!db || !lectureId) return null;
    return doc(db, 'lectures', lectureId);
  }, [db, lectureId]);

  const { data: lecture, loading: lectureLoading } = useDoc(lectureRef);

  useEffect(() => {
    if (lecture?.status === 'completed' && !aiData) {
      // Simulate fetching existing AI data or trigger initial generation
      handleGenerateAI();
    }
  }, [lecture]);

  const bookmarkRef = useMemo(() => {
    if (!db || !user || !lectureId) return null;
    return doc(db, 'users', user.uid, 'bookmarks', lectureId);
  }, [db, user, lectureId]);

  const { data: bookmarkData } = useDoc(bookmarkRef);
  const isBookmarked = !!bookmarkData;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleToggleBookmark = async () => {
    if (!db || !user || !lecture || !bookmarkRef) return;
    
    if (isBookmarked) {
      deleteDoc(bookmarkRef).catch(console.error);
      toast({ title: "Bookmark removed" });
    } else {
      setDoc(bookmarkRef, {
        id: lectureId,
        title: lecture.title,
        subject: lecture.subject,
        timestamp: new Date()
      }).catch(console.error);
      toast({ title: "Lecture bookmarked!" });
    }
  };

  const handleGenerateAI = async () => {
    if (!lecture) return;
    setIsGenerating(true)
    try {
      const transcript = lecture.transcript || "Lecture transcript is processing...";
      
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
      setEditableNotes(notes.revisionNotes)
      
      if (isLecturerView && lectureRef) {
        updateDoc(lectureRef, { status: 'completed' });
      }

      toast({
        title: "AI Materials Ready",
        description: "Bilingual notes and summaries generated.",
      })
    } catch (error) {
      console.error("AI Generation failed:", error)
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Vani AI hit a snag.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveEdits = async () => {
    if (!lectureRef || !aiData) return
    setIsEditing(false)
    try {
      // In a real app, you'd save this to a specific field or another collection
      toast({
        title: "Edits Saved!",
        description: "Students will see your refined notes.",
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Save Failed" })
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
        <h2 className="text-2xl font-headline font-bold">Lecture Not Found</h2>
        <Button onClick={() => router.back()} className="rounded-xl w-full h-12 bg-primary">Go Back</Button>
      </div>
    );
  }

  const segments = [
    { title: "Introduction", start: "00:00", description: "Topic overview" },
    { title: "Key Definitions", start: "04:20", description: "Core concepts" },
    { title: "Classroom Example", start: "08:15", description: "Practical analogies" },
    { title: "Graph Analysis", start: "12:45", description: "Visual data" },
    { title: "Conclusion", start: "18:30", description: "Wrap up" }
  ]

  return (
    <div className="flex flex-col min-h-screen -mt-8 -mx-4 bg-secondary">
      {/* Audio Player */}
      <div className="relative aspect-[16/10] bg-black w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/wani-lecture/800/500')] bg-cover opacity-40 blur-sm scale-110" />
        <audio ref={audioRef} src={lecture.audioUrl} onEnded={() => setIsPlaying(false)} />

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 h-11 w-11" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-3">
            {!isLecturerView && (
              <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 h-11 w-11" onClick={handleToggleBookmark}>
                {isBookmarked ? <BookmarkCheck className="text-primary fill-primary h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="bg-white/10 text-white rounded-2xl backdrop-blur-xl border border-white/20 h-11 w-11" onClick={() => setIsOfflineSaved(!isOfflineSaved)}>
              <Download className={isOfflineSaved ? "text-primary fill-primary h-5 w-5" : "h-5 w-5"} />
            </Button>
          </div>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-20 w-20 bg-primary text-white rounded-full flex items-center justify-center shadow-xl z-10 active:scale-95"
        >
          {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current translate-x-1" />}
        </button>

        <div className="absolute bottom-12 left-0 right-0 px-6 text-center z-10">
          <div className="bg-black/80 backdrop-blur-2xl p-4 rounded-3xl inline-block max-w-[95%] border border-white/10 shadow-2xl">
            <p className="text-white text-sm leading-relaxed">
              {subtitleData?.bilingualSegments[activeSegment]?.original || "Vani is transcribing the classroom experience..."}
            </p>
            {bilingual && subtitleData?.bilingualSegments[activeSegment] && (
              <p className="text-primary text-xs font-bold mt-2 uppercase tracking-wide">
                {subtitleData.bilingualSegments[activeSegment].translated}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pt-0 z-10">
          <div className="flex gap-1 h-1 mb-2 px-2">
            {segments.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActiveSegment(i)}
                className={`flex-1 rounded-full cursor-pointer ${i <= activeSegment ? 'bg-primary' : 'bg-white/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-background rounded-t-[3rem] mt-[-2rem] relative z-20 shadow-2xl">
        <div className="p-6 space-y-6 pb-24">
          <div className="flex justify-between items-start px-1">
            <div className="space-y-1">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 py-0.5 uppercase">{lecture.subject}</Badge>
              <h1 className="text-xl font-headline font-bold text-secondary leading-tight">{lecture.title}</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">{lecture.lecturerName} • {lecture.section}</p>
            </div>
            {isLecturerView && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => isEditing ? handleSaveEdits() : setIsEditing(true)}
                className="rounded-full bg-primary/5 text-primary border-primary/20"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={bilingual ? "default" : "outline"}
                onClick={() => setBilingual(!bilingual)}
                className="rounded-2xl h-12 flex gap-2 font-bold text-xs"
              >
                <Languages className="h-4 w-4" /> {bilingual ? "Bilingual On" : "English Only"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="rounded-2xl h-12 border-2 border-primary text-primary font-bold text-xs gap-2"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Sync AI Hub
              </Button>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-muted/40 rounded-2xl p-1 h-12">
              <TabsTrigger value="notes" className="rounded-xl text-[10px] font-bold uppercase">AI Notes</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-xl text-[10px] font-bold uppercase">Timeline</TabsTrigger>
              <TabsTrigger value="exam" className="rounded-xl text-[10px] font-bold uppercase">Exam Prep</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[40vh] mt-6 pr-2">
              <TabsContent value="notes" className="space-y-6">
                <div className="bg-accent/50 rounded-2xl p-4 flex gap-3">
                  <Smile className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-[11px] font-medium text-secondary/80">
                    {isLecturerView 
                      ? "Lecturer mode: You can refine these notes. Any changes will be visible to students instantly."
                      : "Vani has preserved your professor's teaching style and examples here."}
                  </p>
                </div>

                {aiData ? (
                  <div className="space-y-6 animate-in fade-in">
                    <Card className="rounded-3xl border-2 border-muted p-6 bg-white shadow-sm">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Revision Core
                      </h3>
                      {isEditing ? (
                        <Textarea 
                          value={editableNotes} 
                          onChange={(e) => setEditableNotes(e.target.value)}
                          className="min-h-[200px] text-sm border-primary/20"
                        />
                      ) : (
                        <div className="prose prose-sm text-secondary/80 text-sm leading-relaxed whitespace-pre-line">
                          {editableNotes}
                        </div>
                      )}
                    </Card>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase text-muted-foreground px-1">Key Class Takeaways</h4>
                      {aiData.keyPoints.map((point, i) => (
                        <Card key={i} className="rounded-2xl border-none bg-muted/20 p-4">
                          <p className="text-xs font-bold text-secondary">
                            <span className="text-primary mr-2">{i + 1}.</span> {point}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20 opacity-20 text-center">
                    <Sparkles className="h-12 w-12 mb-4" />
                    <p className="font-bold">AI Processing Required</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-3">
                {segments.map((s, i) => (
                  <Card 
                    key={i} 
                    onClick={() => setActiveSegment(i)}
                    className={`rounded-2xl border-2 cursor-pointer p-4 flex justify-between items-center ${activeSegment === i ? 'border-primary bg-primary/5' : 'border-muted bg-white'}`}
                  >
                    <div>
                      <p className="font-bold text-xs text-secondary">{s.title}</p>
                      <p className="text-[10px] text-muted-foreground">{s.description}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 rounded-lg border-muted-foreground/30">{s.start}</Badge>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="exam" className="space-y-6">
                <Card className="bg-secondary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-bold text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary fill-current" />
                      Exam Focus Analysis
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed italic">
                      {aiData?.examSummary || "Processing professor patterns to identify high-probability questions..."}
                    </p>
                    {!isLecturerView && (
                      <Button onClick={() => router.push('/tests')} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs">
                        Start Mock Session
                      </Button>
                    )}
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
