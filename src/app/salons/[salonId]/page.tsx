'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Star, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Loader2, 
  Sparkles, 
  Scissors, 
  Award,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  CalendarDays,
  CheckCircle2,
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  useUser, 
  useFirestore, 
  useAuth,
  useCollection, 
  useDoc, 
  useMemoFirebase 
} from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { format, isBefore, startOfDay } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
  "07:00 PM", "08:00 PM"
];

const DEFAULT_SERVICES = [
  { id: 'haircut', name: "Executive Hair Design", price: 899, time: "45 mins" },
  { id: 'beard', name: "Luxury Beard Sculpting", price: 499, time: "30 mins" },
  { id: 'scalp', name: "Revitalizing Scalp Therapy", price: 699, time: "40 mins" },
  { id: 'facial', name: "Charcoal Detox Facial", price: 1299, time: "60 mins" },
  { id: 'color', name: "Global Hair Color", price: 1999, time: "90 mins" },
];

export default function SalonDetailPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);

  // Auto-login anonymously if guest
  useEffect(() => {
    if (!isUserLoading && !user) {
      signInAnonymously(auth).catch(err => console.error("Anonymous auth failed", err));
    }
  }, [user, isUserLoading, auth]);

  // Dynamic Open/Closed Status
  useEffect(() => {
    const checkStatus = () => {
      const hours = new Date().getHours();
      setIsOpenNow(hours >= 10 && hours < 21);
    };
    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Salon Data
  const salonRef = useMemoFirebase(() => doc(db, 'salons', salonId as string), [db, salonId]);
  const { data: salon, isLoading: salonLoading } = useDoc(salonRef);

  // Fetch Bookings for the selected date to find free slots
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !salonId || !selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return query(
      collection(db, 'bookings'),
      where('salonId', '==', salonId),
      where('date', '==', dateStr),
      where('status', 'in', ['pending', 'confirmed'])
    );
  }, [db, salonId, selectedDate]);

  const { data: existingBookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  const bookedSlots = useMemo(() => {
    return existingBookings?.map(b => b.time) || [];
  }, [existingBookings]);

  const services = DEFAULT_SERVICES; // In production, this would come from salon.services

  const totalAmount = useMemo(() => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedSlot || selectedServices.length === 0) {
      if (selectedServices.length === 0) toast({ title: "Select Service", description: "Please pick at least one service." });
      return;
    }

    setIsBooking(true);
    const selectedServiceNames = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.name);

    const bookingData = {
      customerId: user.uid,
      customerName: user.displayName || 'Glow Member',
      salonId: salonId as string,
      salonName: salon?.name || "The Lush Studio",
      salonOwnerId: salon?.ownerId || '',
      selectedServices: selectedServiceNames,
      totalAmount: totalAmount,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedSlot,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'bookings'), bookingData).catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'bookings',
          operation: 'create',
          requestResourceData: bookingData,
        }));
        throw e;
      });

      setIsSuccessOpen(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (salonLoading) {
    return (
      <div className="min-h-screen bg-[#D6C4BC] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#DB2777] animate-spin" />
      </div>
    );
  }

  const salonImage = PlaceHolderImages.find(img => img.id.includes(salonId as string))?.imageUrl || 
                     PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || 
                     "https://picsum.photos/seed/lush/1200/800";

  return (
    <div className="min-h-screen bg-[#D6C4BC] text-[#333333] selection:bg-[#BCA396]/30 font-sans relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#D6C4BC_0%,_#C7B1A6_100%)]" />
      </div>

      <div className="relative z-50 bg-slate-950/90 backdrop-blur-md">
        <Navbar />
      </div>

      <main className="relative z-10 pb-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-8 md:pt-12">
          <div className="relative h-[300px] md:h-[500px] w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl">
            <Image 
              src={salonImage} 
              alt={salon?.name || "The Lush Studio"} 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 md:left-12">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="text-white/80 hover:text-white mb-4 gap-2 p-0 h-auto bg-black/20 px-4 py-2 rounded-full backdrop-blur-md"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Info Header - Removed Book Appointment Button */}
        <div className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={cn(
                  "px-4 py-1.5 rounded-full text-white font-bold border-none text-[10px] tracking-widest",
                  isOpenNow ? "bg-emerald-500" : "bg-rose-500"
                )}>
                  {isOpenNow ? 'OPEN NOW' : 'CLOSED'}
                </Badge>
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-lg">{salon?.rating || "4.7"}</span>
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#333333] tracking-tight drop-shadow-sm">
                {salon?.name || "The Lush Studio"}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-[#333333]/70">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#E57373]" />
                  <span className="font-medium">{salon?.area || "Rajpur Road"}, Dehradun</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#E57373]" />
                  <span className="font-medium">10:00 AM - 09:00 PM</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
               <div className="flex items-center gap-4 text-sm font-bold text-[#333333]/60 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 text-emerald-700"><ShieldCheck className="h-4 w-4" /> Verified</div>
                  <div className="flex items-center gap-1.5 text-purple-700"><Award className="h-4 w-4" /> Premium</div>
               </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          
          {/* Left Side: Services */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl text-[#333333]">Signature Menu</h2>
              <Scissors className="h-6 w-6 text-[#E57373]" />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <div 
                    key={service.id} 
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "group p-6 rounded-[2rem] bg-white/20 backdrop-blur-lg border transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer",
                      isSelected ? "border-[#E57373] bg-white/40 shadow-lg" : "border-white/30 hover:border-[#E57373]/40"
                    )}
                  >
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "h-6 w-6 rounded-full border flex items-center justify-center transition-all",
                         isSelected ? "bg-[#E57373] border-[#E57373]" : "border-black/10"
                       )}>
                         {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-headline text-xl md:text-2xl text-[#333333]">
                            {service.name}
                          </h4>
                          <p className="text-[#333333]/50 text-sm font-medium tracking-wide">{service.time}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto justify-between">
                      <span className="font-bold text-xl md:text-2xl text-[#E57373]">₹{service.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Side: Booking Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[3rem] p-8 space-y-8 shadow-xl sticky top-32">
              
              {/* Date Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#333333]">
                  <CalendarIcon className="h-5 w-5 text-[#E57373]" />
                  <h3 className="font-headline text-xl tracking-wide">Choose Date</h3>
                </div>
                <div className="rounded-3xl border border-black/5 bg-white/20 p-4">
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
                  />
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#333333]">
                  <Clock className="h-5 w-5 text-[#E57373]" />
                  <h3 className="font-headline text-xl tracking-wide">Select Time</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "h-12 rounded-2xl text-xs font-bold transition-all border",
                          isBooked 
                            ? "bg-black/5 border-transparent text-black/20 cursor-not-allowed line-through" 
                            : isSelected
                            ? "bg-[#E57373] border-[#E57373] text-white shadow-lg scale-105"
                            : "bg-white/30 border-white/60 text-[#333333] hover:border-[#E57373]"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary & Final CTA */}
              <div className="pt-6 border-t border-black/5 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Total Estimate</p>
                    <p className="text-3xl font-bold text-[#E57373]">₹{totalAmount}</p>
                  </div>
                  {selectedServices.length > 0 && (
                    <Badge variant="outline" className="border-[#E57373] text-[#E57373]">
                      {selectedServices.length} Selected
                    </Badge>
                  )}
                </div>

                <Button 
                  disabled={!selectedSlot || selectedServices.length === 0 || isBooking}
                  onClick={handleBooking}
                  className="w-full h-16 rounded-full bg-[#E57373] hover:bg-[#D46262] text-white text-xl font-headline border-none shadow-xl shadow-[#E57373]/20"
                >
                  {isBooking ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <span className="flex items-center gap-3">
                      Secure Appointment
                      <Sparkles className="h-5 w-5" />
                    </span>
                  )}
                </Button>
                
                <p className="text-center text-[10px] text-black/30 italic">
                  Request will be sent to the salon for confirmation.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-[#FAF9F6] border-none text-[#333333] rounded-[3rem] p-12 text-center max-w-md">
          <DialogHeader className="space-y-6">
            <div className="mx-auto bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center animate-bounce shadow-inner">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="font-display text-4xl tracking-tight text-emerald-700">
                Request Sent!
              </DialogTitle>
              <DialogDescription className="text-black/60 text-lg">
                Your luxury session request is on its way to <span className="text-[#333333] font-bold">{salon?.name}</span>.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-4">
             <div className="bg-white/50 rounded-2xl p-4 text-sm font-medium text-emerald-800">
                Check your dashboard to track status.
             </div>
          </div>
          
          <DialogFooter className="mt-8">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full h-14 rounded-full bg-slate-950 text-white hover:bg-slate-900 font-headline text-lg border-none"
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
