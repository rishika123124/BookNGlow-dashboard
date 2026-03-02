'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Scissors } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MALE_SALONS = [
  {
    name: "Velvet Grooming",
    area: "Rajpur Road",
    rating: "5.0",
    price: "High",
    startingPrice: "₹899",
    tags: ["Sharp Cut", "Luxury Beard"],
    img: PlaceHolderImages.find(img => img.id === 'salon-velvet')?.imageUrl || "https://picsum.photos/seed/velvet/600/400"
  },
  {
    name: "Classic Cut Barbers",
    area: "Ballupur",
    rating: "4.8",
    price: "Average",
    startingPrice: "₹499",
    tags: ["Sharp Cut", "Male Facial"],
    img: PlaceHolderImages.find(img => img.id === 'salon-classic')?.imageUrl || "https://picsum.photos/seed/classic/600/400"
  },
  {
    name: "The Gent's Club",
    area: "Rajpur Road",
    rating: "4.7",
    price: "Average",
    startingPrice: "₹599",
    tags: ["Hair Styling", "Face Care"],
    img: PlaceHolderImages.find(img => img.id === 'salon-gents')?.imageUrl || "https://picsum.photos/seed/gents/600/400"
  },
  {
    name: "Doon Grooming Hub",
    area: "Jakhan",
    rating: "4.6",
    price: "Average",
    startingPrice: "₹450",
    tags: ["Beard Trim", "Haircut"],
    img: PlaceHolderImages.find(img => img.id === 'salon-hub')?.imageUrl || "https://picsum.photos/seed/hub/600/400"
  },
  {
    name: "Sharp Styles",
    area: "Ballupur",
    rating: "4.5",
    price: "Average",
    startingPrice: "₹400",
    tags: ["Quick Style", "Shave"],
    img: PlaceHolderImages.find(img => img.id === 'salon-sharp')?.imageUrl || "https://picsum.photos/seed/sharp/600/400"
  },
  {
    name: "The Doon Barbershop",
    area: "Jakhan",
    rating: "4.7",
    price: "Low",
    startingPrice: "₹299",
    tags: ["Basic Trim", "Quick Style"],
    img: PlaceHolderImages.find(img => img.id === 'category-male')?.imageUrl || "https://picsum.photos/seed/male/600/400"
  },
  {
    name: "Grooming Galore",
    area: "Jakhan",
    rating: "4.4",
    price: "Average",
    startingPrice: "₹350",
    tags: ["Classic Cut", "Beard Styling"],
    img: PlaceHolderImages.find(img => img.id === 'salon-hub')?.imageUrl || "https://picsum.photos/seed/galore/600/400"
  },
  {
    name: "The Barber's Den",
    area: "Rajpur Road",
    rating: "4.6",
    price: "Average",
    startingPrice: "₹480",
    tags: ["Premium Shave", "Face Massage"],
    img: PlaceHolderImages.find(img => img.id === 'salon-gents')?.imageUrl || "https://picsum.photos/seed/den/600/400"
  },
  {
    name: "Elite Cut",
    area: "Ballupur",
    rating: "4.5",
    price: "Average",
    startingPrice: "₹420",
    tags: ["Modern Fade", "Hair Treatment"],
    img: PlaceHolderImages.find(img => img.id === 'salon-classic')?.imageUrl || "https://picsum.photos/seed/elite/600/400"
  }
];

export default function MaleSalonsPage() {
  const [location, setLocation] = useState('all');
  const [rating, setRating] = useState('all');
  const [price, setPrice] = useState('all');

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-body relative overflow-hidden">
      {/* Mesh Glow Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none opacity-20" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <Navbar />
      
      <main className="relative z-10">
        {/* Sticky Filter Bar */}
        <div className="sticky top-20 md:top-24 z-40 w-full bg-slate-950/50 backdrop-blur-md border-b border-white/10 py-4 px-4 shadow-2xl">
          <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <Select onValueChange={setLocation} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10 text-white rounded-full transition-all hover:from-blue-600/30 hover:to-purple-600/30">
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
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10 text-white rounded-full transition-all hover:from-blue-600/30 hover:to-purple-600/30">
                    <SelectValue placeholder="⭐ Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">Top Rated (4.5+)</SelectItem>
                    <SelectItem value="4.0">Highly Recommended (4.0+)</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setPrice} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10 text-white rounded-full transition-all hover:from-blue-600/30 hover:to-purple-600/30">
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
             <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold hidden lg:block">
               Discover Top Rated Grooming Spots
             </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-7xl text-white drop-shadow-2xl leading-tight">
              Discover Salons for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 italic">Men</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide italic">
              Experience the peak of perfection and royal grooming in the heart of Dehradun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MALE_SALONS.map((salon, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2.5rem] overflow-hidden bg-slate-900/50 border border-blue-500/20 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-blue-500/50"
              >
                <div className="relative h-64">
                  <Image src={salon.img} alt={salon.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" data-ai-hint="barber interior" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white border-none font-bold shadow-lg">
                    {salon.price === 'High' ? 'LUXURY' : salon.price === 'Average' ? 'VALUE' : 'BUDGET'}
                  </Badge>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                    <Scissors className="h-3 w-3 text-blue-400" />
                    Starts at {salon.startingPrice}
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline text-2xl text-white transition-colors">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin className="h-3 w-3 text-blue-500/50" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {salon.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full text-white/60 bg-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Button className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-headline text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] border-none">
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
