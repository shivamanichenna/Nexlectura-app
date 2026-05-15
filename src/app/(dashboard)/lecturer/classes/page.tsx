
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users, BookOpen, ChevronRight, GraduationCap } from "lucide-react"

export default function ClassManagementPage() {
  const [classes] = useState([
    { id: 1, name: "CSE-A", subject: "Operating Systems", year: "3rd Year", students: 64, code: "CS2401" },
    { id: 2, name: "EC-B", subject: "Microprocessors", year: "2nd Year", students: 58, code: "EC1205" },
    { id: 3, name: "MBA-I", subject: "Organizational Behavior", year: "1st Year", students: 42, code: "MB1011" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold text-secondary">Class Management</h1>
        <Button className="rounded-xl h-10 font-bold gap-2">
          <Plus className="h-4 w-4" /> Create
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search classes..." className="h-12 pl-12 rounded-2xl bg-muted/50 border-none" />
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="rounded-3xl border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-secondary">{cls.name}</h4>
                  <Badge variant="secondary" className="text-[9px] h-4 py-0">{cls.code}</Badge>
                </div>
                <p className="text-xs font-bold text-primary uppercase">{cls.subject}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground font-bold">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {cls.students} Students</span>
                  <span>•</span>
                  <span>{cls.year}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-accent/50 p-6 rounded-[2rem] border border-accent">
        <h4 className="font-bold text-secondary text-sm mb-2">Classroom Invitations</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Share these codes with your students to automatically enroll them into your Vani AI classroom.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold">Copy Link</Button>
          <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold">Print QR Codes</Button>
        </div>
      </div>
    </div>
  )
}
