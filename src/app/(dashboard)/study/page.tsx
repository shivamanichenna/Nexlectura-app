
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Play, Clock, BookOpen, ChevronRight, Filter, Bookmark, GraduationCap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudyHubPage() {
  const subjects = [
    { name: "Economics", lectures: 12, color: "bg-orange-500", code: "ECO101" },
    { name: "Mathematics", lectures: 8, color: "bg-blue-500", code: "MAT202" },
    { name: "Physics", lectures: 15, color: "bg-purple-500", code: "PHY301" },
    { name: "DBMS", lectures: 10, color: "bg-emerald-500", code: "CS401" },
  ]

  const recentLectures = [
    { id: "1", title: "Banking and Credit Control", subject: "Economics", date: "2h ago", duration: "45m", status: "In Progress" },
    { id: "2", title: "Matrices & Determinants", subject: "Mathematics", date: "Yesterday", duration: "1h 12m", status: "New" },
    { id: "3", title: "Normal Forms in SQL", subject: "DBMS", date: "2 days ago", duration: "55m", status: "Completed" },
  ]

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl font-headline font-bold text-secondary">Study Hub</h1>
        <p className="text-muted-foreground text-sm">Access your personalized bilingual library.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search topics, keywords..." className="h-12 pl-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20" />
        </div>
        <Button variant="ghost" size="icon" className="h-12 w-12 bg-muted/50 rounded-2xl">
          <Filter className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-6 border-b rounded-none w-full justify-start mb-6">
          <TabsTrigger value="subjects" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-bold px-0">My Subjects</TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-bold px-0">Saved & Notes</TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-bold px-0">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-8 m-0">
          {/* Subjects Grid */}
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((sub, i) => (
              <Card key={i} className="rounded-[2.5rem] border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group p-5">
                <div className={`h-14 w-14 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-lg mb-4 transition-transform group-hover:scale-110`}>
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                   <h4 className="font-bold text-secondary leading-tight">{sub.name}</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">{sub.code} • {sub.lectures} Units</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Subject-Wise Feed */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentLectures.map((lec) => (
                <Link href={`/study/${lec.id}`} key={lec.id}>
                  <Card className="rounded-[2rem] border-none bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-2 border-muted hover:border-primary/20">
                    <CardContent className="p-4 flex gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <Image src={`https://picsum.photos/seed/wani-lec-${lec.id}/200/200`} alt="thumb" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-secondary text-sm leading-tight line-clamp-1">{lec.title}</h4>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              lec.status === 'New' ? 'bg-blue-100 text-blue-600' : 
                              lec.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                            }`}>{lec.status}</span>
                          </div>
                          <p className="text-[10px] text-primary font-bold uppercase mt-0.5">{lec.subject}</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lec.duration}</span>
                          <span>{lec.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
             {[
               { title: "Macro-Dynamics: Summary", type: "AI Note", date: "Oct 12" },
               { title: "Key Formula Sheet", type: "Personal Note", date: "Oct 10" },
               { title: "Supply Curve Breakdown", type: "Bookmark", date: "Oct 08" },
             ].map((item, i) => (
               <Card key={i} className="rounded-3xl border-none bg-accent/30 p-5 flex items-center gap-4 group cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Bookmark className="h-6 w-6 fill-current" />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-sm text-secondary">{item.title}</h4>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase">{item.type} • Saved on {item.date}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
               </Card>
             ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
           {[
             { title: "Money Multiplier Report", due: "Tomorrow", subject: "Economics", progress: 65, status: "Urgent" },
             { title: "SQL Queries: Unit 2", due: "Oct 24", subject: "DBMS", progress: 10, status: "On Track" },
           ].map((task, i) => (
             <Card key={i} className="rounded-3xl border-2 border-muted p-5 space-y-4 bg-white">
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="font-bold text-secondary text-sm">{task.title}</h4>
                      <p className="text-[10px] text-primary font-bold uppercase mt-0.5">{task.subject}</p>
                   </div>
                   <Badge variant={task.status === 'Urgent' ? 'destructive' : 'secondary'} className="text-[9px] h-4">{task.status}</Badge>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                      <span>Progress: {task.progress}%</span>
                      <span>Due {task.due}</span>
                   </div>
                   <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                   </div>
                </div>
                <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-primary text-primary hover:bg-primary/5">
                   Resume Assignment
                </Button>
             </Card>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
