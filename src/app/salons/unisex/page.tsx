'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Globe, Gem } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const UNISEX_SALONS = [
  {
    name: "The Doon Mirror",
    area: "Rajpur Road",
    rating: "4.8",
    tags: ["Spa", "Global Hair Color"],
    img: PlaceHolderImages.find(img => img.id === 'salon-mirror')?.imageUrl || "https://picsum.photos/seed/mirror/600/400"
  },
  {
    name: "Universal Styles",
    area: "Ballupur",
    rating: "4.7",
    tags: ["Family Packages", "Hair Styling"],
    img: PlaceHolderImages.find(img => img.id === 'category-unisex')?.imageUrl || "https://picsum.photos/seed/unisex/600/400"
  },
  {
    name: "The Lush Studio",
    area: "Jakhan",
    rating: "4.7",
    tags: ["Spa", "Facial"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/400"
  }
];

export default function UnisexSalonsPage() {
  return (
    <div className="min-h-screen bg-[#0f111a] text-white selection:bg-purple-500/30 font-body">
      <Navbar />
      
      <main className="py-12 md:py-24">
        <div className="container mx-auto px-4 space-y-12 md:space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 drop-shadow-sm">
              Premium Unisex Studios in Dehradun
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto italic font-light tracking-wide">
              The finest inclusive styling and care for everyone in the heart of Uttarakhand.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Family Packages', 'Spa', 'Global Hair Color', 'Styling'].map((filter) => (
                <button key={filter} className="px-6 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/20 transition-all text-sm font-semibold tracking-wide text-purple-300">
                  #{filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {UNISEX_SALONS.map((salon, i) => (
              <div key={i} className="group relative rounded-[3rem] overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-72">
                  <Image src={salon.img} alt={salon.name} fill className="object-cover opacity-60 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 p-2 rounded-xl bg-purple-600/20 backdrop-blur-md border border-purple-500/30">
                     <Gem className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                
                <div className="p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline text-3xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-purple-400 font-bold">
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
                      <span key={tag} className="text-[9px] uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-white/40 font-bold">{tag}</span>
                    ))}
                  </div>

                  <Button className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-headline text-xl shadow-[0_0_30px_rgba(124,58,237,0.4)] border-none">
                    Book Now
                  </Button>
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
