"use client"

import { useState } from "react"
import { X, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export default function RevisionHub() {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Static flashcards for UI matching
  const flashcards = [
    {
      id: 1,
      question: "Self-Attention Mechanism",
      answer: "Self-attention allows the model to relate different positions of a single sequence in order to compute a representation of the sequence.\n\n• Computes attention weights for all words in a sentence relative to a target word.\n• Captures long-range dependencies better than RNNs.\n• Allows for parallel computation during training."
    }
  ]

  const currentCard = 12
  const totalCards = 20
  const progress = (currentCard / totalCards) * 100

  return (
    <div className="fixed inset-0 z-50 bg-[#161a23] text-white flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 mt-4">
        <Link href="/study" className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </Link>
        <h1 className="font-bold text-sm tracking-widest text-white/70 uppercase">
          Deep Learning
        </h1>
        <button className="p-2 -mr-2 text-white/70 hover:text-white transition-colors">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 flex items-center gap-4 mb-8">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#ff6b2b] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-white/90">
          {currentCard} / {totalCards}
        </span>
      </div>

      {/* Flashcard Area */}
      <div className="flex-1 px-6 pb-20 perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* Front (Question) */}
          <div className="absolute inset-0 w-full h-full bg-[#1e2330] rounded-[2.5rem] [backface-visibility:hidden] border border-white/5 shadow-[0_0_50px_rgba(255,107,43,0.05)] flex flex-col items-center justify-center p-10 text-center">
            <h2 className="text-3xl font-bold text-white leading-tight">
              {flashcards[0].question}
            </h2>
            <p className="absolute bottom-10 text-white/40 text-xs font-bold uppercase tracking-widest">
              Tap to flip
            </p>
          </div>

          {/* Back (Answer) */}
          <div className="absolute inset-0 w-full h-full bg-[#1e2330] rounded-[2.5rem] [backface-visibility:hidden] [transform:rotateY(180deg)] border border-white/5 shadow-[0_0_50px_rgba(255,107,43,0.05)] flex flex-col p-10 overflow-y-auto hide-scrollbar">
             <h2 className="text-2xl font-bold text-white leading-tight mb-8 text-center mt-auto">
               {flashcards[0].question}
             </h2>
             <div className="text-white/80 space-y-4 text-base leading-relaxed mb-auto">
               <p>Self-attention allows the model to relate different positions of a single sequence in order to compute a representation of the sequence.</p>
               <ul className="space-y-4 mt-6">
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0" />
                   <span>Computes attention weights for all words in a sentence relative to a target word.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0" />
                   <span>Captures long-range dependencies better than RNNs.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0" />
                   <span>Allows for parallel computation during training.</span>
                 </li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
