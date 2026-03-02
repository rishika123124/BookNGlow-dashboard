"use client"

import React from 'react'
import { Navbar } from '@/components/dashboard/Navbar'
import { Footer } from '@/components/dashboard/Footer'
import { Input } from '@/components/ui/input'
import { Search, Calendar, RefreshCw, MapPin, MessageCircle, PhoneCall, Sparkles, ChevronRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function HelpPage() {
  const categories = [
    {
      title: 'Booking Issues',
      desc: 'Facing trouble selecting a slot or salon in Dehradun? Learn how to book in 3 easy steps and secure your luxury experience.',
      icon: <Calendar className="h-6 w-6 text-cyan-400" />,
      img: PlaceHolderImages.find(img => img.id === 'help-booking')?.imageUrl || "https://picsum.photos/seed/booking/600/400",
      color: 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      accent: 'text-cyan-400'
    },
    {
      title: 'Cancel or Reschedule',
      desc: 'Plans changed? Our flexible policy allows you to easily cancel or move your appointment to a better time at no extra cost.',
      icon: <RefreshCw className="h-6 w-6 text-rose-400" />,
      img: PlaceHolderImages.find(img => img.id === 'help-cancel')?.imageUrl || "https://picsum.photos/seed/cancel/600/400",
      color: 'border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.3)]',
      accent: 'text-rose-400'
    },
    {
      title: 'Locate Your Salon',
      desc: "Can't find the salon on the map? Get direct directions, floor details, and contact person details for a smooth arrival.",
      icon: <MapPin className="h-6 w-6 text-violet-400" />,
      img: PlaceHolderImages.find(img => img.id === 'help-locate')?.imageUrl || "https://picsum.photos/seed/locate/600/400",
      color: 'border-violet-500/60 shadow-[0_0_30px_rgba(139,92,246,0.3)]',
      accent: 'text-violet-400'
    }
  ]

  const faqs = [
    {
      q: 'How do I book a premium salon on Rajpur Road?',
      a: 'Simply use our interactive map or salon grid on the homepage. Filter by #RajpurRoad, select your preferred salon, and choose an available slot. You will receive an instant confirmation via SMS and email.'
    },
    {
      q: 'Is there a booking fee?',
      a: 'BookNGlow provides a seamless platform for discovery at no extra cost to our users. You only pay for the services you avail at the salon.'
    },
    {
      q: 'Can I reschedule my appointment?',
      a: 'Yes, you can reschedule your appointment up to 2 hours before the scheduled time through your Account Dashboard. Changes are subject to availability at the selected salon.'
    }
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 font-body scroll-smooth">
      <Navbar />
      
      <main>
        {/* 1. Page Header (The Search) */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-purple-900 via-slate-950 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 -left-1/4 w-full h-full bg-purple-600/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -right-1/4 w-full h-full bg-blue-600/30 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
            <h1 className="font-headline text-4xl md:text-6xl text-white tracking-tight">
              How can we help you, <span className="text-accent italic">Doon?</span>
            </h1>
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
              <Input 
                placeholder="Search for issues (e.g., booking, refund, salons)..." 
                className="h-14 md:h-18 rounded-full bg-white/10 border-white/20 pl-16 text-white placeholder:text-white/30 focus:ring-purple-500 focus:bg-white/15 transition-all text-sm md:text-lg backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              />
            </div>
          </div>
        </section>

        {/* 2. Help Categories (The Grid) */}
        <section className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div 
                key={i}
                className={`group rounded-[2.5rem] bg-slate-900/50 backdrop-blur-xl border ${cat.color} overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer flex flex-col`}
              >
                <div className="relative h-48 w-full">
                  <Image 
                    src={cat.img} 
                    alt={cat.title} 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                    data-ai-hint="help center category"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute top-6 left-6 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <h3 className="font-headline text-2xl text-white flex items-center gap-2">
                    {cat.title}
                    <ChevronRight className={`h-5 w-5 ${cat.accent} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all`} />
                  </h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    {cat.desc}
                  </p>
                  <Button variant="link" className={`p-0 h-auto ${cat.accent} font-bold text-xs uppercase tracking-[0.2em]`}>
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Top FAQs (Accordions) */}
        <section className="container mx-auto px-4 py-24 max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-headline text-3xl md:text-5xl text-foreground">Top Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm px-6 md:px-8 data-[state=open]:border-pink-500/50 data-[state=open]:bg-white transition-all shadow-sm"
              >
                <AccordionTrigger className="font-headline text-lg md:text-xl text-left hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm md:text-base text-muted-foreground pb-8 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 4. 'Still Need Help?' (Floating Support) */}
        <section className="container mx-auto px-4 pb-24">
          <div className="rounded-[3rem] bg-slate-950 p-12 md:p-20 relative overflow-hidden text-center space-y-12 shadow-[0_0_80px_rgba(124,58,237,0.1)]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/20 blur-[100px]" />
            </div>

            <div className="space-y-4 relative z-10">
              <h2 className="font-headline text-3xl md:text-5xl text-white">Still Need Help?</h2>
              <p className="text-white/40 text-sm md:text-lg max-w-xl mx-auto">
                Our luxury concierge is available 24/7 to assist with your grooming needs in the Doon Valley.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
              <Button className="h-16 px-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-headline text-xl gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <MessageCircle className="h-6 w-6" />
                WhatsApp Support
              </Button>
              <div className="flex items-center gap-4 p-4 rounded-full bg-white/5 border border-white/10 px-8">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <PhoneCall className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Local Call</span>
                  <p className="text-white font-mono text-lg">+91-135-BOOK-GLOW</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-8 opacity-40">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs text-white uppercase tracking-[0.2em]">Dehradun HQ Verified</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
