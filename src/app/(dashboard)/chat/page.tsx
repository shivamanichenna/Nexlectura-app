"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowLeft,
  Search,
  Book,
  Lightbulb,
  MoreVertical
} from "lucide-react"
import { aiDoubtAssistant } from "@/ai/flows/ai-doubt-assistant-flow"

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIDoubtAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi Arjun! I'm Vani, your AI classroom companion. Ask me anything about your current Macroeconomics lecture. I can explain in English or Telugu!",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
      // Using the real AI flow
      const response = await aiDoubtAssistant({
        question: input,
        lectureContent: "Macroeconomics: Supply and Demand. Fundamental Law: Price up, Demand down. Examples: Movie tickets, Apple prices.",
        userLearningStyle: 'mixed',
        preferredLanguage: 'English-Telugu mix',
        chatHistory: messages.map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
      })

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error(error)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[85vh] -mt-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="https://picsum.photos/seed/wani-ai/100/100" />
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-secondary text-sm">Vani AI Assistant</h2>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online & Thinking</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><Search className="h-5 w-5" /></Button>
           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 pr-4 py-4" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'ai' && (
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarImage src="https://picsum.photos/seed/wani-ai/100/100" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                )}
                <div className={`space-y-1`}>
                   <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                     msg.sender === 'user' 
                     ? 'bg-primary text-white rounded-tr-none' 
                     : 'bg-white border text-secondary rounded-tl-none'
                   }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-muted-foreground ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-2">
               <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src="https://picsum.photos/seed/wani-ai/100/100" />
                </Avatar>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
         {[
           { label: "Explain Simply", icon: Sparkles },
           { label: "Exam Answer", icon: Lightbulb },
           { label: "Telugu Explain", icon: Book },
         ].map((item, idx) => (
           <Button key={idx} variant="outline" size="sm" className="whitespace-nowrap rounded-full h-8 text-[11px] font-bold gap-1.5 border-muted">
             <item.icon className="h-3 w-3 text-primary" />
             {item.label}
           </Button>
         ))}
      </div>

      {/* Input */}
      <div className="py-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 h-12 w-12 rounded-2xl bg-muted/50 text-muted-foreground">
            <Mic className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input 
              placeholder="Ask a doubt..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="h-12 pr-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 h-12 w-12 rounded-2xl shadow-lg shadow-primary/20"
          >
            <Send className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  )
}
