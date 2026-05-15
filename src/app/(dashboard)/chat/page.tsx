'use client';

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Sparkles, 
  Lightbulb, 
  MoreVertical, 
  Loader2, 
  BookOpen,
  MessageSquare,
  Info
} from "lucide-react"
import { aiDoubtAssistant } from "@/ai/flows/ai-doubt-assistant-flow"
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase'
import { collection, query, orderBy, doc } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIDoubtAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedLectureId, setSelectedLectureId] = useState<string>("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  // Fetch student profile for learning style
  const studentRef = useMemo(() => (db && user ? doc(db, 'students', user.uid) : null), [db, user]);
  const { data: profile } = useDoc(studentRef);

  // Fetch lectures for context selection
  const lecturesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'lectures'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: lectures, loading: lecturesLoading } = useCollection(lecturesQuery);

  const selectedLecture = useMemo(() => {
    return lectures?.find(l => l.id === selectedLectureId);
  }, [lectures, selectedLectureId]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: `Hi ${profile?.name?.split(' ')[0] || 'there'}! I'm Vani, your AI classroom companion. Select a lecture above and ask me anything about it. I speak Telglish, Hinglish, and English!`,
        sender: 'ai',
        timestamp: new Date()
      }
    ])
  }, [profile])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const contextContent = selectedLecture?.transcript || selectedLecture?.title || "General classroom context.";
      
      const response = await aiDoubtAssistant({
        question: input,
        lectureContent: contextContent,
        userLearningStyle: 'mixed',
        preferredLanguage: 'English-Telugu mix',
        chatHistory: messages.slice(-5).map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
      })

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])

      if (response.suggestedFollowUpQuestions?.length) {
        // Option to display suggestions in UI later
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Connection Snag",
        description: "Vani is having trouble connecting. Try again?"
      })
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[85vh] -mt-6">
      {/* Header */}
      <div className="flex flex-col border-b pb-4 bg-background z-10 sticky top-0">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg">
                <AvatarImage src="https://picsum.photos/seed/wani-ai/200/200" />
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-secondary text-sm">Vani AI Tutor</h2>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Online & Ready</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10"><MoreVertical className="h-5 w-5 text-muted-foreground" /></Button>
        </div>

        {/* Lecture Context Selector */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Lecture Context</span>
          </div>
          <Select value={selectedLectureId} onValueChange={setSelectedLectureId}>
            <SelectTrigger className="h-12 rounded-2xl bg-muted/40 border-none shadow-none focus:ring-0 text-xs font-bold px-4">
              <SelectValue placeholder="Which class are we discussing?" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-muted shadow-2xl">
              {lecturesLoading ? (
                <div className="flex items-center justify-center p-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : lectures?.length ? (
                lectures.map((lec: any) => (
                  <SelectItem key={lec.id} value={lec.id} className="text-xs py-3 rounded-xl focus:bg-primary/5">
                    {lec.title} <span className="text-muted-foreground ml-1">({lec.subject})</span>
                  </SelectItem>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">No lectures recorded yet.</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-4" ref={scrollRef}>
        <div className="space-y-6 pb-4">
          {!selectedLectureId && (
            <div className="bg-accent/50 p-6 rounded-3xl border border-primary/10 flex items-start gap-4 mx-2">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-secondary">Start with Context</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Select a lecture above so Vani can use your specific classroom notes to answer doubts.</p>
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'ai' && (
                  <Avatar className="h-9 w-9 shrink-0 mt-1 shadow-sm">
                    <AvatarImage src="https://picsum.photos/seed/wani-ai/100/100" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-1.5">
                   <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                     msg.sender === 'user' 
                     ? 'bg-primary text-white rounded-tr-none' 
                     : 'bg-white border-2 border-muted/50 text-secondary rounded-tl-none'
                   }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] font-bold text-muted-foreground/60 ${msg.sender === 'user' ? 'text-right mr-1' : 'text-left ml-1'}`}>
                    {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-3 ml-1">
               <Avatar className="h-9 w-9 shrink-0 shadow-sm">
                  <AvatarImage src="https://picsum.photos/seed/wani-ai/100/100" />
                </Avatar>
                <div className="bg-muted/30 p-4 rounded-3xl rounded-tl-none flex gap-1.5">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="py-4 border-t bg-background mt-auto z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 h-14 w-14 rounded-2xl bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
            <Mic className="h-6 w-6" />
          </Button>
          <div className="flex-1 relative">
            <Input 
              placeholder={selectedLectureId ? "Ask a doubt about this class..." : "Select context above..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="h-14 pr-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 text-sm font-medium"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !selectedLectureId}
            className="shrink-0 h-14 w-14 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95"
          >
            <Send className="h-6 w-6 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  )
}
