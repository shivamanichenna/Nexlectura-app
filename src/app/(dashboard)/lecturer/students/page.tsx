
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreVertical, TrendingUp, TrendingDown, Users, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function StudentsManagementPage() {
  const [search, setSearch] = useState("")
  
  const students = [
    { id: 1, name: "Arjun Kothari", id_num: "VU2024001", progress: 92, trend: "up", status: "On Track", department: "Computer Science" },
    { id: 2, name: "Sneha Reddy", id_num: "VU2024008", progress: 45, trend: "down", status: "Needs Attention", department: "Computer Science" },
    { id: 3, name: "Rahul Verma", id_num: "VU2024012", progress: 78, trend: "up", status: "On Track", department: "Computer Science" },
    { id: 4, name: "Priya Das", id_num: "VU2024015", progress: 62, trend: "up", status: "Steady", department: "Computer Science" },
  ]

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id_num.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-headline font-bold text-secondary">Student Directory</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Section: CSE-A</p>
        </div>
        <Button size="icon" className="h-11 w-11 rounded-2xl shadow-lg shadow-primary/20">
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-none bg-primary/5 p-4 flex flex-col items-center text-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xl font-bold text-secondary">{students.length}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase">Total Students</p>
          </div>
        </Card>
        <Card className="rounded-2xl border-none bg-destructive/5 p-4 flex flex-col items-center text-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-xl font-bold text-secondary">1</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase">At Risk</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-10 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20" 
          />
        </div>
        <Button variant="outline" className="h-12 w-12 rounded-2xl border-muted shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all cursor-pointer group overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarImage src={`https://picsum.photos/seed/student-${student.id}/100/100`} />
                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white flex items-center justify-center ${
                  student.trend === 'up' ? 'bg-emerald-500' : 'bg-destructive'
                }`}>
                  {student.trend === 'up' ? <TrendingUp className="h-2 w-2 text-white" /> : <TrendingDown className="h-2 w-2 text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-secondary truncate text-sm">{student.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">{student.id_num}</p>
                  <span className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
                  <p className="text-[9px] text-muted-foreground font-medium truncate">{student.department}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <Badge variant={student.status === 'Needs Attention' ? 'destructive' : 'secondary'} className="text-[8px] h-4 py-0 px-1.5 font-bold uppercase mb-1">
                  {student.status}
                </Badge>
                <div className="flex flex-col items-end gap-1">
                   <p className="text-xs font-bold text-secondary">{student.progress}%</p>
                   <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                     <div className={`h-full ${student.progress > 80 ? 'bg-emerald-500' : student.progress > 50 ? 'bg-blue-500' : 'bg-destructive'}`} style={{ width: `${student.progress}%` }} />
                   </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-10 opacity-30">
            <Users className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm font-bold">No students matched your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
