"use client"

import React from 'react'
import { Sparkles, ShieldCheck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 md:pt-24 pb-8 md:pb-12 mt-12 md:mt-24 w-full relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
          <div className="space-y-4 md:space-y-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-xl">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="font-headline text-2xl md:text-3xl tracking-tight">
                BookN<span className="text-accent">Glow</span>
              </span>
            </div>
            <p className="font-body text-white/60 leading-relaxed text-sm md:text-base">
              Elevating beauty standards through technology and refined luxury in the heart of Dehradun.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 text-center sm:text-left">
            <h4 className="font-headline text-lg md:text-xl">Popular Areas</h4>
            <ul className="font-body text-white/60 space-y-2 md:space-y-3 text-sm md:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Rajpur Road</li>
              <li className="hover:text-white cursor-pointer transition-colors">Jakhan</li>
              <li className="hover:text-white cursor-pointer transition-colors">Sahastradhara</li>
              <li className="hover:text-white cursor-pointer transition-colors">Ballupur</li>
            </ul>
          </div>

          <div className="space-y-4 md:space-y-6 text-center sm:text-left">
            <h4 className="font-headline text-lg md:text-xl">Top Salons</h4>
            <ul className="font-body text-white/60 space-y-2 md:space-y-3 text-sm md:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Aura Luxe Spa</li>
              <li className="hover:text-white cursor-pointer transition-colors">The Doon Mirror</li>
              <li className="hover:text-white cursor-pointer transition-colors">Velvet Grooming</li>
              <li className="hover:text-white cursor-pointer transition-colors">The Lush Studio</li>
            </ul>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h4 className="font-headline text-lg md:text-xl text-center sm:text-left">Newsletter</h4>
            <div className="flex flex-col gap-2">
              <Input placeholder="Your email" className="bg-white/5 border-white/10 text-white rounded-xl h-10 md:h-12 text-sm" />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-10 md:h-12 text-sm font-semibold">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex gap-4 md:gap-8">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
              <ShieldCheck className="h-4 w-4 md:h-6 md:w-6 text-primary" />
              <span className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest text-white/40">Verified</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
              <CreditCard className="h-4 w-4 md:h-6 md:w-6 text-accent" />
              <span className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest text-white/40">Secure</span>
            </div>
          </div>
          
          <p className="text-[10px] md:text-xs text-white/40 font-body">
            © 2024 BookNGlow Dehradun.
          </p>
          
          <div className="flex gap-6 md:gap-8 font-body text-[10px] md:text-xs text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
