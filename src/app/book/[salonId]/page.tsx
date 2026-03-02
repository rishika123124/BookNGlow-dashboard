'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  MapPin,
  Star
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { 
  useAuth, 
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

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
  "07:00 PM"
];

export default function BookingPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const db = useFirestore();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  // Fetch Salon Details
  const salonRef = useMemoFirebase(() => doc(db, 'salons', salonId as string), [db, salonId]);
  const { data: salon, isLoading: salonLoading } = useDoc(salonRef);

  // Fetch Bookings for the selected date and salon
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !salonId) return null;
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

  const handleBooking = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to book a luxury slot.",
      });
      router.push('/login');
      return;
    }

    setIsBooking(true);
    const bookingData = {
      customerId: user.uid,
      salonId: salonId as string,
      salonName: salon?.name || 'Velvet Grooming',
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

      toast({
        title: "Glow Confirmed! ✨",
        description: `Your appointment at ${salon?.name || 'Velvet Grooming'} is secured for ${format(selectedDate, 'MMM do')} at ${selectedSlot}.`,
      });
      
      setIsConfirmOpen(false);
      // Redirect to a hypothetical dashboard or home
      router.push('/');
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

  if (salonLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-body selection:bg-purple-500/30">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
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
                <h1 className="font-headline text-4xl md:text-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
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
            <div className="hidden md:block">
               <Sparkles className="h-12 w-12 text-purple-500/30 animate-pulse" />
            </div>
          </div>

          {/* Date Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-purple-400" />
              <h2 className="font-headline text-2xl tracking-wide">Select a Date</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {dates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  className={`flex-shrink-0 w-24 h-28 rounded-3xl border flex flex-col items-center justify-center transition-all duration-300 ${
                    isSameDay(selectedDate, date)
                      ? "bg-purple-600 border-purple-500 shadow-xl shadow-purple-500/30 scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isSameDay(selectedDate, date) ? "text-white/70" : "text-white/40"}`}>
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-2xl font-bold mt-1">
                    {format(date, 'd')}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${isSameDay(selectedDate, date) ? "text-white/70" : "text-white/40"}`}>
                    {format(date, 'MMM')}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Time Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-purple-400" />
              <h2 className="font-headline text-2xl tracking-wide">Available Slots</h2>
            </div>
            
            {bookingsLoading ? (
              <div className="h-40 flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/10">
                <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`relative h-16 rounded-2xl border font-bold transition-all duration-300 ${
                        isBooked
                          ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/20 text-white"
                          : "bg-transparent border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500"
                      }`}
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
          </section>

          {/* Final Action */}
          <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-6">
            <p className="text-white/40 text-sm italic">
              Experience the gold standard of grooming in Dehradun.
            </p>
            <Button 
              disabled={!selectedSlot}
              onClick={() => setIsConfirmOpen(true)}
              className="w-full md:w-80 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all text-xl font-headline shadow-2xl shadow-purple-500/30 border-none group"
            >
              Secure My Slot
              <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-8 md:p-10">
          <DialogHeader className="space-y-4">
            <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="h-8 w-8 text-purple-400" />
            </div>
            <DialogTitle className="font-headline text-3xl text-center tracking-wide">Confirm Your Glow</DialogTitle>
            <DialogDescription className="text-white/60 text-center text-lg">
              You're booking a luxury session at <span className="text-purple-400 font-bold">{salon?.name || "Velvet Grooming"}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white/5 rounded-3xl p-6 space-y-4 border border-white/10 my-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 uppercase tracking-widest font-bold">Selected Date</span>
              <span className="font-bold">{format(selectedDate, 'EEEE, MMMM do')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 uppercase tracking-widest font-bold">Appointment Time</span>
              <span className="font-bold">{selectedSlot}</span>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 uppercase tracking-widest font-bold">Location</span>
              <span className="font-bold">{salon?.area || "Rajpur Road"}</span>
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

      <Footer />
    </div>
  );
}
