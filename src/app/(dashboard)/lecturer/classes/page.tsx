
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Users, 
  BookOpen, 
  ChevronRight, 
  GraduationCap, 
  CheckCircle,
  Share2,
  Copy,
  LayoutGrid,
  List
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ClassManagementPage() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [classes] = useState([
    { id: 1, name: "CSE-A", subject: "Operating Systems", year: "3rd Year", semester: "5th Sem", students: 64, code: "VANI-CS2401" },
    { id: 2, name: "EC-B", subject: "Microprocessors", year: "2nd Year", semester: "3rd Sem", students: 58, code: "VANI-EC1205" },
    { id: 3, name: "MBA-I", subject: "Org Behavior", year: "1st Year", semester: "1st Sem", students: 42, code: "VANI-MB1011" },
  ])

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Invite Code Copied!",
      description: `${code} is ready to share with your students.`,
    })
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header (Feature 3) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-headline font-bold text-secondary">Class Management</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight mt-0.5">Manage sections & semesters</p>
        </div>
        <Button className="rounded-xl h-11 font-bold gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Class
        </Button>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search sections, subjects..." className="h-12 pl-12 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20" />
        </div>
        <div className="flex bg-muted/40 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Classroom List (Feature 3) */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
        {classes.map((cls) => (
          <Card key={cls.id} className="rounded-3xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group bg-white shadow-sm overflow-hidden">
            <CardContent className={`p-5 flex ${viewMode === 'grid' ? 'flex-col gap-4' : 'items-center gap-4'}`}>
              <div className={`rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform ${viewMode === 'grid' ? 'h-14 w-14 bg-primary/10' : 'h-16 w-16 bg-muted/30'}`}>
                <GraduationCap className={viewMode === 'grid' ? 'h-7 w-7' : 'h-8 w-8'} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-secondary text-base truncate">{cls.name}</h4>
                  <Badge variant="secondary" className="text-[8px] h-4 py-0 font-bold uppercase tracking-tighter">{cls.semester}</Badge>
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-tight line-clamp-1">{cls.subject}</p>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground font-bold">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {cls.students} Students</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{cls.year}</span>
                </div>
              </div>

              <div className={`flex gap-2 ${viewMode === 'grid' ? 'w-full' : 'shrink-0'}`}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); copyCode(cls.code); }}
                  className="rounded-xl h-10 w-10 border-muted-foreground/20 text-muted-foreground hover:text-primary hover:border-primary/40"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {viewMode === 'list' && <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classroom Invitations Info (Feature 3) */}
      <Card className="rounded-[2.5rem] bg-secondary text-white border-none p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
               <Share2 className="h-5 w-5" />
             </div>
             <div className="space-y-0.5">
               <h4 className="font-bold text-base leading-none">Global Classroom Invitations</h4>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Enroll your students easily</p>
             </div>
          </div>
          
          <p className="text-xs text-white/70 leading-relaxed italic">
            "Share your secure Vani Codes with students to automatically enroll them. Each code is unique to the section and subject combination."
          </p>
          
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl h-12 text-xs font-bold bg-white/5 border-white/10 text-white hover:bg-white/20 transition-all">
              <Plus className="h-3.5 w-3.5 mr-2" /> Bulk Enroll
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl h-12 text-xs font-bold bg-white/5 border-white/10 text-white hover:bg-white/20 transition-all">
              <Share2 className="h-3.5 w-3.5 mr-2" /> Share QR
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
