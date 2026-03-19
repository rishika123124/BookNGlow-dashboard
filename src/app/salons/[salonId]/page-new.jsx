'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; 
import { MapPin, ChevronLeft, Loader2, CalendarDays, Scissors, Clock, Phone, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, isBefore, startOfDay } from 'date-fns';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function SalonDetailPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(null);
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const response = await fetch(`/api/salons/${salonId}`);
        const result = await response.json();
        
        if (result.success) {
          setSalon(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error fetching salon:', error);
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchSalon();
    }
  }, [salonId]);

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedDate || !selectedService || !bookingTime) {
      alert('Please select date, service, and time');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salonId,
          userId: user.id,
          service: selectedService,
          date: selectedDate,
          time: bookingTime,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Booking successful!');
        router.push('/dashboard');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert('Booking failed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salon Not Found</h1>
          <Button onClick={() => router.push('/salons')}>
            Back to Salons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Salon Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src={salon.images?.[0]?.path || PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl}
                alt={salon.salonName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {salon.salonName}
                </h1>
                <div className="flex items-center text-white/80">
                  <MapPin className="h-4 w-4 mr-1" />
                  {salon.location}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {salon.images && salon.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {salon.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image.path}
                      alt={`${salon.salonName} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Services</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {salon.services?.map((service, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      selectedService?.name === service.name
                        ? "border-accent bg-accent/10"
                        : "border-white/10 bg-slate-800/50 hover:border-white/20"
                    )}
                    onClick={() => setSelectedService(service)}
                  >
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-white/60 text-sm mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-accent">₹{service.price}</span>
                      <span className="text-white/60 text-sm">{service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offers */}
            {salon.offers && salon.offers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Special Offers</h2>
                <div className="space-y-3">
                  {salon.offers.map((offer, index) => (
                    <div key={index} className="p-4 rounded-lg border border-white/10 bg-slate-800/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                        <span className="bg-accent text-white px-2 py-1 rounded text-sm">
                          {offer.discount}% OFF
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{offer.description}</p>
                      {offer.validUntil && (
                        <p className="text-white/40 text-xs mt-2">
                          Valid until: {format(new Date(offer.validUntil), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50">
              <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
              
              {/* Calendar */}
              <div className="mb-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  className="bg-slate-800 border-white/10"
                />
              </div>

              {/* Service Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Selected Service</label>
                <div className="p-3 rounded-lg border border-white/10 bg-slate-800">
                  {selectedService ? (
                    <div>
                      <p className="font-medium">{selectedService.name}</p>
                      <p className="text-accent font-bold">₹{selectedService.price}</p>
                    </div>
                  ) : (
                    <p className="text-white/60">Select a service</p>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-3 rounded-lg border border-white/10 bg-slate-800 text-white"
                >
                  <option value="">Select time</option>
                  {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <Button 
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={!selectedService || !bookingTime}
              >
                Book Now
              </Button>
            </div>

            {/* Contact Info */}
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-accent" />
                  <span>{salon.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  <span>{salon.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
