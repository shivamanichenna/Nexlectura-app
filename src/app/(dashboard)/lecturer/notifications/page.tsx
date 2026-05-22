"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ComposeNotification() {
  const { toast } = useToast()
  
  const [recipients, setRecipients] = useState(["CSE-A", "Design 101"])
  const [announcement, setAnnouncement] = useState("")
  const [urgency, setUrgency] = useState("Medium")
  const [isSending, setIsSending] = useState(false)

  const removeRecipient = (rec: string) => {
    setRecipients(recipients.filter(r => r !== rec))
  }

  const handleSend = () => {
    if (!announcement || recipients.length === 0) return
    setIsSending(true)
    
    setTimeout(() => {
      setIsSending(false)
      setAnnouncement("")
      toast({
        title: "Alert Sent",
        description: `Notification sent to ${recipients.length} recipients.`,
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans pb-24 px-6 mt-4">
      <div className="space-y-1 mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Compose Notification</h1>
        <p className="text-gray-600 font-medium text-[15px]">Send an alert to classes or individual students.</p>
      </div>

      <div className="space-y-6">
        {/* Recipients */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[15px]">Recipients</label>
          <div className="min-h-[100px] bg-[#fafafa] border border-gray-200 rounded-3xl p-4 shadow-sm focus-within:border-[#ff6b2b] transition-colors">
            <div className="flex flex-wrap gap-2 mb-3">
              {recipients.map(rec => (
                <div key={rec} className="flex items-center gap-1.5 bg-[#ffebdb] text-[#b04a11] px-3 py-1.5 rounded-full text-sm font-medium">
                  {rec}
                  <button onClick={() => removeRecipient(rec)} className="hover:opacity-70">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="Search classes or students..." 
              className="bg-transparent border-none outline-none text-gray-600 text-[15px] placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        {/* Announcement */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[15px]">Announcement</label>
          <textarea 
            className="w-full min-h-[180px] bg-[#fafafa] border border-gray-200 rounded-3xl p-5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#ff6b2b] focus:outline-none transition-colors resize-none shadow-sm"
            placeholder="Type your message here..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
        </div>

        {/* Urgency Level */}
        <div className="space-y-2">
          <label className="text-gray-900 font-bold text-[15px]">Urgency Level</label>
          <div className="flex bg-[#f2f2f2] rounded-[1.25rem] p-1.5">
            {["Low", "Medium", "Critical"].map(level => (
              <button
                key={level}
                onClick={() => setUrgency(level)}
                className={`flex-1 py-3 text-[15px] font-bold rounded-[1rem] transition-all ${urgency === level ? 'bg-white text-[#ff6b2b] shadow-sm' : 'text-gray-600 hover:bg-gray-200/50'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            className="w-full h-[60px] rounded-[1.5rem] bg-[#ff6b2b] hover:bg-[#e65c20] text-white text-lg font-bold shadow-md shadow-[#ff6b2b]/20 flex items-center justify-center gap-2"
            onClick={handleSend}
            disabled={isSending || !announcement || recipients.length === 0}
          >
            <Send className="h-5 w-5 -ml-1" />
            {isSending ? "Sending..." : "Send Alert"}
          </Button>
        </div>
      </div>
    </div>
  )
}
