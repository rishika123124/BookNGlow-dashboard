'use client';

import React, { useState, useMemo } from 'react';
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
  Star,
  CheckCircle,
  CalendarCheck,
  Calendar as CalendarIcon,
  CheckCircle2,
  Scissors
} from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useDoc, 
  useMemoFirebase 
} from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
  "07:00 PM", "08:00 PM"
];

const SALON_SERVICES = [
  { id: 'haircut', name: 'Haircut', price: 499 },
  { id: 'beard', name: 'Beard Trim', price: 299 },
  { id: 'facial', name: 'Luxury Facial', price: 799 },
  { id: 'spa', name: 'Head Massage', price: 399 },
  { id: 'color', name: 'Hair Color', price: 999 },
];

export default function BookingPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Fetch Salon Details
  const salonRef = useMemoFirebase(() => doc(db, 'salons', salonId as string), [db, salonId]);
  const { data: salon, isLoading: salonLoading } = useDoc(salonRef);

  // Fetch Bookings for the selected date and salon
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !salonId || !selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return query(
      collection(db, 'bookings'),
      where('salonId', '==', salonId),
      where('date', '==', dateStr),
      where('status', '==', 'confirmed')
    );
  }, [db, salonId, selectedDate]);

  const { data: existingBookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  const bookedSlots = useMemo(() => {
    return existingBookings?.map(b => b.time) || [];
  }, [existingBookings]);

  const totalAmount = useMemo(() => {
    return SALON_SERVICES
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const handleBooking = async () => {
    if (isUserLoading) return;

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to secure your luxury grooming slot.",
      });
      router.push('/login');
      return;
    }

    if (!selectedDate || !selectedSlot || selectedServices.length === 0) return;

    setIsBooking(true);
    const selectedServiceNames = SALON_SERVICES
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.name);

    const bookingData = {
      customerId: user.uid,
      salonId: salonId as string,
      salonName: salon?.name || 'Velvet Grooming',
      selectedServices: selectedServiceNames,
      totalAmount: totalAmount,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedSlot,
      status: 'confirmed',
      createdAt: serverTimestamp(),
    };

    try {
      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, bookingData).catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'bookings',
          operation: 'create',
          requestResourceData: bookingData,
        }));
        throw e;
      });

      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (salonLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-body selection:bg-purple-500/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16 relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-0 h-auto text-white/40 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Discovery
              </Button>
              <div className="space-y-2">
                <Badge className="bg-purple-600 text-white border-none px-3 py-1">PREMIUM EXPERIENCE</Badge>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {salon?.name || "Velvet Grooming"}
                </h1>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span>{salon?.area || "Rajpur Road"}, Dehradun</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span>{salon?.rating || "5.0"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-start">
            
            {/* Left Column: Services & Calendar */}
            <div className="space-y-10">
              {/* Service Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Scissors className="h-5 w-5 text-[#A78BFA]" />
                  <h2 className="font-headline text-2xl tracking-wide">Select Services</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {SALON_SERVICES.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                          isSelected 
                            ? "bg-[#A78BFA]/10 border-[#A78BFA] shadow-[0_0_15px_rgba(167,139,250,0.1)]" 
                            : "bg-white/5 border-white/10 hover:border-[#A78BFA]/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                            isSelected ? "bg-[#A78BFA] border-[#A78BFA]" : "border-white/20"
                          )}>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </div>
                          <span className={cn("font-medium", isSelected ? "text-white" : "text-white/60")}>
                            {service.name}
                          </span>
                        </div>
                        <span className="font-bold text-[#A78BFA]">₹{service.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calendar */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-[#A78BFA]" />
                  <h2 className="font-headline text-2xl tracking-wide">Choose Date</h2>
                </div>
                <div className="bg-[#1E1E1E] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }
                    }}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    className="w-full"
                    classNames={{
                      day_selected: "bg-[#A78BFA] text-white hover:bg-[#A78BFA] hover:text-white focus:bg-[#A78BFA] focus:text-white shadow-[0_0_15px_rgba(167,139,250,0.5)]",
                      day_today: "bg-white/5 text-[#A78BFA] font-bold border border-[#A78BFA]/20",
                      day: cn("h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-xl transition-all"),
                      head_cell: "text-white/40 font-bold uppercase text-[10px] tracking-widest pb-4",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Time Slots & Summary */}
            <div className="space-y-6 lg:min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#A78BFA]" />
                  <h2 className="font-headline text-2xl tracking-wide">
                    Available Slots
                    {selectedDate && (
                      <span className="text-sm font-body text-white/40 ml-3 lowercase">
                        for {format(selectedDate, 'MMM do')}
                      </span>
                    )}
                  </h2>
                </div>
              </div>
              
              <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-8 flex flex-col">
                {bookingsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-[#A78BFA] animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "relative h-14 md:h-16 rounded-2xl border font-bold transition-all duration-300 transform",
                            isBooked
                              ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-[#A78BFA] border-[#A78BFA] shadow-[0_0_20px_rgba(167,139,250,0.3)] text-white scale-105 z-10"
                              : "bg-transparent border-[#A78BFA]/30 text-[#A78BFA] hover:bg-[#A78BFA]/10 hover:border-[#A78BFA] hover:scale-[1.02]"
                          )}
                        >
                          {slot}
                          {isBooked && (
                            <span className="absolute -top-2 -right-2 bg-slate-800 text-[8px] px-2 py-0.5 rounded-full text-white/40 uppercase tracking-tighter">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Summary Section */}
                {selectedServices.length > 0 && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-headline text-xl text-white/80">Booking Summary</h3>
                    <div className="space-y-2">
                      {SALON_SERVICES.filter(s => selectedServices.includes(s.id)).map(s => (
                        <div key={s.id} className="flex justify-between text-sm text-white/60">
                          <span>{s.name}</span>
                          <span>₹{s.price}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-lg text-[#A78BFA]">
                        <span>Total</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Slot Button */}
                <div className="sticky bottom-0 pt-8 border-t border-white/10 bg-gradient-to-t from-[#020617]/80 via-[#020617]/50 to-transparent flex flex-col items-center gap-6 mt-auto pb-4 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-white/40 text-sm italic">
                      Experience the gold standard of grooming.
                    </p>
                    {selectedSlot && selectedDate && (
                      <p className="text-[#A78BFA] font-bold text-sm mt-1 animate-in fade-in slide-in-from-bottom-1">
                        Selected: {format(selectedDate, 'EEE, MMM do')} @ {selectedSlot}
                      </p>
                    )}
                  </div>
                  <Button 
                    disabled={!selectedSlot || selectedServices.length === 0}
                    onClick={() => setIsConfirmOpen(true)}
                    className="w-full md:w-80 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all text-lg font-headline shadow-2xl shadow-purple-500/30 border-none group"
                  >
                    Confirm Appointment
                    <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                  {!selectedSlot && selectedServices.length > 0 && (
                    <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Please select a time slot</p>
                  )}
                  {selectedServices.length === 0 && (
                    <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Please select at least one service</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-8 md:p-10">
          <DialogHeader className="space-y-4">
            <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Clock className="h-8 w-8 text-[#A78BFA]" />
            </div>
            <DialogTitle className="font-headline text-3xl text-center tracking-wide">Confirm Your Glow</DialogTitle>
            <DialogDescription className="text-white/60 text-center text-lg">
              You're booking a luxury session at <span className="text-[#A78BFA] font-bold">{salon?.name || "Velvet Grooming"}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white/5 rounded-3xl p-6 space-y-4 border border-white/10 my-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 uppercase tracking-widest font-bold">Selected Date</span>
              <span className="font-bold">{selectedDate ? format(selectedDate, 'EEEE, MMMM do') : ''}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 uppercase tracking-widest font-bold">Appointment Time</span>
              <span className="font-bold">{selectedSlot}</span>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="space-y-2">
              <span className="text-white/40 uppercase tracking-widest font-bold text-[10px]">Services</span>
              <div className="space-y-1">
                {SALON_SERVICES.filter(s => selectedServices.includes(s.id)).map(s => (
                  <div key={s.id} className="flex justify-between text-xs">
                    <span>{s.name}</span>
                    <span className="text-white/60">₹{s.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex justify-between items-center">
              <span className="text-white/40 uppercase tracking-widest font-bold">Total Amount</span>
              <span className="text-xl font-bold text-[#A78BFA]">₹{totalAmount}</span>
            </div>
          </div>

          <DialogFooter className="flex-col md:flex-row gap-4 sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmOpen(false)}
              className="rounded-full h-12 border-white/10 text-white hover:bg-white/5 px-8"
            >
              Go Back
            </Button>
            <Button 
              disabled={isBooking}
              onClick={handleBooking}
              className="rounded-full h-12 bg-purple-600 hover:bg-purple-700 text-white px-8 font-bold border-none"
            >
              {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-[#020617] border-purple-500/20 text-white rounded-[2.5rem] p-8 md:p-12 text-center max-w-md">
          <DialogHeader className="space-y-6">
            <div className="mx-auto bg-emerald-500/20 w-24 h-24 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="font-headline text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                Glow Confirmed!
              </DialogTitle>
              <DialogDescription className="text-white/60 text-lg">
                Your appointment at <span className="text-white font-bold">{salon?.name}</span> is secured.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <CalendarCheck className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Appointment</p>
                <p className="font-bold text-sm md:text-base">
                  {selectedDate ? format(selectedDate, 'MMM do') : ''} • {selectedSlot}
                </p>
              </div>
            </div>
            <p className="text-white/30 text-xs italic">
              A confirmation has been sent to your email.
            </p>
          </div>
          
          <DialogFooter className="mt-8">
            <Button 
              onClick={() => router.push('/')}
              className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all font-headline text-lg border-none"
            >
              Return Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
