'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const FEMALE_SALONS = [
  {
    name: "The Lush Studio",
    area: "Jakhan",
    rating: "4.7",
    price: "Average",
    startingPrice: "₹699",
    tags: ["Pro Makeup", "Nails"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/400"
  },
  {
    name: "Serene Day Spa",
    area: "Rajpur Road",
    rating: "4.9",
    price: "Average",
    startingPrice: "₹599",
    tags: ["Skin Care", "Massage"],
    img: PlaceHolderImages.find(img => img.id === 'salon-serene')?.imageUrl || "https://picsum.photos/seed/serene/600/400"
  },
  {
    name: "Glow Up Studio",
    area: "Rajpur Road",
    rating: "4.6",
    price: "Average",
    startingPrice: "₹499",
    tags: ["Facials", "Haircut"],
    img: PlaceHolderImages.find(img => img.id === 'salon-mirror')?.imageUrl || "https://picsum.photos/seed/glow/600/400"
  },
  {
    name: "The Beauty Hub",
    area: "Ballupur",
    rating: "4.5",
    price: "Average",
    startingPrice: "₹399",
    tags: ["Waxing", "Threading"],
    img: PlaceHolderImages.find(img => img.id === 'category-female')?.imageUrl || "https://picsum.photos/seed/beautyhub/600/400"
  },
  {
    name: "Elegance Salon",
    area: "Jakhan",
    rating: "4.8",
    price: "Average",
    startingPrice: "₹799",
    tags: ["Manicure", "Pedicure"],
    img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/elegance/600/400"
  }
];

export default function FemaleSalonsPage() {
  const [location, setLocation] = useState('all');
  const [rating, setRating] = useState('all');
  const [price, setPrice] = useState('all');

  const filteredSalons = FEMALE_SALONS.filter(salon => {
    if (location !== 'all' && salon.area !== location) return false;
    if (rating !== 'all' && parseFloat(salon.rating) < parseFloat(rating)) return false;
    if (price !== 'all' && salon.price !== price) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#C7B1A6] text-[#333333] selection:bg-[#BCA396]/30 font-body relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#D6C4BC_0%,_#C7B1A6_100%)]" />
      </div>

      <Navbar />
      
      <main className="relative z-10">
        {/* Sticky Filter Bar - Muted semi-transparent theme */}
        <div className="sticky top-20 md:top-24 z-40 w-full bg-[#BCA396]/40 backdrop-blur-md border-b border-white/20 py-4 px-4 shadow-sm">
          <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <Select onValueChange={setLocation} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-[#333333] rounded-full transition-all hover:bg-white/30">
                    <SelectValue placeholder="📍 Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FAF9F6] border-[#C7B1A6]/20 text-[#333333]">
                    <SelectItem value="all">All Dehradun</SelectItem>
                    <SelectItem value="Rajpur Road">Rajpur Road</SelectItem>
                    <SelectItem value="Jakhan">Jakhan</SelectItem>
                    <SelectItem value="Ballupur">Ballupur</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setRating} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-[#333333] rounded-full transition-all hover:bg-white/30">
                    <SelectValue placeholder="⭐ Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FAF9F6] border-[#C7B1A6]/20 text-[#333333]">
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">Top Rated (4.5+)</SelectItem>
                    <SelectItem value="4.0">Highly Recommended (4.0+)</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setPrice} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-[#333333] rounded-full transition-all hover:bg-white/30">
                    <SelectValue placeholder="💰 Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FAF9F6] border-[#C7B1A6]/20 text-[#333333]">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="Low">Budget Friendly (Low)</SelectItem>
                    <SelectItem value="Average">Value for Money (Average)</SelectItem>
                    <SelectItem value="High">Luxury Treatment (High)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <span className="text-[10px] uppercase tracking-widest text-[#333333]/40 font-bold hidden lg:block">Discover Salons for Women</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 space-y-16">
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-7xl text-[#333333] drop-shadow-sm leading-tight">
              Beauty & Spa Therapies for Women
            </h1>
            <p className="text-[#333333]/60 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide italic">
              Explore the most loved beauty and styling studios across Dehradun.
            </p>
          </div>

          {/* Salon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredSalons.map((salon, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2.5rem] overflow-hidden bg-white/20 border border-white/30 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(199,177,166,0.3)]"
              >
                <div className="relative h-64 md:h-72">
                  <Image 
                    src={salon.img} 
                    alt={salon.name} 
                    fill 
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" 
                    data-ai-hint="luxury spa interior"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C7B1A6]/40 via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-[#BCA396] text-[#FAF9F6] border-none font-bold shadow-lg">
                    {salon.price === 'High' ? 'PREMIUM' : 'CHIC'}
                  </Badge>
                  <div className="absolute bottom-6 right-6 bg-[#FAF9F6]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-[#333333] flex items-center gap-2 border border-white/20">
                    <Heart className="h-3.5 w-3.5 text-[#BCA396]" />
                    Starts at {salon.startingPrice}
                  </div>
                </div>
                
                <div className="p-8 md:p-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline text-2xl md:text-3xl text-[#333333]">{salon.name}</h3>
                      <div className="flex items-center gap-1.5 text-[#BCA396] font-bold">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-lg">{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#333333]/50 text-sm md:text-base">
                      <MapPin className="h-4 w-4 text-[#BCA396]/60" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {salon.tags.map(tag => (
                      <span key={tag} className="text-[11px] uppercase tracking-[0.15em] border border-[#BCA396]/20 bg-white/10 px-4 py-1.5 rounded-full text-[#333333]/70 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button className="w-full h-14 rounded-full bg-[#DB2777] hover:bg-[#C21E66] text-white font-headline text-xl transition-all duration-300 shadow-[0_10px_20px_rgba(219,39,119,0.2)] hover:shadow-[0_15px_30px_rgba(219,39,119,0.3)] border-none">
                      Book Appointment
                    </Button>
                    <button className="w-full mt-4 text-xs uppercase tracking-widest text-[#DB2777] hover:underline transition-all font-bold">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Luxury Watermark */}
        <div className="fixed bottom-0 right-0 p-10 opacity-[0.03] pointer-events-none select-none z-0">
           <svg 
             viewBox="0 0 100 100" 
             fill="none" 
             stroke="currentColor" 
             strokeWidth="0.5" 
             className="w-64 h-64 text-[#333333]"
           >
             <path d="M50 10C50 10 30 40 30 60C30 75 40 85 50 85C60 85 70 75 70 60C70 40 50 10 50 10Z" />
             <path d="M50 20C50 20 35 45 35 60C35 70 42 78 50 78C58 78 65 70 65 60C65 45 50 20 50 20Z" />
             <path d="M50 10L50 85" />
             <path d="M30 60C40 60 50 70 50 85" />
             <path d="M70 60C60 60 50 70 50 85" />
           </svg>
        </div>
      </main>

      <Footer />
    </div>
  );
}
