'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapPin, ChevronLeft, Loader2, CalendarDays, Scissors, Clock, Phone, CheckCircle2, Star, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, isBefore, startOfDay, addDays } from 'date-fns';
import { api } from '@/lib/api';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const SERVICES = [
  { id: '1', name: "Haircut & Styling", price: "₹499", time: "45 mins" },
  { id: '2', name: "Beard Trim", price: "₹299", time: "20 mins" },
  { id: '3', name: "Facial Glow", price: "₹699", time: "60 mins" },
];

// Generate time slots based on salon opening and closing times
const generateTimeSlots = (openingTime, closingTime) => {
  const slots = [];
  
  if (!openingTime || !closingTime) {
    return [];
  }
  
  try {
    // Parse opening time - handle various formats
    let openHour = 10, openPeriod = 'AM'; // Default to 10 AM
    let closeHour = 9, closePeriod = 'PM'; // Default to 9 PM
    
    // Extract hour and period from opening time
    const openMatch = openingTime.match(/(\d{1,2})\s*(?::\d{2})?\s*(AM|PM)?/i);
    if (openMatch) {
      openHour = parseInt(openMatch[1]);
      openPeriod = openMatch[3] ? openMatch[3].toUpperCase() : 'AM'; // Default to AM if not specified
    }
    
    // Extract hour and period from closing time
    const closeMatch = closingTime.match(/(\d{1,2})\s*(?::\d{2})?\s*(AM|PM)?/i);
    if (closeMatch) {
      closeHour = parseInt(closeMatch[1]);
      closePeriod = closeMatch[3] ? closeMatch[3].toUpperCase() : 'PM'; // Default to PM if not specified
    }
    
    // Convert to 24-hour format for calculation
    const open24 = openHour + (openPeriod === 'PM' && openHour !== 12 ? 12 : 0);
    const close24 = closeHour + (closePeriod === 'PM' && closeHour !== 12 ? 12 : 0);
    
    // Generate hourly slots in 1-hour increments
    for (let hour = open24; hour < close24; hour++) {
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const period = hour >= 12 ? 'PM' : 'AM';
      const timeString = `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
      slots.push(timeString);
    }
    
    console.log('Time slots generated:', { openingTime, closingTime, openHour, openPeriod, closeHour, closePeriod, open24, close24, slots });
    
    // Return generated slots or empty array if no slots generated
    return slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    return []; // Return empty array on error
  }
};

export default function SalonDetailPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [occupiedTimeSlots, setOccupiedTimeSlots] = useState([]);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const result = await api.getSalonById(salonId);
        
        if (result.success) {
          setSalon(result.data);
          setError(null);
        } else {
          setError(result.message || 'Failed to fetch salon data');
        }
      } catch (error) {
        console.error('Error fetching salon:', error);
        setError('Failed to fetch salon data');
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchSalon();
    }
  }, [salonId]);

  useEffect(() => {
    if (salon?.openingTime && salon?.closingTime) {
      const slots = generateTimeSlots(salon.openingTime, salon.closingTime);
      setAvailableSlots(slots);
      console.log('Generated slots for date:', selectedDate, 'Slots:', slots);
    }
  }, [selectedDate, salon?.openingTime, salon?.closingTime]);

  useEffect(() => {
    const fetchExistingBookings = async () => {
      if (!selectedDate || !salonId) return;
      
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        const response = await fetch(`/api/bookings?salonId=${salonId}&date=${formattedDate}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const existingBookings = data.data || [];
            const occupiedTimeSlots = existingBookings
              .filter(booking => booking.status !== 'cancelled')
              .map(booking => booking.time);
            
            setOccupiedTimeSlots(occupiedTimeSlots);
            console.log('Occupied time slots for date:', formattedDate, occupiedTimeSlots);
          }
        }
      } catch (error) {
        console.error('Error fetching existing bookings:', error);
      }
    };

    fetchExistingBookings();
  }, [selectedDate, salonId]);

  const handleCancel = () => {
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setSelectedService(null);
  };

  const handleServiceBooking = async (service) => {
    if (!user) {
      toast.error('Please login to book an appointment');
      router.push('/login');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toast.error('Please select Date and Time first!');
      return;
    }

    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      // Show immediate feedback that request is being sent
      toast.loading('Submitting booking request...');

      const result = await api.createBooking({
        salonId,
        userId: user.id,
        service: service,
        date: selectedDate,
        time: selectedSlot,
      });

      // Clear loading toast
      toast.dismiss();

      if (result.success) {
        // Show success message immediately
        toast.success('Booking request sent! Awaiting salon approval.');
        setBookingSuccess(true);
        setBookingError(null);
        
        // Redirect to dashboard after successful booking
        setTimeout(() => {
          router.push('/dashboard/customer');
        }, 2000); // Wait 2 seconds before redirect
      } else {
        // Show specific error from backend
        const errorMessage = result.message || 'Failed to submit booking request';
        setBookingError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      
      // Clear loading toast
      toast.dismiss();
      
      // Handle different error types gracefully
      let errorMessage = 'Booking failed. Please try again.';
      
      if (error.response) {
        // HTTP error response
        if (error.response.status === 500) {
          errorMessage = 'Server error, please try again later';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid booking data';
        } else if (error.response.status === 404) {
          errorMessage = 'Service temporarily unavailable';
        } else {
          errorMessage = `Error: ${error.response.status} - Please try again`;
        }
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message.includes('fetch') ? 
          'Network error. Please check your connection' : 
          error.message;
      }
      
      setBookingError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-pink-600" />
        <p className="mt-4 text-slate-600">Loading salon details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Failed to fetch salon data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Salon not found</p>
          <Button onClick={() => router.push('/salons')} className="mt-4">
            Back to Salons
          </Button>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[#D6C4BC] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] text-center shadow-2xl max-w-sm border-4 border-white">
          <CheckCircle2 className="w-20 h-20 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-slate-900">Request Submitted!</h2>
          <p className="my-4 text-slate-600 font-medium">Your booking request has been submitted and is awaiting salon approval.</p>
          <p className="text-sm text-slate-500 mb-6">You will receive an email once the salon confirms your appointment.</p>
          <Button onClick={() => router.push('/dashboard')} className="w-full bg-slate-950 rounded-2xl h-14 text-lg font-bold">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C9A9A6]">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 font-bold text-slate-800 hover:text-pink-700 transition-colors">
          <ChevronLeft size={20} /> Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          <div className="space-y-8">
            <div className="space-y-8">
              <div className="relative h-[380px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50">
                <Image 
                  src={salon?.serviceImages?.[0] || salon?.images?.[0] || salon?.image || salon?.salonImage || PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl} 
                  alt={`${salon?.salonName || 'Salon'} - Beauty salon in Dehradun`} 
                  fill 
                  priority 
                  sizes="(max-width) 100vw, 50vw" 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h1 className="text-5xl font-black mb-2">{salon?.name || salon?.salonName || "Salon Name"}</h1>
                  <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90">
                    <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                      <Clock size={14} /> {salon?.openingTime || "10:00"} AM - {salon?.closingTime || "09:00"} PM
                    </span>
                    <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                      <Phone size={14} /> {salon?.contactInfo || salon?.phone || "+91 98765 43210"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salon Information */}
            <div className="bg-white/30 p-6 rounded-[2rem] space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Salon Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="text-pink-600" size={16} />
                  <span className="text-slate-700">{salon?.location || salon?.area || "Dehradun"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-pink-600" size={16} />
                  <span className="text-slate-700">{salon?.openingTime || "10:00"} AM - {salon?.closingTime || "09:00"} PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-pink-600" size={16} />
                  <span className="text-slate-700">{salon?.contactInfo || salon?.phone || "Contact info not available"}</span>
                </div>
              </div>
            </div>

            {/* Offers */}
            {salon?.offers && salon.offers.length > 0 && (
              <div className="bg-white/30 p-6 rounded-[2rem] space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Special Offers</h3>
                <div className="space-y-2">
                  {salon.offers.map((offer, index) => (
                    <div key={index} className="bg-pink-100 p-4 rounded-xl">
                      <p className="font-bold text-pink-800">{offer.title}</p>
                      <p className="text-sm text-pink-600">{offer.description}</p>
                      <p className="text-lg font-black text-pink-900">{offer.discount}% OFF</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                <Scissors className="text-pink-600" /> Services
              </h3>
              <div className="space-y-4">
                {(salon?.services || []).map((service, index) => (
                  <div 
                    key={service.id || service._id || `service-${index}`} 
                    className="bg-white/30 p-6 rounded-[2rem] border-2 border-transparent hover:border-pink-200 transition-all" 
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{service.name}</p>
                        <p className="text-sm text-slate-600">{service.duration || service.time || "Duration not specified"}</p>
                        <p className="text-2xl font-black text-pink-600">{service.price}</p>
                      </div>
                      <Button 
                        onClick={() => handleServiceBooking(service)}
                        disabled={isBooking || !selectedDate || !selectedSlot}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-3 font-bold"
                      >
                        {isBooking && (selectedService?.id || selectedService?._id) === (service.id || service._id) ? <Loader2 className="animate-spin w-4 h-4" /> : "Book Now"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[3rem] shadow-2xl space-y-6 sticky top-24 border border-white">
            {/* Date Selection */}
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Date</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null); // Reset slot when date changes
                }}
                minDate={new Date()}
                dateFormat="PPP"
                placeholderText="Select Appointment Date"
                className="w-full h-14 border-2 border-slate-100 rounded-2xl px-4 flex items-center font-bold text-slate-700 bg-slate-50 hover:border-pink-200 transition-all text-center"
                calendarClassName="bg-white rounded-2xl shadow-2xl border-2 border-pink-200"
                dayClassName={(date) => 
                  cn(
                    "hover:bg-pink-100 rounded-lg transition-colors",
                    selectedDate && date.toDateString() === selectedDate.toDateString() 
                      ? "bg-pink-600 text-white hover:bg-pink-700" 
                      : ""
                  )
                }
              />
            </div>

            {/* Time Selection */}
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Available Slots</p>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => {
                    // Remove occupied check - allow multiple bookings for same slot
                    return (
                      <button 
                        key={slot} 
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                          selectedSlot === slot 
                            ? "bg-pink-600 border-pink-600 text-white shadow-lg" 
                            : "bg-slate-50 border-transparent text-slate-600 hover:border-pink-200"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">
                    {salon?.openingTime && salon?.closingTime 
                      ? "No time slots available for the selected date" 
                      : "Select a date to see available time slots"
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Booking Error Display */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-600 mt-0.5">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-red-800 font-medium text-sm">Booking Error</p>
                    <p className="text-red-600 text-sm mt-1">{bookingError}</p>
                  </div>
                  <button
                    onClick={() => setBookingError(null)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Booking Instructions</p>
              <p className="text-sm text-slate-600">1. Select a date from the calendar</p>
              <p className="text-sm text-slate-600">2. Choose an available time slot</p>
              <p className="text-sm text-slate-600">3. Click "Book Now" next to any service</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}