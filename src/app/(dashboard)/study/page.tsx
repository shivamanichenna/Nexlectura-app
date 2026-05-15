'use client';

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Play, Clock, BookOpen, ChevronRight, Filter, Bookmark, Upload, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection } from '@/firebase'
import { collection, query, orderBy, where } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'

export default function StudyHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const db = useFirestore()

  // Define subjects
  const subjects = [
    { name: "Economics", color: "bg-orange-500", code: "ECO101" },
    { name: "Mathematics", color: "bg-blue-500", code: "MAT202" },
    { name: "Physics", color: "bg-purple-500", code: "PHY301" },
    { name: "DBMS", color: "bg-emerald-500", code: "CS401" },
  ]

  // Memoize the lectures query
  const lecturesQuery = useMemo(() => {
    if (!db) return null;
    let baseQuery = collection(db, 'lectures');
    
    if (selectedSubject) {
      return query(
        baseQuery,
        where('subject', '==', selectedSubject),
        orderBy('createdAt', 'desc')
      );
    }
    
    return query(baseQuery, orderBy('createdAt', 'desc'));
  }, [db, selectedSubject]);

  const { data: lectures, loading } = useCollection(lecturesQuery);

  const filteredLectures = lectures?.filter(lec => 
    lec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lec.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl font-headline font-bold text-secondary">Study Hub</h1>
        <p className="text-muted-foreground text-sm">Subject-wise learning & assignments.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20" 
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSelectedSubject(null)}
          className={`h-12 w-12 rounded-2xl ${!selectedSubject ? 'bg-primary/10 text-primary' : 'bg-muted/50'}`}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-6 border-b rounded-none w-full justify-start mb-6 overflow-x-auto no-scrollbar">
          <TabsTrigger value="subjects" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-bold px-0">Subjects</TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-bold px-0">Assignments</TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 font-bold px-0">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-8 m-0">
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((sub, i) => (
              <Card 
                key={i} 
                onClick={() => setSelectedSubject(sub.name)}
                className={`rounded-[2.5rem] border-none shadow-sm border-2 transition-all cursor-pointer group p-5 ${selectedSubject === sub.name ? 'border-primary bg-primary/5' : 'bg-white border-muted hover:border-primary/20'}`}
              >
                <div className={`h-14 w-14 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-lg mb-4 transition-transform group-hover:scale-110`}>
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                   <h4 className="font-bold text-secondary leading-tight">{sub.name}</h4>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">{sub.code}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-headline font-bold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {selectedSubject ? `${selectedSubject} Lectures` : 'Continue Learning'}
            </h3>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLectures && filteredLectures.length > 0 ? (
              <div className="space-y-3">
                {filteredLectures.map((lec: any) => (
                  <Link href={`/study/${lec.id}`} key={lec.id}>
                    <Card className="rounded-[2rem] border-none bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-2 border-muted hover:border-primary/20">
                      <CardContent className="p-4 flex gap-4">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                          <Image src={`https://picsum.photos/seed/${lec.id}/200/200`} alt="thumb" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-secondary text-sm leading-tight line-clamp-1">{lec.title}</h4>
                              {lec.status === 'processing' && (
                                <Badge variant="secondary" className="text-[8px] h-4 uppercase">Processing</Badge>
                              )}
                            </div>
                            <p className="text-[10px] text-primary font-bold uppercase mt-0.5">{lec.subject}</p>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Audio</span>
                            <span>
                              {lec.createdAt ? formatDistanceToNow(lec.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/20 rounded-3xl">
                <p className="text-sm text-muted-foreground">No lectures found for this criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
           <div className="text-center p-12 opacity-50">
             <BookOpen className="h-10 w-10 mx-auto mb-2" />
             <p className="text-sm">Your weekly assignments will appear here.</p>
           </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
           <div className="text-center p-12 opacity-50">
             <Bookmark className="h-10 w-10 mx-auto mb-2" />
             <p className="text-sm">Saved snippets and notes will appear here.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
