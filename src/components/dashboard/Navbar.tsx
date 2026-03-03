
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown, Menu, HelpCircle, Store, Sparkles, Scissors, Heart, Users, User as UserIcon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { AISearchDialog } from './AISearchDialog'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useUser, useAuth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useToast } from '@/hooks/use-toast'

const LOCALITIES = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Sahastradhara'
]

export function Navbar() {
  const [locality, setLocality] = useState(LOCALITIES[0])
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "See you again soon!" });
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
              <div className="flex flex-col gap-5 sm:gap-6 font-body text-lg sm:text-xl overflow-y-auto max-h-[80vh] pb-10">
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
                <div className="flex flex-col gap-3">
                   <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Our Salons</span>
                   <Link href="/salons/male" className="flex items-center gap-3 text-white/60 hover:text-white pl-4">
                     <Scissors className="h-4 w-4 text-blue-400" /> For Men
                   </Link>
                   <Link href="/salons/female" className="flex items-center gap-3 text-white/60 hover:text-white pl-4">
                     <Heart className="h-4 w-4 text-pink-500" /> For Women
                   </Link>
                   <Link href="/salons/unisex" className="flex items-center gap-3 text-white/60 hover:text-white pl-4">
                     <Users className="h-4 w-4 text-purple-400" /> Unisex
                   </Link>
                </div>
                <Link href="/help" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <HelpCircle className="h-5 w-5" /> Help
                </Link>
                {!isUserLoading && !user && (
                  <Link href="/login" className="mt-4">
                    <Button className="w-full bg-purple-600 rounded-xl py-6">Sign In</Button>
                  </Link>
                )}
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white/80 hover:text-white transition-colors relative group flex items-center gap-1 outline-none">
                Salons
                <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white rounded-2xl shadow-2xl p-2">
              <DropdownMenuItem asChild className="focus:bg-white/10 rounded-xl cursor-pointer py-3 px-4">
                <Link href="/salons/male" className="flex items-center gap-3">
                  <Scissors className="h-4 w-4 text-blue-400" /> For Men
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/10 rounded-xl cursor-pointer py-3 px-4">
                <Link href="/salons/female" className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-pink-500" /> For Women
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/10 rounded-xl cursor-pointer py-3 px-4">
                <Link href="/salons/unisex" className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-purple-400" /> Unisex
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        <div className="flex items-center gap-4">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-purple-600 p-0 overflow-hidden border border-white/10">
                  <UserIcon className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-white/10 text-white rounded-2xl p-2" align="end">
                <div className="px-4 py-3">
                  <p className="text-sm font-bold truncate">{user.displayName || 'Glow Member'}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-white/10 rounded-xl cursor-pointer">
                  <Link href="/help" className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4" /> Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/20 text-red-400 rounded-xl cursor-pointer">
                  <LogOut className="h-4 w-4 mr-3" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:flex rounded-full bg-purple-600 hover:bg-purple-700 text-white border-none px-6">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

      </div>
      <AISearchDialog />
    </nav>
  )
}
