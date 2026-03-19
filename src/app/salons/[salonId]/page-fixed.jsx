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

const SERVICES = [
  { id: '1', name: "Haircut & Styling", price: "₹499", time: "45 mins" },
  { id: '2', name: "Beard Trim", price: "₹299", time: "20 mins" },
  { id: '3', name: "Facial Glow", price: "₹699", time: "60 mins" },
];

const TIME_SLOTS = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

export default function SalonDetailPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (!selectedDate || !selectedSlot || selectedServices.length === 0) {
      alert('Please select date, time, and services');
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salonId,
          userId: user.id,
          services: selectedServices,
          date: selectedDate,
          time: selectedSlot,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert('Booking failed: ' + error.message);
    } finally {
      setIsBooking(false);
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
      
      <main className="relative z-10">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="m-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="container mx-auto px-4 py-8">
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

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Services</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {(salon.services || SERVICES).map((service, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        selectedServices.includes(service.id || service.name)
                          ? "border-accent bg-accent/10"
                          : "border-white/10 bg-slate-800/50 hover:border-white/20"
                      )}
                      onClick={() => {
                        const serviceId = service.id || service.name;
                        setSelectedServices(prev => 
                          prev.includes(serviceId) 
                            ? prev.filter(s => s !== serviceId)
                            : [...prev, serviceId]
                        );
                      }}
                    >
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-accent">{service.price}</span>
                        <span className="text-white/60 text-sm">{service.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

                {/* Time Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(time => (
                      <Button
                        key={time}
                        variant={selectedSlot === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(time)}
                        className={cn(
                          "text-xs",
                          selectedSlot === time 
                            ? "bg-accent hover:bg-accent/90" 
                            : "bg-slate-800 hover:bg-slate-700 border-white/10"
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  disabled={!selectedDate || !selectedSlot || selectedServices.length === 0 || isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Book Now
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
