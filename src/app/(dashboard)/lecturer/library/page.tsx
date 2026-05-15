
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, BookOpen, FileText, Download, MoreVertical, Sparkles, Folder } from "lucide-react"

export default function LecturerLibraryPage() {
  const categories = ["All", "Syllabus", "Handouts", "Reference Books", "Previous Papers"]
  
  const documents = [
    { id: 1, name: "Macroeconomics_Syllabus_2024.pdf", type: "Syllabus", size: "1.2 MB", date: "Aug 12" },
    { id: 2, name: "Unit_1_Case_Studies.pdf", type: "Handouts", size: "4.5 MB", date: "Sep 05" },
    { id: 3, name: "Economics_Reference_Book.pdf", type: "Reference", size: "12.8 MB", date: "Sep 20" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Knowledge Base</h1>
        <Button className="rounded-xl h-10 font-bold gap-2">
          <Plus className="h-4 w-4" /> Upload
        </Button>
      </div>

      {/* AI Knowledge Base Info */}
      <Card className="rounded-[2rem] bg-accent/50 border border-accent p-6 flex gap-4">
        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
           <h4 className="font-bold text-secondary text-sm">AI Learning Core</h4>
           <p className="text-xs text-muted-foreground leading-relaxed mt-1">
             Everything you upload here is used by Vani AI as a source of truth to answer student doubts contextually.
           </p>
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search library..." className="h-12 pl-12 rounded-2xl bg-muted/50 border-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat, i) => (
          <Button key={i} variant={i === 0 ? "default" : "outline"} size="sm" className="rounded-full px-4 h-8 text-[11px] font-bold whitespace-nowrap">
            {cat}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="rounded-2xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-muted/30 rounded-xl flex items-center justify-center text-secondary">
                 <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-secondary text-sm truncate">{doc.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold mt-0.5">
                  <Badge variant="secondary" className="h-4 py-0 px-1.5 text-[8px] uppercase">{doc.type}</Badge>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                 <MoreVertical className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subject Folders */}
      <div className="pt-4 space-y-4">
         <h3 className="font-headline font-bold text-lg">Subject Folders</h3>
         <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Economics", items: 24, color: "text-orange-500", bg: "bg-orange-50" },
              { name: "Statistics", items: 12, color: "text-blue-500", bg: "bg-blue-50" },
            ].map((folder, i) => (
              <Card key={i} className={`rounded-3xl border-none ${folder.bg} p-5 flex flex-col gap-3 cursor-pointer hover:scale-105 transition-transform`}>
                <Folder className={`h-8 w-8 ${folder.color} fill-current`} />
                <div>
                   <h4 className="font-bold text-secondary text-sm">{folder.name}</h4>
                   <p className="text-[10px] text-muted-foreground font-bold">{folder.items} Items</p>
                </div>
              </Card>
            ))}
         </div>
      </div>
    </div>
  )
}
