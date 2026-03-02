
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  Loader2, 
  ChevronRight,
  Sparkles,
  LogOut,
  CalendarCheck,
  ShoppingBag,
  Mail,
  ShieldCheck
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

  // Redirect if not logged in after auth state is determined
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Fetch Firestore User Profile for Name and Role
  // Dependency on user?.uid ensures we only query when the UID is stable
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: profile, isLoading: profileLoading } = useDoc(userProfileRef);

  // Fetch User's Bookings filtered by their customerId
  // Ensuring we wait for auth to be fully ready
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'bookings'),
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.uid]);

  const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
          <p className="font-headline text-white/40 text-lg">Reserving your seat...</p>
        </div>
      </div>
    );
  }

  // Final check before rendering main content to prevent flickering
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-body selection:bg-purple-500/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16 relative">
        {/* Background Atmospheric Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          {/* Account Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-[#A78BFA]" />
                <h1 className="font-headline text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {profile?.fullName ? `Welcome back, ${profile.fullName}` : "My Account"}
                </h1>
              </div>
              <p className="text-white/40 text-lg">Manage your elite grooming schedule and profile.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="rounded-full border-white/10 text-white hover:bg-white/5 gap-2 h-12 px-6 group"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-12 items-start">
            
            {/* Left Column: Member Card */}
            <div className="space-y-8 sticky top-32">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="h-24 w-24 text-[#A78BFA]" />
                </div>
                
                {profileLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 text-[#A78BFA] animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 transform group-hover:rotate-3 transition-transform">
                      <UserIcon className="h-14 w-14 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-headline text-3xl">{profile?.fullName || "Glow Member"}</h3>
                      <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                        <Mail className="h-4 w-4 text-[#A78BFA]" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                    </div>
                    <Badge className="bg-[#A78BFA]/20 text-[#A78BFA] border-[#A78BFA]/30 px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold">
                      {profile?.role === 'customer' ? 'Premium Member' : 'Salon Partner'}
                    </Badge>
                  </div>
                )}
                
                <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-bold uppercase tracking-wider text-[10px]">Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      Verified
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-bold uppercase tracking-wider text-[10px]">Joined</span>
                    <span className="font-bold">
                      {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'MMM yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-[2.5rem] p-8 text-center space-y-6">
                <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8 text-[#A78BFA]" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-headline text-2xl">Plan your next glow</h4>
                  <p className="text-white/40 text-sm leading-relaxed">Dehradun's finest stylists are just a click away.</p>
                </div>
                <Button asChild className="w-full rounded-full h-12 bg-[#A78BFA] hover:bg-[#9067f5] text-white border-none font-bold shadow-lg shadow-purple-500/20">
                  <Link href="/salons/male">Explore Salons</Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Appointment Feed */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-8 w-8 text-[#A78BFA]" />
                  <h2 className="font-headline text-3xl tracking-wide">My Bookings</h2>
                </div>
                {bookings && bookings.length > 0 && (
                  <span className="text-white/40 text-sm font-bold bg-white/5 px-4 py-1 rounded-full border border-white/10">
                    {bookings.length} Appointment{bookings.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {bookingsLoading ? (
                <div className="h-96 flex flex-col items-center justify-center bg-white/5 rounded-[3rem] border border-white/10 gap-4">
                  <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Synchronizing history...</p>
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="group bg-white/5 border border-white/10 hover:border-[#A78BFA]/40 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 hover:bg-white/[0.08] shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#A78BFA]/20 group-hover:bg-[#A78BFA] transition-colors" />
                      
                      <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="h-20 w-20 rounded-3xl bg-[#A78BFA]/10 flex items-center justify-center border border-[#A78BFA]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Sparkles className="h-10 w-10 text-[#A78BFA]" />
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-headline text-3xl text-white group-hover:text-[#A78BFA] transition-colors">{booking.salonName}</h4>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/60">
                            <span className="flex items-center gap-2 text-sm md:text-base font-bold">
                              <Calendar className="h-4 w-4 text-[#A78BFA]" />
                              {format(new Date(booking.date), 'EEEE, MMM do')}
                            </span>
                            <span className="flex items-center gap-2 text-sm md:text-base font-bold">
                              <Clock className="h-4 w-4 text-[#A78BFA]" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-4">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/5">
                          {booking.status}
                        </Badge>
                        <Button variant="ghost" className="hidden md:flex items-center gap-2 text-white/20 hover:text-white transition-all">
                          View Details <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-8 bg-white/5 border border-white/10 rounded-[4rem] text-center space-y-8 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="bg-white/5 p-8 rounded-full relative z-10">
                    <Calendar className="h-16 w-16 text-white/10" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <h3 className="font-headline text-4xl text-white/80 tracking-tight">Your grooming schedule is open.</h3>
                    <p className="text-white/40 max-w-sm mx-auto text-lg leading-relaxed">
                      Experience the finest luxury in the Doon Valley. Secure your first appointment at one of our verified elite salons.
                    </p>
                  </div>
                  <Button asChild className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.05] transition-all px-12 h-16 font-headline text-xl border-none shadow-2xl shadow-purple-500/40 relative z-10">
                    <Link href="/salons/male">Book Your First Glow</Link>
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
