'use client';

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Bell, SlidersHorizontal, Star, Clock } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const courses = [
  {
    id: 1,
    category: "COMPUTER SCIENCE",
    title: "Applied Machine Learning Fundamentals",
    description: "Master the core concepts of ML using Python. Perfect for beginners looking t...",
    hours: 12,
    price: "$49",
    rating: 4.9,
    reviews: "1.2k",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "DESIGN & UX",
    title: "Advanced UI Patterns & Glassmorphism",
    description: "Elevate your interface design with modern aesthetic principles and...",
    hours: 8,
    price: "$79",
    rating: 4.8,
    reviews: "850",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    category: "BUSINESS AI",
    title: "AI for Executive Decision Making",
    description: "Learn how to leverage generative AI models to analyze market trends and...",
    hours: 4,
    price: "Free",
    rating: 4.7,
    reviews: "2.1k",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
  }
]

export default function StudyHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All Courses")

  const tabs = ["All Courses", "Computer Science", "Design", "Business"]

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] -mt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-[#fafafa] sticky top-0 z-10">
        <Avatar className="h-10 w-10 shadow-sm border border-gray-100">
          <AvatarImage src="https://i.pravatar.cc/150?img=47" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="font-bold text-xl text-[#b84e14]">Nexlectra</span>
        <button className="text-gray-800 hover:opacity-70 transition-opacity">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mt-2 mb-6 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input 
            placeholder="What do you want to learn today?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-14 rounded-full bg-white border border-gray-200 focus-visible:ring-[#ff6b2b]/20 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]" 
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors border border-gray-100">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6 overflow-x-auto hide-scrollbar flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab 
                ? "bg-[#1a1e29] text-white shadow-md" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses */}
      <div className="px-4 space-y-6">
        {courses.map((course) => (
          <Card key={course.id} className="rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
            <div className="relative h-48 w-full">
              <Image 
                src={course.image} 
                alt={course.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-lg shadow-md">
                <span className={`font-bold text-sm ${course.price === 'Free' ? 'text-white' : 'text-[#ff6b2b]'}`}>
                  {course.price === 'Free' ? <span className="px-1 text-[#ff6b2b]">Free</span> : course.price}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#1a1e29]/80 backdrop-blur-md rounded-lg text-white flex items-center gap-1.5 shadow-lg">
                <Star className="h-3.5 w-3.5 fill-white" />
                <span className="font-semibold text-xs tracking-wide">{course.rating} ({course.reviews})</span>
              </div>
            </div>
            <CardContent className="p-5">
              <p className="text-[#64748b] text-[10px] font-bold tracking-widest uppercase mb-2">
                {course.category}
              </p>
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                {course.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-sm">{course.hours} Hours</span>
                </div>
                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl px-5 font-bold h-10 shadow-none">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
