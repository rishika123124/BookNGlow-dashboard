'use client';

import React, { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useDoc, 
  useMemoFirebase 
} from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  doc 
} from 'firebase/firestore';
import { 
  Loader2, 
  Calendar, 
  Clock, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // 1. Fetch User Profile to get Role
  const userProfileRef = useMemoFirebase(() => 
    user ? doc(db, 'users', user.uid) : null
  , [db, user]);
  const { data: profile, isLoading: profileLoading } = useDoc(userProfileRef);

  // 2. Fetch Salon if user is a Salon Owner
  const salonsQuery = useMemoFirebase(() => {
    if (!db || !user || profile?.role !== 'salon') return null;
    return query(collection(db, 'salons'), where('ownerId', '==', user.uid));
  }, [db, user, profile]);
  const { data: salons, isLoading: salonsLoading } = useCollection(salonsQuery);
  const mySalon = salons?.[0];

  // 3. Fetch Bookings based on Role
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    const bookingsRef = collection(db, 'bookings');
    
    // Salon Owners see their salon's bookings
    if (profile?.role === 'salon' && mySalon) {
      return query(
        bookingsRef, 
        where('salonId', '==', mySalon.id),
        orderBy('createdAt', 'desc')
      );
    } 
    
    // Customers (or users without a full salon profile yet) see their own bookings
    // This query is optimized to match standard security rules
    return query(
      bookingsRef, 
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user, profile, mySalon]);

  const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  const handleConfirmBooking = (bookingId: string) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    updateDocumentNonBlocking(bookingRef, { status: 'confirmed' });
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    updateDocumentNonBlocking(bookingRef, { status: 'cancelled' });
  };

  // Improved loading state handling
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
          <p className="text-white/40 text-sm animate-pulse">Syncing with Elite Network...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handle case where profile might be missing
  if (!profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center space-y-6">
          <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-headline">Profile Setup Required</h1>
          <p className="text-white/40 max-w-md mx-auto">We couldn't find your profile details. Please ensure you've completed your registration.</p>
          <Button onClick={() => router.push('/login')} className="bg-purple-600 rounded-full px-8">Complete Registration</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isSalon = profile?.role === 'salon';

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                {isSalon ? 'Salon Management' : 'Member Dashboard'}
              </div>
              <h1 className="font-headline text-4xl md:text-6xl tracking-tight text-white">
                {isSalon ? (mySalon?.name || 'My Salon') : `Welcome, ${profile?.fullName || 'Glow Member'}`}
              </h1>
              <p className="text-white/40 text-lg md:text-xl">
                {isSalon 
                  ? 'Confirm appointments and manage client flow.' 
                  : 'Track your upcoming luxury grooming sessions.'}
              </p>
            </div>
            {isSalon && (
              <Button variant="outline" className="border-white/10 rounded-full h-12 px-6" onClick={() => router.push('/')}>
                View Public Profile <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Bookings Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-[#A78BFA]" />
              <h2 className="font-headline text-2xl tracking-wide">
                {isSalon ? 'Appointment Requests' : 'My Bookings'}
              </h2>
            </div>

            {bookingsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 text-[#A78BFA] animate-spin" />
                <p className="text-white/20 text-xs">Fetching your history...</p>
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 transition-all hover:bg-white/10 hover:border-purple-500/40 shadow-xl overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">
                          {isSalon ? 'Customer' : 'Salon'}
                        </p>
                        <h3 className="font-headline text-xl text-white">
                          {isSalon ? (booking.customerName || 'Glow Member') : booking.salonName}
                        </h3>
                      </div>
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold border-none",
                        booking.status === 'confirmed' ? "bg-emerald-500/20 text-emerald-400" :
                        booking.status === 'cancelled' ? "bg-rose-500/20 text-rose-400" :
                        "bg-amber-500/20 text-amber-400"
                      )}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Services */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Scissors className="h-3 w-3" />
                        <span className="uppercase tracking-widest font-bold">Services</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.selectedServices?.map((s: string) => (
                          <span key={s} className="bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full text-[10px] font-medium border border-purple-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-tighter">
                          <Calendar className="h-3 w-3" /> Date
                        </div>
                        <p className="text-sm font-medium">{booking.date}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-tighter">
                          <Clock className="h-3 w-3" /> Time
                        </div>
                        <p className="text-sm font-medium">{booking.time}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                       <div className="space-y-0.5">
                         <p className="text-[10px] text-white/30 font-bold uppercase">Total</p>
                         <p className="text-lg font-bold text-[#A78BFA]">₹{booking.totalAmount}</p>
                       </div>
                       
                       {/* Salon Actions */}
                       {isSalon && booking.status === 'pending' && (
                         <div className="flex gap-2">
                           <Button 
                             size="sm" 
                             onClick={() => handleCancelBooking(booking.id)}
                             variant="ghost" 
                             className="h-10 w-10 rounded-full p-0 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
                           >
                             <XCircle className="h-5 w-5" />
                           </Button>
                           <Button 
                             size="sm" 
                             onClick={() => handleConfirmBooking(booking.id)}
                             className="h-10 px-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                           >
                             <CheckCircle2 className="h-4 w-4 mr-2" />
                             Confirm
                           </Button>
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-20 text-center space-y-6">
                <div className="bg-purple-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="h-10 w-10 text-[#A78BFA]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline text-3xl">No Bookings Yet</h3>
                  <p className="text-white/40 max-w-sm mx-auto">
                    {isSalon 
                      ? "You don't have any appointment requests yet." 
                      : "You haven't booked any services yet. Start your luxury journey today."}
                  </p>
                </div>
                {!isSalon && (
                  <Button onClick={() => router.push('/')} className="bg-purple-600 hover:bg-purple-700 rounded-full h-12 px-8">
                    Explore Salons
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
