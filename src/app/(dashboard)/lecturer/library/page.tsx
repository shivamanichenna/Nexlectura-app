
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, BookOpen, FileText, Download, MoreVertical, Sparkles, Folder, UploadCloud, Library } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LecturerLibraryPage() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const categories = ["All", "Syllabus", "Handouts", "Reference Books", "Previous Papers"]
  
  const documents = [
    { id: 1, name: "Macroeconomics_Syllabus_2024.pdf", type: "Syllabus", size: "1.2 MB", date: "Aug 12", subject: "Economics" },
    { id: 2, name: "Unit_1_Case_Studies.pdf", type: "Handouts", size: "4.5 MB", date: "Sep 05", subject: "Economics" },
    { id: 3, name: "Economics_Reference_Book.pdf", type: "Reference", size: "12.8 MB", date: "Sep 20", subject: "Economics" },
  ]

  const handleUpload = () => {
    toast({
      title: "Syncing with Vani AI",
      description: "Your document is being indexed as a source of truth for student doubts.",
    })
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-headline font-bold text-secondary">Knowledge Base</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Feature 7 & 20 • Content Library</p>
        </div>
        <Button onClick={handleUpload} className="rounded-xl h-11 font-bold gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Upload Resource
        </Button>
      </div>

      {/* AI Knowledge Base Info (Feature 8) */}
      <Card className="rounded-[2.5rem] bg-secondary text-white border-none p-7 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 flex gap-5">
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-2">
             <h4 className="font-bold text-base leading-tight">AI Learning Core</h4>
             <p className="text-xs text-white/60 leading-relaxed italic">
               "Everything you upload here—Syllabus, PDFs, or PPTs—is used by Vani AI as a source of truth to answer student doubts contextually."
             </p>
          </div>
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by topic, file name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-12 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20" 
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat, i) => (
          <Button key={i} variant={i === 0 ? "default" : "outline"} size="sm" className="rounded-full px-5 h-9 text-[11px] font-bold whitespace-nowrap">
            {cat}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-headline font-bold text-lg px-1 flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          Recent Uploads
        </h3>
        {documents.map((doc) => (
          <Card key={doc.id} className="rounded-3xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-muted/30 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                 <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-secondary text-sm truncate">{doc.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold mt-1">
                  <Badge variant="secondary" className="h-4 py-0 px-1.5 text-[8px] uppercase">{doc.type}</Badge>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary">
                 <Download className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subject Folders (Feature 20) */}
      <div className="pt-4 space-y-4">
         <h3 className="font-headline font-bold text-lg px-1">Subject Archives</h3>
         <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Economics", items: 24, color: "text-orange-500", bg: "bg-orange-50/50" },
              { name: "Statistics", items: 12, color: "text-blue-500", bg: "bg-blue-50/50" },
              { name: "Banking", items: 8, color: "text-emerald-500", bg: "bg-emerald-50/50" },
              { name: "Syllabus", items: 4, color: "text-purple-500", bg: "bg-purple-50/50" },
            ].map((folder, i) => (
              <Card key={i} className={`rounded-[2rem] border-none ${folder.bg} p-6 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-all group`}>
                <div className={`h-12 w-12 rounded-2xl bg-white flex items-center justify-center ${folder.color} shadow-sm group-hover:rotate-6 transition-transform`}>
                  <Folder className="h-6 w-6 fill-current" />
                </div>
                <div>
                   <h4 className="font-bold text-secondary text-sm">{folder.name}</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{folder.items} Resources</p>
                </div>
              </Card>
            ))}
         </div>
      </div>
    </div>
  )
}
