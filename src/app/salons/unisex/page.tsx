'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Sparkles, Users, Gem } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const UNISEX_SALONS = [
  {
    name: "The Doon Mirror",
    area: "Rajpur Road",
    rating: "4.8",
    tags: ["Hair Styling", "Family Care", "Advanced Treatments"],
    img: PlaceHolderImages.find(img => img.id === 'salon-mirror')?.imageUrl || "https://picsum.photos/seed/mirror/600/400"
  },
  {
    name: "Universal Styles",
    area: "Ballupur",
    rating: "4.7",
    tags: ["Family Care", "Massage"],
    img: PlaceHolderImages.find(img => img.id === 'category-unisex')?.imageUrl || "https://picsum.photos/seed/unisex/600/400"
  },
  {
    name: "The Lush Studio",
    area: "Jakhan",
    rating: "4.7",
    tags: ["Hair Styling", "Advanced Treatments"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/400"
  }
];

export default function UnisexSalonsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      {/* Subtle Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-[4rem] animate-[spin_20s_linear_infinite]">
          <Sparkles className="w-[800px] h-[800px]" />
        </div>
      </div>

      {/* Purple Gradient Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-600/20 via-transparent to-transparent pointer-events-none" />

      <Navbar />
      
      <main className="relative z-10 py-16 md:py-28">
        <div className="container mx-auto px-4 space-y-16 md:space-y-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Users className="h-4 w-4 text-purple-400" />
               <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-purple-400">Modern & Inclusive Studios</span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-white drop-shadow-sm leading-tight">
              Premium Unisex <br /> Studios
            </h1>
            <p className="text-white/60 text-lg md:text-2xl max-w-2xl mx-auto font-light tracking-wide italic">
              Grooming for Everyone, Every Day in the heart of Dehradun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {UNISEX_SALONS.map((salon, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:scale-[1.02] transition-all duration-500"
              >
                <div className="relative h-72">
                  <Image 
                    src={salon.img} 
                    alt={salon.name} 
                    fill 
                    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-[#7C3AED] text-white border-none font-bold shadow-lg shadow-purple-500/20">
                    INCLUSIVE LUXE
                  </Badge>
                </div>
                
                <div className="p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-3xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-purple-400 font-bold bg-purple-400/10 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="h-4 w-4 text-purple-500/50" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-[9px] md:text-[10px] uppercase tracking-widest border border-purple-500/30 px-4 py-1.5 rounded-full text-purple-300 font-bold bg-purple-500/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button className="w-full h-14 rounded-full bg-[#7C3AED] hover:bg-purple-700 text-white font-headline text-xl shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300 border-none group-hover:scale-[1.02]">
                      Book Your Experience
                    </Button>
                    <button className="w-full text-purple-400 text-sm font-semibold hover:underline transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
