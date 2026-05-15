
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileVideo, FileText, ChevronLeft, Mic, StopCircle, Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function UploadLecturePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      toast({
        title: "Recording Saved",
        description: "Your live lecture recording has been auto-saved for AI processing.",
      })
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      toast({
        title: "Recording Started",
        description: "Vani is capturing your lecture audio.",
      })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-headline font-bold text-secondary">Upload & Record</h1>
      </div>

      <div className="grid gap-6">
        {/* Live Recording Feature */}
        <Card className={`border-2 rounded-[2rem] overflow-hidden transition-all duration-500 ${isRecording ? 'border-red-500 bg-red-50' : 'border-muted bg-white'}`}>
          <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
            <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary/10 text-primary'}`}>
              {isRecording ? <StopCircle className="h-10 w-10 text-white" /> : <Mic className="h-10 w-10" />}
            </div>
            
            {isRecording && (
              <div className="space-y-1">
                <p className="text-2xl font-mono font-bold text-red-600">{formatTime(recordingTime)}</p>
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Live Recording Active</p>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="font-bold text-secondary">{isRecording ? "Lecture in Progress" : "Start Live Session"}</h3>
              <p className="text-sm text-muted-foreground">Vani will auto-transcribe and create bilingual notes.</p>
            </div>

            <Button 
              size="lg" 
              onClick={handleToggleRecording}
              className={`rounded-2xl w-full h-14 font-bold shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'shadow-primary/20'}`}
            >
              {isRecording ? "Stop & Save Lecture" : "Start Recording"}
            </Button>
          </CardContent>
        </Card>

        {/* Traditional Upload */}
        <Card className="border-2 border-dashed border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors rounded-[2rem]">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center gap-4">
            <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <p className="font-bold text-secondary">Large File Upload</p>
              <p className="text-xs text-muted-foreground">Supports MP4, WAV, MP3, PDF (Max 2GB)</p>
            </div>
            <Button variant="outline" className="rounded-xl px-8 border-primary text-primary hover:bg-primary/5">Browse Library</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
           <Card className="rounded-2xl p-5 flex flex-col items-center gap-3 border-none bg-blue-50/50">
             <FileVideo className="h-8 w-8 text-blue-500" />
             <span className="text-[10px] font-bold uppercase text-blue-600">Video Lesson</span>
           </Card>
           <Card className="rounded-2xl p-5 flex flex-col items-center gap-3 border-none bg-orange-50/50">
             <FileText className="h-8 w-8 text-orange-500" />
             <span className="text-[10px] font-bold uppercase text-orange-600">Lecture PDF</span>
           </Card>
        </div>
      </div>

      <div className="bg-secondary p-6 rounded-[2rem] text-white">
         <h4 className="font-bold mb-2 flex items-center gap-2">
           <Save className="h-4 w-4 text-primary" />
           Classroom Context Preservation
         </h4>
         <p className="text-xs text-white/70 leading-relaxed">
           Vani's AI keeps your jokes, examples, and unique analogies in the generated notes to maintain the "magic" of your teaching flow.
         </p>
      </div>
    </div>
  )
}
