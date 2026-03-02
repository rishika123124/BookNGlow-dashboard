'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Scissors, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MALE_SALONS = [
  {
    name: "Velvet Grooming",
    area: "Rajpur Road",
    rating: "5.0",
    tags: ["Sharp Cut", "Luxury Beard", "Male Facial"],
    img: PlaceHolderImages.find(img => img.id === 'salon-velvet')?.imageUrl || "https://picsum.photos/seed/velvet/600/400"
  },
  {
    name: "Classic Cut Barbers",
    area: "Ballupur",
    rating: "4.8",
    tags: ["Sharp Cut", "Male Facial"],
    img: PlaceHolderImages.find(img => img.id === 'salon-classic')?.imageUrl || "https://picsum.photos/seed/classic/600/400"
  },
  {
    name: "The Doon Barbershop",
    area: "Jakhan",
    rating: "4.7",
    tags: ["Luxury Beard", "Sharp Cut"],
    img: PlaceHolderImages.find(img => img.id === 'category-male')?.imageUrl || "https://picsum.photos/seed/male/600/400"
  }
];

export default function MaleSalonsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-body relative overflow-hidden">
      {/* Subtle Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
        <Scissors className="w-[800px] h-[800px] -rotate-12" />
      </div>

      {/* Blue Gradient Highlight */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-600/20 via-transparent to-transparent pointer-events-none" />

      <Navbar />
      
      <main className="relative z-10 py-16 md:py-28">
        <div className="container mx-auto px-4 space-y-16 md:space-y-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <ShieldCheck className="h-4 w-4 text-blue-400" />
               <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-400">Verified Elite Partners</span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-white drop-shadow-sm leading-tight">
              Elite Grooming <br /> for Men
            </h1>
            <p className="text-white/60 text-lg md:text-2xl max-w-2xl mx-auto font-light tracking-wide italic">
              Discover Dehradun’s finest barbers and stylists crafted for the modern man.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MALE_SALONS.map((salon, i) => (
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
                  <Badge className="absolute top-6 left-6 bg-[#2563EB] text-white border-none font-bold shadow-lg shadow-blue-500/20">
                    URBAN PREMIUM
                  </Badge>
                </div>
                
                <div className="p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-3xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="h-4 w-4 text-blue-500/50" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-[9px] md:text-[10px] uppercase tracking-widest border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-300 font-bold bg-blue-500/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button className="w-full h-14 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-headline text-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 border-none group-hover:scale-[1.02]">
                      Book Your Slot
                    </Button>
                    <button className="w-full text-blue-400 text-sm font-semibold hover:underline transition-all">
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
