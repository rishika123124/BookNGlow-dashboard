'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, MapPin, Phone, Clock, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function FemaleSalonsPage() {
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
          const femaleSalons = apiResponse.data.all.filter(
            (salon) => salon.gender === 'female'
          );
          setSalons(femaleSalons);
        } else {
          console.error('API response structure is invalid:', apiResponse);
          setSalons([]);
        }
      } catch (error) {
        console.error('Error fetching salons:', error);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const filteredSalons = salons.filter((salon) => {
    const matchesLocation = location === 'all' || salon.location === location;
    const matchesRating =
      rating === 'all' || (salon.rating && parseFloat(salon.rating) >= parseFloat(rating));
    const matchesPrice = price === 'all' || salon.price === price;

    return matchesLocation && matchesRating && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#C9A9A6] text-[#333333] font-body relative">
      <Navbar />

      <main className="relative z-10">

        {/* FILTER BAR */}

        <div className="top-20 z-40 w-full bg-[#BCA396]/40 backdrop-blur-md border-b py-4 px-4">
          <div className="container mx-auto flex flex-wrap gap-4">

            <Select onValueChange={setLocation} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-[#DB2777] text-white rounded-full">
                <SelectValue placeholder="Location" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Dehradun</SelectItem>
                <SelectItem value="Rajpur Road">Rajpur Road</SelectItem>
                <SelectItem value="Jakhan">Jakhan</SelectItem>
                <SelectItem value="Ballupur">Ballupur</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setRating} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-[#DB2777] text-white rounded-full">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">Top Rated (4.5+)</SelectItem>
                <SelectItem value="4.0">Highly Recommended (4.0+)</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setPrice} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-[#DB2777] text-white rounded-full">
                <SelectValue placeholder="Price" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>


        {/* TITLE */}

        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Women's Salons in Dehradun
          </h1>

          <p className="text-gray-600">
            Discover top salons for hair styling, skincare, makeup and beauty services.
          </p>
        </div>


        {/* SALON GRID */}

        <div className="container mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {loading ? (
            <div className="col-span-full flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <div
                key={salon._id}
                className="rounded-3xl overflow-hidden bg-white shadow-lg hover:scale-[1.02] transition"
              >
                <div className="relative h-64">
                  <Image
                    src={salon.images?.[0] || salon.image || salon.serviceImages?.[0] || "https://picsum.photos/seed/female-salon/600/400"}
                    alt={`${salon.salonName || salon.name || 'Female Salon'} - Beauty salon in Dehradun`}
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
                    <MapPin className="h-4 w-4 text-pink-500" />
                    {salon.location || salon.area || "Dehradun"}
                  </div>

                  {salon.contactInfo && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <Phone className="h-4 w-4 text-pink-500" />
                      <span>{salon.contactInfo}</span>
                    </div>
                  )}

                  {salon.openingTime && salon.closingTime && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                      <Clock className="h-4 w-4 text-pink-500" />
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
                            className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full border border-pink-200"
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
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    <Link href={`/salons/${salon._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">
              No female salons found
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}