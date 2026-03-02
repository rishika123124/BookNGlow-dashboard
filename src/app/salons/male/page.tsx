'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Scissors, Zap, Smile } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MALE_SALONS = [
  {
    name: "Velvet Grooming",
    area: "Rajpur Road",
    rating: "5.0",
    tags: ["Haircut", "Beard Trim"],
    img: PlaceHolderImages.find(img => img.id === 'salon-velvet')?.imageUrl || "https://picsum.photos/seed/velvet/600/400"
  },
  {
    name: "Classic Cut Barbers",
    area: "Ballupur",
    rating: "4.8",
    tags: ["Facial", "Haircut"],
    img: PlaceHolderImages.find(img => img.id === 'salon-classic')?.imageUrl || "https://picsum.photos/seed/classic/600/400"
  },
  {
    name: "Sharp Styles",
    area: "Jakhan",
    rating: "4.7",
    tags: ["Grooming", "Beard Trim"],
    img: PlaceHolderImages.find(img => img.id === 'category-male')?.imageUrl || "https://picsum.photos/seed/male/600/400"
  }
];

export default function MaleSalonsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 font-body">
      <Navbar />
      
      <main className="py-12 md:py-24">
        <div className="container mx-auto px-4 space-y-12 md:space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-sm">
              Elite Grooming for Men in Dehradun
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
              Premium barbershops and styling studios crafted for the modern man in the Doon Valley.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Haircut', 'Beard Trim', 'Facial', 'Grooming'].map((filter) => (
                <button key={filter} className="px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 transition-all text-sm font-semibold tracking-wide">
                  #{filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MALE_SALONS.map((salon, i) => (
              <div key={i} className="group relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="relative h-64">
                  <Image src={salon.img} alt={salon.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-blue-500 text-white border-none font-bold">PREMIUM MALE</Badge>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline text-2xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{salon.area}, Dehradun</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 font-bold">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{salon.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 text-white/40">{tag}</span>
                    ))}
                  </div>

                  <Button className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
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
