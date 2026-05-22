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
  Info,
  ArrowLeft
} from "lucide-react"
import { aiDoubtAssistant } from "@/ai/flows/ai-doubt-assistant-flow"
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase'
import { collection, query, orderBy, doc } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIDoubtAssistant() {
  const router = useRouter()
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
        text: `Hello! I'm your Nexlectra AI Tutor. We were discussing advanced closure patterns in JavaScript last time. Would you like to continue, or explore something new today?`,
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
        preferredLanguage: 'English',
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
        description: "Nexlectra AI is having trouble connecting. Try again?"
      })
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[85vh] -mt-6 bg-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col border-b pb-4 bg-white shadow-sm z-10 sticky top-0 px-2">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
              <AvatarImage src="https://i.pravatar.cc/150?u=ai_tutor" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Nexlectra AI Tutor</h2>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                <p className="text-[11px] text-gray-500 font-medium">Online</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-gray-500"><MoreVertical className="h-5 w-5" /></Button>
        </div>

        {/* Lecture Context Selector */}
        <div className="mt-2 space-y-2">
          <Select value={selectedLectureId} onValueChange={setSelectedLectureId}>
            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-none shadow-none focus:ring-0 text-xs font-semibold px-4 text-gray-600">
              <SelectValue placeholder="Select lecture context (optional)" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-lg">
              {lecturesLoading ? (
                <div className="flex items-center justify-center p-6"><Loader2 className="h-5 w-5 animate-spin text-[#ff6b2b]" /></div>
              ) : lectures?.length ? (
                lectures.map((lec: any) => (
                  <SelectItem key={lec.id} value={lec.id} className="text-xs py-2 rounded-lg">
                    {lec.title} <span className="text-gray-400 ml-1">({lec.subject})</span>
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">No lectures recorded yet.</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-4 px-2" ref={scrollRef}>
        <div className="space-y-6 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'ai' ? (
                  <Avatar className="h-8 w-8 shrink-0 mt-auto mb-1 shadow-sm">
                    <AvatarImage src="https://i.pravatar.cc/150?u=ai_tutor" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8 shrink-0 mt-auto mb-1 shadow-sm">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-1">
                   <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                     msg.sender === 'user' 
                     ? 'bg-[#1a1e29] text-white rounded-br-sm' 
                     : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                   }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-3 ml-1">
               <Avatar className="h-8 w-8 shrink-0 mt-auto mb-1 shadow-sm">
                  <AvatarImage src="https://i.pravatar.cc/150?u=ai_tutor" />
                </Avatar>
                <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-bl-sm flex gap-1.5 shadow-sm">
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="py-3 border-t border-gray-100 bg-white mt-auto z-10 px-2 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input 
              placeholder="Ask AI Tutor..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="h-12 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-[#ff6b2b]/20 text-sm font-medium px-4"
            />
          </div>
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="shrink-0 h-12 w-12 rounded-full bg-[#ff6b2b] hover:bg-[#e05a21] text-white transition-all shadow-md"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
