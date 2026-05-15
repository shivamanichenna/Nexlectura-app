
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users, BookOpen, ChevronRight, GraduationCap, CheckCircle, Clock } from "lucide-react"

export default function ClassManagementPage() {
  const [classes] = useState([
    { id: 1, name: "CSE-A", subject: "Operating Systems", year: "3rd Year", students: 64, code: "CS2401", attendance: "92%" },
    { id: 2, name: "EC-B", subject: "Microprocessors", year: "2nd Year", students: 58, code: "EC1205", attendance: "88%" },
    { id: 3, name: "MBA-I", subject: "Organizational Behavior", year: "1st Year", students: 42, code: "MB1011", attendance: "95%" },
  ])

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Class Management</h1>
        <Button className="rounded-xl h-10 font-bold gap-2">
          <Plus className="h-4 w-4" /> Create
        </Button>
      </div>

      {/* Attendance Integration (Feature 15 Baseline) */}
      <Card className="rounded-[2rem] border-none bg-emerald-50 p-6 flex items-center gap-4">
         <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
           <CheckCircle className="h-6 w-6" />
         </div>
         <div className="flex-1">
            <h4 className="font-bold text-emerald-800 text-sm">Attendance Smart-Scan</h4>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">98% Data Sync Complete</p>
         </div>
         <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 text-[10px] font-bold">QR Roll Call</Button>
      </Card>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search classes, semesters..." className="h-12 pl-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20" />
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="rounded-3xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-secondary">{cls.name}</h4>
                  <Badge variant="secondary" className="text-[9px] h-4 py-0 font-bold">{cls.code}</Badge>
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-tight">{cls.subject}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-bold">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {cls.students}</span>
                  <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="h-3 w-3" /> {cls.attendance} Attend.</span>
                  <span>{cls.year}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-secondary p-6 rounded-[2.5rem] border border-accent shadow-lg shadow-black/5">
        <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
           <BookOpen className="h-4 w-4 text-primary" />
           Classroom Invitations
        </h4>
        <p className="text-xs text-white/60 leading-relaxed mb-4">
          Share these secure codes to automatically enroll students into your AI-monitored classroom environment.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs font-bold bg-white/5 border-white/20 text-white hover:bg-white/10">Copy Code</Button>
          <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs font-bold bg-white/5 border-white/20 text-white hover:bg-white/10">Print QR</Button>
        </div>
      </div>
    </div>
  )
}
