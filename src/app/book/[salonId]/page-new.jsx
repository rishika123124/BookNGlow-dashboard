'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Clock, 
  ChevronLeft, 
  Loader2,
  Sparkles,
  MapPin,
  Phone,
  CalendarDays,
  Scissors,
  CheckCircle2,
  Users,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function BookingPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);

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

    if (!selectedDate || !selectedService || !selectedTime) {
      alert('Please select date, service, and time');
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
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
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
    } finally {
      setIsBooking(false);
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

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
          className="m-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Salon Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${salon.images?.[0]?.path || PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl})`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-accent px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-medium">Premium</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white ml-1">{salon.rating || '4.8'}</span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {salon.salonName}
                  </h1>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{salon.location}</span>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="p-6 rounded-2xl border border-white/10 bg-slate-800/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-accent" />
                  About {salon.salonName}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Experience luxury and excellence at {salon.salonName}, your premier destination 
                  for beauty and grooming in {salon.location}. Our expert stylists are dedicated 
                  to providing exceptional service and creating your perfect look.
                </p>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Scissors className="h-5 w-5 mr-2 text-accent" />
                  Our Services
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {(salon.services || [
                    { name: "Haircut & Styling", price: "₹499", duration: "45 mins" },
                    { name: "Beard Grooming", price: "₹299", duration: "20 mins" },
                    { name: "Facial Treatment", price: "₹699", duration: "60 mins" },
                    { name: "Head Massage", price: "₹199", duration: "15 mins" }
                  ]).map((service, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-5 rounded-xl border cursor-pointer transition-all duration-200",
                        selectedService?.name === service.name
                          ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                          : "border-white/10 bg-slate-800/50 hover:border-white/20 hover:bg-slate-800/70"
                      )}
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <Badge className="bg-accent text-white">
                          ₹{service.price}
                        </Badge>
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 sticky top-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-accent" />
                  Book Appointment
                </h3>
                
                {/* Calendar */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    className="bg-slate-800 border-white/10 rounded-lg"
                  />
                </div>

                {/* Service Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Selected Service</label>
                  <div className="p-4 rounded-lg border border-white/10 bg-slate-800">
                    {selectedService ? (
                      <div>
                        <p className="font-medium text-lg mb-2">{selectedService.name}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-accent font-bold text-xl">₹{selectedService.price}</span>
                          <span className="text-white/60 text-sm">{selectedService.duration}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/60">Select a service from the list</p>
                    )}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Preferred Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "text-xs",
                          selectedTime === time 
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
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                  disabled={!selectedService || !selectedTime || isBooking}
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
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-accent" />
                  Contact Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-accent" />
                    <span>{salon.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-accent" />
                    <span>{salon.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-accent" />
                    <span>Open: 9:00 AM - 8:00 PM</span>
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
