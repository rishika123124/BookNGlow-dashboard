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
  },
  {
    name: "Aura Unisex Lounge",
    area: "Jakhan",
    rating: "4.9",
    price: "Average",
    startingPrice: "₹750",
    tags: ["Global Color", "Hydra Facial"],
    img: PlaceHolderImages.find(img => img.id === 'salon-aura')?.imageUrl || "https://picsum.photos/seed/aura/600/400"
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
    <div className="min-h-screen bg-[#F1F5F9] text-[#333333] selection:bg-purple-200/50 font-body relative overflow-hidden">
      {/* Background Fusion Mesh Glows - Light Mix of Pink, Gray, and Purple */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#FDF2F8_0%,_#F1F5F9_50%,_#F3E8FF_100%)] opacity-70" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/30 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      
      <main className="relative z-10">
        <div className="sticky top-20 md:top-24 z-40 w-full bg-white/40 backdrop-blur-md border-b border-gray-200 py-4 px-4 shadow-sm">
          <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <Select onValueChange={setLocation} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-950/80 to-purple-950/80 border-white/20 text-white rounded-full transition-all hover:brightness-110 shadow-lg">
                    <SelectValue placeholder="📍 Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-[#333333]">
                    <SelectItem value="all">All Dehradun</SelectItem>
                    <SelectItem value="Rajpur Road">Rajpur Road</SelectItem>
                    <SelectItem value="Jakhan">Jakhan</SelectItem>
                    <SelectItem value="Ballupur">Ballupur</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setRating} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-950/80 to-purple-950/80 border-white/20 text-white rounded-full transition-all hover:brightness-110 shadow-lg">
                    <SelectValue placeholder="⭐ Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-[#333333]">
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">Top Rated (4.5+)</SelectItem>
                    <SelectItem value="4.0">Highly Recommended (4.0+)</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setPrice} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-950/80 to-purple-950/80 border-white/20 text-white rounded-full transition-all hover:brightness-110 shadow-lg">
                    <SelectValue placeholder="💰 Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-[#333333]">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="Low">Budget Friendly (Low)</SelectItem>
                    <SelectItem value="Average">Value for Money (Average)</SelectItem>
                    <SelectItem value="High">Luxury Treatment (High)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <span className="text-[10px] uppercase tracking-widest text-[#333333]/40 font-bold hidden lg:block">Discover Inclusive Spots in Doon</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-7xl text-[#333333] drop-shadow-sm leading-tight">
              Inclusive Styling for <span className="italic text-purple-600">Everyone</span>
            </h1>
            <p className="text-[#333333]/60 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide italic">
              Experience modern, inclusive styling for the whole family across Dehradun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredSalons.map((salon, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2.5rem] overflow-hidden bg-white/30 border border-white/50 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]"
              >
                <div className="relative h-64 md:h-72">
                  <Image src={salon.img} alt={salon.name} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" data-ai-hint="unisex salon interior" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-purple-600 text-white border-none font-bold shadow-lg">
                    {salon.price === 'High' ? 'MODERN LUXE' : 'INCLUSIVE'}
                  </Badge>
                  <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-[#333333] flex items-center gap-2 border border-white/20">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    Starts at {salon.startingPrice}
                  </div>
                </div>
                
                <div className="p-8 md:p-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline text-2xl md:text-3xl text-[#333333]">{salon.name}</h3>
                      <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-lg">{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#333333]/50 text-sm md:text-base">
                      <MapPin className="h-4 w-4 text-purple-600/60" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {salon.tags.map(tag => (
                      <span key={tag} className="text-[11px] uppercase tracking-[0.15em] border border-purple-200 bg-white/20 px-4 py-1.5 rounded-full text-[#333333]/70 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button className="w-full h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-headline text-xl transition-all duration-300 shadow-[0_10px_20px_rgba(124,58,237,0.2)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.3)] border-none">
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
