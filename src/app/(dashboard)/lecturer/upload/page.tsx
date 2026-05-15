
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileVideo, FileText, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UploadLecturePage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-headline font-bold text-secondary">Upload Lecture</h1>
      </div>

      <div className="grid gap-6">
        <Card className="border-2 border-dashed border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="font-bold text-secondary">Drag & drop your files</p>
              <p className="text-sm text-muted-foreground">Supports MP4, MOV, and PDF</p>
            </div>
            <Button className="rounded-xl px-8">Browse Files</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
           <Card className="rounded-2xl p-4 flex flex-col items-center gap-3 border-none bg-muted/30">
             <FileVideo className="h-8 w-8 text-blue-500" />
             <span className="text-xs font-bold uppercase text-muted-foreground">Video Lesson</span>
           </Card>
           <Card className="rounded-2xl p-4 flex flex-col items-center gap-3 border-none bg-muted/30">
             <FileText className="h-8 w-8 text-orange-500" />
             <span className="text-xs font-bold uppercase text-muted-foreground">PDF Transcript</span>
           </Card>
        </div>
      </div>

      <div className="bg-accent/50 p-6 rounded-3xl">
         <h4 className="font-bold text-secondary mb-2">Vani Tip</h4>
         <p className="text-sm text-muted-foreground leading-relaxed">
           Once uploaded, Vani will automatically generate bilingual subtitles, revision notes, and flashcards for your students.
         </p>
      </div>
    </div>
  )
}
