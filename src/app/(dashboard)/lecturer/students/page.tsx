
"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreVertical, Star } from "lucide-react"

export default function StudentsManagementPage() {
  const students = [
    { id: 1, name: "Arjun Kothari", id_num: "VU2024001", progress: "92%", status: "On Track" },
    { id: 2, name: "Sneha Reddy", id_num: "VU2024008", progress: "45%", status: "Needs Attention" },
    { id: 3, name: "Rahul Verma", id_num: "VU2024012", progress: "78%", status: "On Track" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-bold text-secondary">Student Directory</h1>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="h-10 pl-10 rounded-xl bg-muted/30 border-none" />
        </div>
        <Card className="p-0 border-none bg-muted/30 flex items-center justify-center h-10 w-10 shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Card>
      </div>

      <div className="space-y-3">
        {students.map((student) => (
          <Card key={student.id} className="border-none bg-white shadow-sm border-2 border-muted hover:border-primary/20 transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={`https://picsum.photos/seed/student-${student.id}/100/100`} />
                <AvatarFallback>{student.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-secondary truncate">{student.name}</h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">{student.id_num}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${student.status === 'On Track' ? 'text-green-500' : 'text-destructive'}`}>
                  {student.status}
                </p>
                <p className="text-[10px] text-muted-foreground">Progress: {student.progress}</p>
              </div>
              <MoreVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
