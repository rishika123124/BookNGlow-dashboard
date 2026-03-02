'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Loader2, 
  ChevronRight,
  Sparkles,
  LogOut,
  CalendarCheck,
  ShoppingBag,
  Mail
} from 'lucide-react';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useDoc,
  useMemoFirebase,
  useAuth
} from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  // Fetch Firestore User Profile to get Name and Role
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  
  const { data: profile, isLoading: profileLoading } = useDoc(userProfileRef);

  // Fetch User's Bookings
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'bookings'),
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // Wait for Auth to resolve before making decisions
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-body selection:bg-purple-500/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16 relative">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-[#A78BFA]" />
                <h1 className="font-headline text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Welcome, {profile?.fullName || "Glow Member"}
                </h1>
              </div>
              <p className="text-white/40 text-lg">Manage your luxury experiences and profile.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="rounded-full border-white/10 text-white hover:bg-white/5 gap-2 h-12 px-6"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-12 items-start">
            
            {/* Left Column: Account Profile */}
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-md">
                {profileLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 text-[#A78BFA] animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                      <UserIcon className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline text-2xl">{profile?.fullName || "Glow Member"}</h3>
                      <div className="flex items-center justify-center gap-1.5 text-white/40 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[180px]">{user.email}</span>
                      </div>
                    </div>
                    <Badge className="bg-purple-600/20 text-[#A78BFA] border-purple-500/30 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                      {profile?.role || 'Customer'}
                    </Badge>
                  </div>
                )}
                
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Member Since</span>
                    <span className="font-bold">
                      {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'MMM yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-[2.5rem] p-8 text-center space-y-4">
                <ShoppingBag className="h-8 w-8 text-[#A78BFA] mx-auto" />
                <h4 className="font-headline text-xl">Ready for a Glow?</h4>
                <p className="text-white/60 text-sm">Explore Dehradun's finest selection of verified salons.</p>
                <Button asChild className="w-full rounded-full bg-[#A78BFA] hover:bg-[#9067f5] text-white border-none font-bold">
                  <Link href="/salons/male">Browse Salons</Link>
                </Button>
              </div>
            </div>

            {/* Right Column: My Bookings */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-6 w-6 text-[#A78BFA]" />
                <h2 className="font-headline text-3xl tracking-wide">Appointment History</h2>
              </div>

              {bookingsLoading ? (
                <div className="h-64 flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/10">
                  <Loader2 className="h-10 w-10 text-[#A78BFA] animate-spin" />
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="group bg-white/5 border border-white/10 hover:border-[#A78BFA]/30 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:bg-white/[0.07] shadow-xl"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="h-16 w-16 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center border border-[#A78BFA]/20 group-hover:scale-110 transition-transform">
                          <Sparkles className="h-8 w-8 text-[#A78BFA]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-headline text-2xl text-white">{booking.salonName}</h4>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/40 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#A78BFA]" />
                              {format(new Date(booking.date), 'EEEE, MMM do')}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-[#A78BFA]" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                          {booking.status}
                        </Badge>
                        <Button variant="ghost" className="h-12 w-12 rounded-full p-0 text-white/20 hover:text-[#A78BFA] hover:bg-[#A78BFA]/10 transition-colors">
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-6 backdrop-blur-md">
                  <div className="bg-white/5 p-6 rounded-full">
                    <Calendar className="h-12 w-12 text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline text-2xl text-white/80">No Bookings Yet</h3>
                    <p className="text-white/40 max-w-sm mx-auto">
                      Your grooming schedule is currently open. Secure your first luxury slot now and experience Dehradun's finest.
                    </p>
                  </div>
                  <Button asChild className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.05] transition-all px-8 h-14 font-headline text-lg border-none shadow-2xl shadow-purple-500/20">
                    <Link href="/salons/male">Book Your First Slot</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
