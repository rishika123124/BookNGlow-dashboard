"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { AISearchDialog } from './AISearchDialog'

const LOCALITIES = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Sahastradhara'
]

export function Navbar() {
  const [locality, setLocality] = useState(LOCALITIES[0])

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FDFCFB]/90 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href="/" className="font-headline text-3xl tracking-tight text-foreground">
            BookN<span className="text-[#C5A059]">Glow</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 font-body text-lg">
          <Link href="/explore" className="text-foreground/80 hover:text-foreground transition-colors">
            Explore Salons
          </Link>
          <Link href="/offers" className="text-foreground/80 hover:text-foreground transition-colors">
            Offers
          </Link>
          <Link href="/help" className="text-foreground/80 hover:text-foreground transition-colors">
            Help
          </Link>
        </div>

        {/* Search and Location Section */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2 bg-white/50 border border-gray-100 rounded-full px-4 py-1 shadow-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors min-w-[120px]">
                <MapPin className="h-4 w-4 text-[#C5A059]" />
                <span className="truncate">{locality}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {LOCALITIES.map((loc) => (
                <DropdownMenuItem 
                  key={loc} 
                  onClick={() => setLocality(loc)}
                  className="font-body cursor-pointer"
                >
                  {loc}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-gray-200 mx-2" />
          
          <div className="flex-1 relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#C5A059] transition-colors" />
            <Input 
              placeholder="Search services or salons..." 
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-7 font-body placeholder:text-muted-foreground/60"
              readOnly
              onClick={() => (window as any).openAISearch?.(locality)}
            />
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="text-foreground/80 hover:text-foreground font-body font-medium text-lg transition-colors"
          >
            Log In
          </Link>
          <Button 
            className="bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-full px-8 font-body font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Sign Up
          </Button>
        </div>
      </div>
      <AISearchDialog />
    </nav>
  )
}