
'use client';

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Play, Clock, BookOpen, ChevronRight, Filter, Bookmark, Loader2, Star, Sparkles, Folder, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection } from '@/firebase'
import { collection, query } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import { Progress } from "@/components/ui/progress"

export default function StudyHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const db = useFirestore()

  const subjects = [
    { name: "Economics", color: "bg-orange-500", code: "ECO101", lectures: 12, assignments: 2 },
    { name: "Mathematics", color: "bg-blue-500", code: "MAT202", lectures: 8, assignments: 1 },
    { name: "Physics", color: "bg-purple-500", code: "PHY301", lectures: 15, assignments: 3 },
    { name: "DBMS", color: "bg-emerald-500", code: "CS401", lectures: 10, assignments: 2 },
  ]

  const assignments = [
    { id: 1, title: "Supply & Demand Graph Analysis", subject: "Economics", due: "2 days left", status: "Pending", progress: 0 },
    { id: 2, title: "Database Normalization Task", subject: "DBMS", due: "5 days left", status: "In Progress", progress: 65 },
    { id: 3, title: "Newtonian Mechanics Problems", subject: "Physics", due: "Completed", status: "Submitted", progress: 100 },
  ]

  const allLecturesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'lectures'));
  }, [db]);

  const { data: lectures, loading } = useCollection(allLecturesQuery);

  const processedLectures = useMemo(() => {
    if (!lectures) return [];
    
    return [...lectures]
      .filter(lec => {
        const matchesSearch = lec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             lec.subject?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = !selectedSubject || lec.subject === selectedSubject;
        return matchesSearch && matchesSubject;
      })
      .sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
  }, [lectures, searchQuery, selectedSubject]);

  return (
    <div className="space-y-6 pb-24">
      {/* Subject Hub Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-headline font-bold text-secondary">Subject Hub</h1>
        <p className="text-muted-foreground text-sm font-medium tracking-tight">Your bilingual library of classroom records.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search topics, concepts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 rounded-[1.25rem] bg-muted/40 border-none focus-visible:ring-primary/20 text-sm font-medium shadow-none" 
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSelectedSubject(null)}
          className={`h-14 w-14 rounded-2xl transition-all ${!selectedSubject ? 'bg-primary/10 text-primary' : 'bg-muted/40 text-muted-foreground'}`}
        >
          <Filter className="h-6 w-6" />
        </Button>
      </div>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-6 border-b-2 border-muted rounded-none w-full justify-start mb-6 overflow-x-auto no-scrollbar">
          <TabsTrigger value="subjects" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none pb-3 font-bold px-0 text-sm tracking-tight">Subjects</TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none pb-3 font-bold px-0 text-sm tracking-tight">Assignments</TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none pb-3 font-bold px-0 text-sm tracking-tight">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-8 m-0 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((sub, i) => (
              <Card 
                key={i} 
                onClick={() => setSelectedSubject(sub.name)}
                className={`rounded-[2.5rem] border-none shadow-xl transition-all cursor-pointer group p-6 overflow-hidden relative ${selectedSubject === sub.name ? 'ring-2 ring-primary bg-primary/5' : 'bg-white hover:bg-accent/30'}`}
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-muted/10 rounded-full group-hover:scale-150 transition-transform" />
                <div className={`h-14 w-14 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-xl mb-4 transition-all group-hover:rotate-6`}>
                  <BookOpen className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                   <h4 className="font-bold text-secondary text-sm leading-tight">{sub.name}</h4>
                   <div className="flex items-center justify-between">
                     <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{sub.code}</p>
                     <p className="text-[9px] text-primary font-bold uppercase">{sub.lectures} Class</p>
                   </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {selectedSubject ? `${selectedSubject} Records` : 'Recent Classroom Feed'}
              </h3>
              <Badge variant="outline" className="text-[10px] font-bold border-muted-foreground/20">Bilingual Active</Badge>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : processedLectures.length > 0 ? (
              <div className="grid gap-4">
                {processedLectures.map((lec: any) => (
                  <Link href={`/study/${lec.id}`} key={lec.id}>
                    <Card className="rounded-[2.25rem] border-none bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group border-2 border-transparent hover:border-primary/20">
                      <CardContent className="p-4 flex gap-5">
                        <div className="relative w-24 h-24 rounded-[1.75rem] overflow-hidden shrink-0 shadow-inner">
                          <Image src={`https://picsum.photos/seed/${lec.id}/200/200`} alt="thumb" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-secondary text-sm leading-tight line-clamp-2">{lec.title}</h4>
                              <Star className="h-4 w-4 text-muted-foreground/30 hover:text-yellow-400 cursor-pointer" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-muted text-[8px] font-bold text-muted-foreground h-4 py-0 uppercase border-none">{lec.subject}</Badge>
                              {lec.status === 'processing' && <Badge variant="secondary" className="text-[8px] h-4 py-0 uppercase">Syncing</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lec.lecturerName?.split(' ')[1] || 'Sir'}</span>
                            <span>{lec.createdAt ? formatDistanceToNow(lec.createdAt.toDate(), { addSuffix: true }) : 'Live'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-accent/30 rounded-[2.5rem] border-2 border-dashed border-primary/10">
                <Folder className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm font-bold text-muted-foreground">No records found for "{searchQuery || selectedSubject}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try searching for a broad topic or clear filters.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="animate-in fade-in duration-500">
           <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="font-headline font-bold text-lg">Weekly Assignments</h3>
                <Badge className="bg-orange-100 text-orange-600 border-none font-bold text-[10px]">2 ACTION REQUIRED</Badge>
             </div>
             <div className="grid gap-3">
               {assignments.map((task) => (
                 <Card key={task.id} className="rounded-3xl border-none bg-white shadow-sm border-2 border-muted hover:border-primary/10 transition-all cursor-pointer group">
                   <CardContent className="p-5 flex items-center gap-4">
                     <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${task.status === 'Submitted' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        {task.status === 'Submitted' ? <CheckCircle2 className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-secondary truncate">{task.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[9px] h-4 py-0 font-bold uppercase">{task.subject}</Badge>
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${task.status === 'Submitted' ? 'text-emerald-600' : 'text-orange-600'}`}>
                             <Clock className="h-3 w-3" /> {task.due}
                          </span>
                        </div>
                        {task.status !== 'Submitted' && (
                          <div className="mt-3 space-y-1.5">
                             <div className="flex justify-between text-[8px] font-bold uppercase text-muted-foreground">
                               <span>Draft Progress</span>
                               <span>{task.progress}%</span>
                             </div>
                             <Progress value={task.progress} className="h-1.5" />
                          </div>
                        )}
                     </div>
                     <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                   </CardContent>
                 </Card>
               ))}
             </div>
             
             <Card className="rounded-[2rem] bg-accent/50 border border-accent p-6 flex gap-4 mt-4">
               <AlertCircle className="h-6 w-6 text-primary shrink-0" />
               <div className="space-y-1">
                  <h4 className="font-bold text-secondary text-sm">AI Drafting Tool</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Vani AI can help you structure your assignments based on classroom notes. Tap on a task to start drafting.
                  </p>
               </div>
             </Card>
           </div>
        </TabsContent>

        <TabsContent value="saved" className="animate-in fade-in duration-500">
           <div className="grid grid-cols-2 gap-4">
             <Card className="rounded-3xl border-none bg-blue-50/50 p-6 flex flex-col items-center gap-4 text-center cursor-pointer hover:bg-blue-100/50 transition-colors group">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                   <Bookmark className="h-6 w-6 fill-current" />
                </div>
                <div>
                   <h4 className="font-bold text-secondary text-sm">Saved Highlights</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">12 Explanations</p>
                </div>
             </Card>
             <Card className="rounded-3xl border-none bg-orange-50/50 p-6 flex flex-col items-center gap-4 text-center cursor-pointer hover:bg-orange-100/50 transition-colors group">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                   <Sparkles className="h-6 w-6 fill-current" />
                </div>
                <div>
                   <h4 className="font-bold text-secondary text-sm">AI Summaries</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">8 Topics</p>
                </div>
             </Card>
           </div>
           
           <div className="mt-8 space-y-4">
              <h3 className="font-headline font-bold text-lg px-1">Recently Bookmarked</h3>
              <div className="p-8 text-center bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-muted">
                <p className="text-xs text-muted-foreground font-medium italic">"Tap the bookmark icon in any lecture player to save important explanations here."</p>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
