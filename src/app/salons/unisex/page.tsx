'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const UNISEX_SALONS = [
  {
    name: "The Doon Mirror",
    area: "Rajpur Road",
    rating: "4.8",
    price: "Average",
    startingPrice: "₹499",
    tags: ["Hair Styling", "Family Care"],
    img: PlaceHolderImages.find(img => img.id === 'salon-mirror')?.imageUrl || "https://picsum.photos/seed/mirror/600/400"
  },
  {
    name: "Universal Styles",
    area: "Ballupur",
    rating: "4.7",
    price: "Low",
    startingPrice: "₹249",
    tags: ["Family Care", "Basic Cut"],
    img: PlaceHolderImages.find(img => img.id === 'category-unisex')?.imageUrl || "https://picsum.photos/seed/unisex/600/400"
  },
  {
    name: "The Lush Studio",
    area: "Jakhan",
    rating: "4.7",
    price: "High",
    startingPrice: "₹1,099",
    tags: ["Advanced Spa", "Coloring"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/400"
  }
];

export default function UnisexSalonsPage() {
  const [location, setLocation] = useState('all');
  const [rating, setRating] = useState('all');
  const [price, setPrice] = useState('all');

  const filteredSalons = UNISEX_SALONS.filter(salon => {
    if (location !== 'all' && salon.area !== location) return false;
    if (rating !== 'all' && parseFloat(salon.rating) < parseFloat(rating)) return false;
    if (price !== 'all' && salon.price !== price) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-blue-500/20 to-purple-500/20 blur-[100px]" />
      </div>

      <Navbar />
      
      <main className="relative z-10">
        <div className="sticky top-20 md:top-24 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4 px-4 shadow-xl">
          <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <Select onValueChange={setLocation} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-950/80 to-purple-950/80 border-white/10 text-white rounded-full transition-all hover:brightness-110 shadow-lg">
                    <SelectValue placeholder="📍 Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Dehradun</SelectItem>
                    <SelectItem value="Rajpur Road">Rajpur Road</SelectItem>
                    <SelectItem value="Jakhan">Jakhan</SelectItem>
                    <SelectItem value="Ballupur">Ballupur</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setRating} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-950/80 to-purple-950/80 border-white/10 text-white rounded-full transition-all hover:brightness-110 shadow-lg">
                    <SelectValue placeholder="⭐ Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">Top Rated (4.5+)</SelectItem>
                    <SelectItem value="4.0">Highly Recommended (4.0+)</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setPrice} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-950/80 to-purple-950/80 border-white/10 text-white rounded-full transition-all hover:brightness-110 shadow-lg">
                    <SelectValue placeholder="💰 Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="Low">Budget Friendly (Low)</SelectItem>
                    <SelectItem value="Average">Value for Money (Average)</SelectItem>
                    <SelectItem value="High">Luxury Treatment (High)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold hidden lg:block">Showing Inclusive Spots in Doon</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-7xl text-white drop-shadow-sm leading-tight">
              Discover Salons for Everyone
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide italic">
              Experience modern, inclusive styling for the whole family across Dehradun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalons.map((salon, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/20 backdrop-blur-md shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image src={salon.img} alt={salon.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-purple-600 text-white border-none font-bold shadow-lg">
                    {salon.price === 'High' ? 'MODERN LUXE' : 'INCLUSIVE'}
                  </Badge>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    Starts at {salon.startingPrice}
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline text-2xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-purple-400 font-bold">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="h-3 w-3 text-purple-500/50" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Button className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-headline text-lg transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                      Check Availability
                    </Button>
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
