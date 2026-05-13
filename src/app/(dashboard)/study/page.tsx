"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Play, Clock, BookOpen, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function StudyPage() {
  const subjects = [
    { name: "Economics", lectures: 12, color: "bg-orange-500" },
    { name: "Mathematics", lectures: 8, color: "bg-blue-500" },
    { name: "Physics", lectures: 15, color: "bg-purple-500" },
  ]

  const recentLectures = [
    { id: "1", title: "Banking and Credit Control", subject: "Economics", date: "Yesterday", duration: "45m" },
    { id: "2", title: "Matrices & Determinants", subject: "Mathematics", date: "2 days ago", duration: "1h 12m" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-headline font-bold text-secondary">Study Hub</h1>
        <p className="text-muted-foreground text-sm">Access your bilingual lecture library.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search lectures, notes..." className="h-12 pl-12 rounded-2xl bg-muted/50 border-none" />
      </div>

      {/* Subjects Row */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg">Subjects</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {subjects.map((sub, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`h-20 w-20 rounded-[2rem] ${sub.color} flex items-center justify-center text-white shadow-lg shadow-black/10 transition-transform group-hover:scale-105 group-hover:rotate-3`}>
                <BookOpen className="h-8 w-8" />
              </div>
              <p className="text-xs font-bold text-secondary uppercase tracking-tight">{sub.name}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{sub.lectures} Lectures</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Lectures */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg">Recent Lectures</h3>
        <div className="space-y-3">
          {recentLectures.map((lec) => (
            <Link href={`/study/${lec.id}`} key={lec.id}>
              <Card className="rounded-2xl border-none bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-2 border-muted hover:border-primary/20">
                <CardContent className="p-0">
                  <div className="p-4 flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                       <Image src={`https://picsum.photos/seed/wani-lec-${lec.id}/200/200`} alt="thumb" fill className="object-cover" />
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white fill-white" />
                       </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                       <div className="space-y-1">
                          <h4 className="font-bold text-secondary text-sm leading-tight">{lec.title}</h4>
                          <p className="text-[10px] text-primary font-bold uppercase">{lec.subject}</p>
                       </div>
                       <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lec.duration}</span>
                          <span>{lec.date}</span>
                       </div>
                    </div>
                    <div className="flex items-center">
                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-3xl text-white shadow-lg shadow-orange-500/20">
           <h4 className="font-headline font-bold mb-2">My Notes</h4>
           <p className="text-xs text-white/80">32 summaries saved</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20">
           <h4 className="font-headline font-bold mb-2">Assignments</h4>
           <p className="text-xs text-white/80">4 pending tasks</p>
        </div>
      </div>
    </div>
  )
}
