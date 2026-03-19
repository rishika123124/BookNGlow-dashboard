'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Phone, Clock, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MALE_SALONS = [
  {
    id: "velvet-grooming",
    name: "Velvet Grooming",
    area: "Rajpur Road",
    rating: "5.0",
    price: "High",
    startingPrice: "₹899",
    tags: ["Sharp Cut", "Luxury Beard"],
    img: PlaceHolderImages.find(img => img.id === 'salon-velvet')?.imageUrl || "https://picsum.photos/seed/velvet/600/400"
  },
  {
    id: "classic-cut-barbers",
    name: "Classic Cut Barbers",
    area: "Ballupur",
    rating: "4.8",
    price: "Average",
    startingPrice: "₹599",
    tags: ["Traditional Cut", "Beard Styling"],
    img: PlaceHolderImages.find(img => img.id === 'salon-classic')?.imageUrl || "https://picsum.photos/seed/classic/600/400"
  },
  {
    id: "gents-corner",
    name: "Gents Corner",
    area: "Jakhan",
    rating: "4.7",
    price: "Low",
    startingPrice: "₹299",
    tags: ["Hair Styling", "Face Care"],
    img: PlaceHolderImages.find(img => img.id === 'salon-gents')?.imageUrl || "https://picsum.photos/seed/gents/600/400"
  },
  {
    id: "doon-barbershop",
    name: "The Doon Barbershop",
    area: "Jakhan",
    rating: "4.7",
    price: "Low",
    startingPrice: "₹299",
    tags: ["Basic Trim", "Quick Style"],
    img: PlaceHolderImages.find(img => img.id === 'category-male')?.imageUrl || "https://picsum.photos/seed/male/600/400"
  }
];

export default function MaleSalonsPage() {
  const [location, setLocation] = useState('all');
  const [rating, setRating] = useState('all');
  const [price, setPrice] = useState('all');
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await fetch('/api/salons');
        const apiResponse = await response.json();

        // Handle the correct API response structure
        if (apiResponse.success && apiResponse.data && Array.isArray(apiResponse.data.all)) {
          // Filter by gender
          const maleSalons = apiResponse.data.all.filter(salon => salon.gender === 'male');
          setSalons(maleSalons);
        } else {
          console.error('Male Page - API response structure is invalid:', apiResponse);
          setSalons([]);
        }
      } catch (error) {
        console.error('Male Page - Error fetching salons:', error);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const filteredSalons = salons.filter(salon => {
    const matchesLocation = location === 'all' || salon.location === location;
    const matchesRating = rating === 'all' || (salon.rating && parseFloat(salon.rating) >= parseFloat(rating));
    const matchesPrice = price === 'all' || salon.price === price;
    return matchesLocation && matchesRating && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#C9A9A6] text-white selection:bg-blue-500/30 font-body relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[130px] pointer-events-none opacity-20" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[130px] pointer-events-none opacity-20" />

      <Navbar />
      
      <main className="relative z-10">
        <div className="sticky top-20 md:top-24 z-40 w-full bg-[#020617]/80 backdrop-blur-md border-b border-white/10 py-4 px-4 shadow-2xl">
          <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <Select onValueChange={setLocation} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-blue-600 border-white/10 text-white rounded-full transition-all hover:bg-blue-700 shadow-lg border-none">
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
                  <SelectTrigger className="w-full md:w-[180px] bg-blue-600 border-white/10 text-white rounded-full transition-all hover:bg-blue-700 shadow-lg border-none">
                    <SelectValue placeholder="⭐ Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">Top Rated (4.5+)</SelectItem>
                    <SelectItem value="4.0">Highly Recommended (4.0+)</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={setPrice} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] bg-blue-600 border-white/10 text-white rounded-full transition-all hover:bg-blue-700 shadow-lg border-none">
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
             <span className="text-[10px] uppercase tracking-widest text-blue-400/60 font-bold hidden lg:block">
               Discover Top Rated Grooming Spots
             </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-7xl text-white drop-shadow-2xl leading-tight font-bold">
              Best Men's Salons in Dehradun
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto font-semibold tracking-wide">
              Book professional grooming services including haircuts, beard trims, facials and spa treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : filteredSalons.length > 0 ? (
              filteredSalons.map((salon) => (
              <div
                key={salon._id}
                className="rounded-3xl overflow-hidden bg-white shadow-lg hover:scale-[1.02] transition"
              >
                <div className="relative h-64">
                  <Image
                    src={salon.images?.[0] || salon.image || salon.serviceImages?.[0] || "https://picsum.photos/seed/male-salon/600/400"}
                    alt={`${salon.salonName || salon.name || 'Male Salon'} - Grooming salon in Dehradun`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {salon.salonName || salon.name}
                    </h3>

                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">{salon.rating || "4.5"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {salon.location || salon.area || "Dehradun"}
                  </div>

                  {salon.contactInfo && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span>{salon.contactInfo}</span>
                    </div>
                  )}

                  {salon.openingTime && salon.closingTime && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{salon.openingTime} AM – {salon.closingTime} PM</span>
                    </div>
                  )}

                  {salon.services && salon.services.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Popular Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {salon.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200"
                          >
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {salon.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    <Link href={`/salons/${salon._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-white mb-4">No Male Salons Found</h3>
                  <p className="text-white/80">We're constantly adding new salon partners. Check back soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
