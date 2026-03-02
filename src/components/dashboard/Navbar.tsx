
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ChevronDown, Menu, HelpCircle, Store, Sparkles, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { AISearchDialog } from './AISearchDialog'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const LOCALITIES = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Sahastradhara'
]

export function Navbar() {
  const [locality, setLocality] = useState(LOCALITIES[0])

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-white/10 h-20 md:h-24 flex items-center shadow-2xl">
      <div className="container mx-auto px-4 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Mobile Menu & Logo Section */}
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                <Menu className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-950 border-none w-[280px] sm:w-[350px] text-white">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="font-headline text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-2">
                  <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span>BookN<span className="text-accent">Glow</span></span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-5 sm:gap-6 font-body text-lg sm:text-xl">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Location</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-accent" />
                          <span>{locality}</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px] bg-slate-900 text-white border-white/10">
                      {LOCALITIES.map((loc) => (
                        <DropdownMenuItem key={loc} onClick={() => setLocality(loc)} className="font-body">
                          {loc}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <Link href="/" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <Store className="h-5 w-5" /> Home
                </Link>
                <Link href="#about-us" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <Sparkles className="h-5 w-5 text-pink-500" /> About Us ✨
                </Link>
                <Link href="/salons" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <Store className="h-5 w-5" /> Salons
                </Link>
                <Link href="/offers" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <Search className="h-5 w-5" /> Offers
                </Link>
                <Link href="/help" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <HelpCircle className="h-5 w-5" /> Help
                </Link>
                <div className="h-px bg-white/10 my-4" />
                <Link href="/login" className="text-white/80 hover:text-white py-2">Log In</Link>
                <Button className="bg-accent hover:bg-accent/90 text-white rounded-full w-full h-12 text-lg">Sign Up</Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group transition-all duration-300">
              <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-lg md:p-1.5 md:rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
                <Sparkles className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <span className="font-headline text-xl md:text-3xl tracking-tight text-white">
                BookN<span className="text-accent">Glow</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 font-body text-lg">
          <Link href="/" className="text-white/80 hover:text-white transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
          </Link>
          <Link href="#about-us" className="text-white/80 hover:text-white transition-colors relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
          </Link>
          <Link href="/salons" className="text-white/80 hover:text-white transition-colors relative group">
            Salons
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
          </Link>
          <Link href="/offers" className="text-white/80 hover:text-white transition-colors relative group">
            Offers
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
          </Link>
          <Link href="/help" className="text-white/80 hover:text-white transition-colors relative group">
            Help
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
          </Link>
        </div>

        {/* Search and Location Section (Desktop) */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 shadow-inner group/search-container mx-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-xs md:text-sm font-body font-medium text-white/70 hover:text-white transition-colors min-w-[100px] md:min-w-[120px]">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span className="truncate">{locality}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-slate-900 text-white border-white/10 rounded-xl">
              {LOCALITIES.map((loc) => (
                <DropdownMenuItem 
                  key={loc} 
                  onClick={() => setLocality(loc)}
                  className="font-body cursor-pointer hover:bg-white/10"
                >
                  {loc}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex-1 relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within/search-container:text-white transition-colors" />
            <Input 
              placeholder="Search services..." 
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-7 font-body text-white placeholder:text-white/40 cursor-pointer text-sm"
              readOnly
              onClick={() => (window as any).openAISearch?.(locality)}
            />
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          <Link 
            href="/login" 
            className="hidden sm:block text-white/80 hover:text-white font-body font-medium text-sm md:text-lg transition-colors"
          >
            Log In
          </Link>
          {/* Mobile search trigger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white/70"
            onClick={() => (window as any).openAISearch?.(locality)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-white rounded-full px-4 md:px-8 font-body font-semibold transition-all shadow-md active:scale-95 border-none h-9 md:h-12 text-xs md:text-base"
          >
            Sign Up
          </Button>
        </div>
      </div>
      <AISearchDialog />
    </nav>
  )
}
