"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, Send, Copy, Loader2, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  timestamp: string;
  content?: React.ReactNode;
}

export default function LecturerAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "user",
      text: "Can you create a lesson plan for my Intro to UI Design class? It needs to cover basics, typography, and color theory for a 2-hour session.",
      timestamp: "10:42 AM"
    },
    {
      id: "2",
      sender: "ai",
      timestamp: "10:43 AM",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Lesson Plan: Intro to UI Design</h3>
            <Button variant="secondary" size="sm" className="h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full px-4">
              <Copy className="h-3 w-3 mr-2" /> Copy
            </Button>
          </div>
          <p className="text-gray-700 text-sm">Here is a structured 2-hour lesson plan for your Introduction to UI Design class.</p>
          
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-[#b84e14]">Session Overview</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li><strong>Duration:</strong> 120 Minutes</li>
              <li><strong>Objective:</strong> Understand foundational UI principles, typography hierarchy, and basic color theory application.</li>
              <li><strong>Materials:</strong> Presentation slides, Figma templates for exercises.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-[#b84e14]">Agenda</h4>
            
            <div className="border-l-2 border-gray-200 pl-4 py-1 space-y-1">
              <p className="text-sm font-bold text-[#ff6b2b]">0:00 - 0:30 | The Basics of UI</p>
              <p className="text-sm text-gray-600">Defining UI vs UX, common design patterns, and the concept of visual hierarchy. <span className="italic">Interactive Q&A: Good vs. Bad UI examples.</span></p>
            </div>
            
            <div className="border-l-2 border-gray-200 pl-4 py-1 space-y-1">
              <p className="text-sm font-bold text-[#ff6b2b]">0:30 - 1:00 | Typography Mastery</p>
              <p className="text-sm text-gray-600">Serif vs Sans-serif, setting up a type scale, readability vs legibility. <span className="italic">Exercise: Pair fonts for a fictional startup.</span></p>
            </div>
            
            <div className="border-l-2 border-gray-200 pl-4 py-1 space-y-1">
              <p className="text-sm font-bold text-[#ff6b2b]">1:00 - 1:45 | Color Theory & Application</p>
              <p className="text-sm text-gray-600">Color wheel basics, accessibility contrast, primary/secondary/accent ratios (60-30-10 rule). <span className="italic">Exercise: Build a cohesive color palette.</span></p>
            </div>
          </div>
        </div>
      )
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, newMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "I've drafted a response based on your recent lectures. Let me know if you need to adjust the tone.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-[85vh] -mt-6 bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-4 bg-white shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border shadow-sm">
            <AvatarImage src="https://i.pravatar.cc/150?u=dr_sarah" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <span className="font-bold text-lg text-[#b84e14]">Nexlectra</span>
        </div>
        <button className="text-[#ff6b2b] hover:opacity-70">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            {msg.sender === "ai" && (
              <div className="flex items-center gap-2 mb-2 ml-2">
                <div className="h-8 w-8 rounded-full bg-[#ff6b2b] flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-gray-800">Nexlectra AI</span>
              </div>
            )}
            
            {msg.sender === "user" ? (
              <div className="max-w-[85%]">
                <div className="bg-[#ff6b2b] text-white p-4 rounded-3xl rounded-tr-sm shadow-sm text-[15px] leading-relaxed">
                  {msg.text}
                </div>
                <p className="text-right text-[10px] text-gray-500 font-medium mt-1 mr-2">{msg.timestamp}</p>
              </div>
            ) : (
              <div className="w-full">
                <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
                  <CardContent className="p-6">
                    {msg.content || <p className="text-gray-800 text-[15px] leading-relaxed">{msg.text}</p>}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 mb-2 ml-2">
            <div className="h-8 w-8 rounded-full bg-[#ff6b2b] flex items-center justify-center text-white shadow-sm">
               <Sparkles className="h-4 w-4" />
            </div>
            <div className="bg-white p-4 rounded-3xl rounded-tl-sm flex gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white pt-2 pb-6 px-4 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {/* Quick Prompts */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3 -mx-4 px-4 pb-1">
          {["Draft Email to Students", "Create Lesson Plan", "Generate Quiz"].map((prompt, i) => (
            <button 
              key={i}
              onClick={() => setInput(prompt)}
              className="whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-full transition-colors border border-gray-200"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Co-Pilot..."
            className="h-14 rounded-full pl-6 pr-16 bg-white border border-gray-200 shadow-sm focus-visible:ring-[#ff6b2b]/20 text-[15px]"
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-1.5 h-11 w-11 rounded-full bg-[#ff6b2b] hover:bg-[#e05a21] text-white shadow-md transition-all"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
