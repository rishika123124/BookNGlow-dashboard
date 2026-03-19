'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  Scissors, 
  TrendingUp,
  Store,
  Phone,
  MapPin,
  Star,
  Plus,
  Edit
} from 'lucide-react';

export default function SalonDashboardPage() {
  const router = useRouter();
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalonData();
  }, []);

  const fetchSalonData = async () => {
    try {
      const response = await fetch('/api/auth/salon/profile');
      const result = await response.json();
      
      if (result.success) {
        setSalonData(result.data);
      }
    } catch (error) {
      console.error('Error fetching salon data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!salonData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">No salon data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="font-headline text-3xl md:text-5xl text-white mb-4">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{salonData.name}</span>
              </h1>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {salonData.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {salonData.location}
                </p>
                <p className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  {salonData.salonType} Salon
                </p>
              </div>
            </div>
            
            {/* Salon Image */}
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[30px] md:rounded-[40px] overflow-hidden border-2 border-white/20">
                {salonData.salonImage ? (
                  <img 
                    src={salonData.salonImage} 
                    alt={salonData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Store className="h-16 w-16 text-purple-400" />
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl md:text-3xl text-white">My Services</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              {salonData.services?.map((service, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{service.name}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                      <p className="text-gray-500 text-xs">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-purple-400">₹{service.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </div>

          {/* Offers Section */}
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl md:text-3xl text-white">My Offers</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              {salonData.offers?.map((offer, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                      <p className="text-gray-400 text-sm">{offer.description}</p>
                      <p className="text-gray-500 text-xs">Valid until: {offer.validUntil}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {offer.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Total</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">156</h3>
            <p className="text-gray-300 font-medium">Total Bookings</p>
          </div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">This Month</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">42</h3>
            <p className="text-gray-300 font-medium">New Customers</p>
          </div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Revenue</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">₹45.2K</h3>
            <p className="text-gray-300 font-medium">Monthly Revenue</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
