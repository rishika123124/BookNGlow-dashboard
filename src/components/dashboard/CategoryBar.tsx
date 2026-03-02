

import React from 'react'
import { Scissors, Sparkles, Flower2, Brush, Hand, Smile } from 'lucide-react'

const CATEGORIES = [
  { name: 'Hair', icon: Scissors },
  { name: 'Skin', icon: Sparkles },
  { name: 'Nails', icon: Hand },
  { name: 'Makeup', icon: Brush },
  { name: 'Spa', icon: Flower2 },
  { name: 'Grooming', icon: Smile },
]

export function CategoryBar() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto py-4">
        <div className="flex justify-center gap-10 md:gap-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className="p-3 rounded-full bg-gray-50 shadow-sm border border-transparent group-hover:border-primary group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300">
                <cat.icon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <span className="font-body text-sm font-medium text-foreground/70 group-hover:text-primary transition-colors uppercase tracking-wider">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

    