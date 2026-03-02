'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Sparkles, Heart, Flower2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const FEMALE_SALONS = [
  {
    name: "Aura Luxe Spa",
    area: "Jakhan",
    rating: "4.9",
    tags: ["Skin Care", "Spa"],
    img: PlaceHolderImages.find(img => img.id === 'salon-aura')?.imageUrl || "https://picsum.photos/seed/aura/600/400"
  },
  {
    name: "The Lush Studio",
    area: "Jakhan",
    rating: "4.7",
    tags: ["Bridal", "Hair Styling"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/400"
  },
  {
    name: "Serene Day Spa",
    area: "Rajpur Road",
    rating: "4.9",
    tags: ["Manicure", "Skin Care"],
    img: PlaceHolderImages.find(img => img.id === 'salon-serene')?.imageUrl || "https://picsum.photos/seed/serene/600/400"
  }
];

export default function FemaleSalonsPage() {
  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-900 selection:bg-pink-500/20 font-body">
      <Navbar />
      
      <main className="py-12 md:py-24">
        <div className="container mx-auto px-4 space-y-12 md:space-y-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 drop-shadow-sm">
              Luxury Beauty for Women in Dehradun
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
              Exquisite makeup studios and luxury beauty hubs for the ultimate glow in Doon.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Bridal', 'Manicure', 'Hair Styling', 'Skin Care'].map((filter) => (
                <button key={filter} className="px-6 py-2 rounded-full border border-pink-200 bg-white hover:bg-pink-50 transition-all text-sm font-semibold tracking-wide text-pink-600 shadow-sm">
                  #{filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEMALE_SALONS.map((salon, i) => (
              <div key={i} className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-pink-100 shadow-xl hover:scale-[1.02] transition-all duration-500">
                <div className="relative h-64">
                  <Image src={salon.img} alt={salon.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-pink-500 text-white border-none font-bold">TOP RATED FEMALE</Badge>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline text-2xl text-slate-900">{salon.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{salon.area}, Dehradun</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-pink-500 font-bold">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{salon.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full text-pink-600 font-bold">{tag}</span>
                    ))}
                  </div>

                  <Button className="w-full h-12 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg shadow-[0_10px_20px_rgba(219,39,119,0.2)] border-none">
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
