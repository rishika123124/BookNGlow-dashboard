'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Sparkles, Heart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const FEMALE_SALONS = [
  {
    name: "Aura Luxe Spa",
    area: "Jakhan",
    rating: "4.9",
    tags: ["Bridal", "Hair Spa", "Skin Care"],
    img: PlaceHolderImages.find(img => img.id === 'salon-aura')?.imageUrl || "https://picsum.photos/seed/aura/600/400"
  },
  {
    name: "The Lush Studio",
    area: "Jakhan",
    rating: "4.7",
    tags: ["Pro Makeup", "Hair Spa"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/400"
  },
  {
    name: "Serene Day Spa",
    area: "Rajpur Road",
    rating: "4.9",
    tags: ["Skin Care", "Bridal"],
    img: PlaceHolderImages.find(img => img.id === 'salon-serene')?.imageUrl || "https://picsum.photos/seed/serene/600/400"
  }
];

export default function FemaleSalonsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-pink-500/30 font-body relative overflow-hidden">
      {/* Subtle Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
        <Sparkles className="w-[800px] h-[800px] rotate-12" />
      </div>

      {/* Rose Pink Gradient Highlight */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-pink-600/20 via-transparent to-transparent pointer-events-none" />

      <Navbar />
      
      <main className="relative z-10 py-16 md:py-28">
        <div className="container mx-auto px-4 space-y-16 md:space-y-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Heart className="h-4 w-4 text-pink-400" />
               <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-pink-400">Chic & Luxury Discovery</span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-[#DB2777] to-white drop-shadow-sm leading-tight">
              Luxury Beauty <br /> for Women
            </h1>
            <p className="text-white/60 text-lg md:text-2xl max-w-2xl mx-auto font-light tracking-wide italic">
              Top-rated studios for your flawless look in the Doon Valley.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {FEMALE_SALONS.map((salon, i) => (
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
                  <Badge className="absolute top-6 left-6 bg-[#DB2777] text-white border-none font-bold shadow-lg shadow-pink-500/20">
                    VOGUE CHIC
                  </Badge>
                </div>
                
                <div className="p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-3xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-pink-400 font-bold bg-pink-400/10 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="h-4 w-4 text-pink-500/50" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-[9px] md:text-[10px] uppercase tracking-widest border border-pink-500/30 px-4 py-1.5 rounded-full text-pink-300 font-bold bg-pink-500/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button className="w-full h-14 rounded-full bg-[#DB2777] hover:bg-pink-700 text-white font-headline text-xl shadow-[0_0_30px_rgba(219,39,119,0.4)] transition-all duration-300 border-none group-hover:scale-[1.02]">
                      Book Appointment
                    </Button>
                    <button className="w-full text-pink-400 text-sm font-semibold hover:underline transition-all">
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
