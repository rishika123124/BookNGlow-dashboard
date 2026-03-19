'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Loader2, 
  Calendar, 
  Users, 
  Scissors, 
  Star, 
  TrendingUp,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check localStorage first
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    
    console.log('Customer Dashboard - Stored User:', userData);
    console.log('Customer Dashboard - Auth User:', user);
    console.log('Customer Dashboard - User Role:', user?.role);
    console.log('Customer Dashboard - User Type:', user?.type);
    
    if (!isUserLoading) {
      if (!user && !userData) {
        router.push('/login');
      } else if (user?.role === 'salon' || user?.type === 'salon' || userData?.role === 'salon' || userData?.type === 'salon') {
        console.log('Main Dashboard - Redirecting to salon dashboard...');
        router.push('/dashboard/salon');
      } else if (user?.role === 'customer' || user?.type === 'customer' || userData?.role === 'customer' || userData?.type === 'customer') {
        console.log('Main Dashboard - Redirecting to customer dashboard...');
        router.push('/dashboard/customer');
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 selection:bg-primary/30 font-body scroll-smooth">
        <Navbar />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[20px] opacity-50 animate-pulse" />
                <Loader2 className="relative animate-spin h-12 w-12 text-purple-600" />
              </div>
              <p className="text-lg text-muted-foreground font-light tracking-wide">Loading Dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || user.userType === 'salon') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 selection:bg-primary/30 font-body scroll-smooth">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 md:py-20 space-y-8 md:space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-headline text-3xl md:text-5xl text-white">Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide">Welcome back, {user.email}</p>
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="relative group bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">Today</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">2</h3>
            <p className="text-gray-300 font-medium">Upcoming Appointments</p>
          </div>

          <div className="relative group bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-pink-500/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-pink-400" />
              <Badge className="bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-full">Total</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">12</h3>
            <p className="text-gray-300 font-medium">Total Bookings</p>
          </div>

          <div className="relative group bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <Scissors className="h-8 w-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">Services</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">8</h3>
            <p className="text-gray-300 font-medium">Services Tried</p>
          </div>

          <div className="relative group bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-green-500/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">Saved</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">₹2.8k</h3>
            <p className="text-gray-300 font-medium">Total Spent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-headline text-2xl md:text-3xl text-white mb-6">Upcoming Appointments</h2>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="group flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white">The Doon Mirror</p>
                        <p className="text-gray-400">Haircut & Styling</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">10:00 AM</p>
                      <p className="text-gray-400">Tomorrow</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-headline text-2xl md:text-3xl text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold border-none shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book New Appointment
                </Button>
                <Button className="w-full justify-start h-12 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-semibold transition-all duration-300" variant="outline">
                  <Scissors className="h-4 w-4 mr-2" />
                  Browse Salons
                </Button>
                <Button className="w-full justify-start h-12 rounded-full border border-pink-500/30 text-pink-300 hover:bg-pink-500/10 font-semibold transition-all duration-300" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  View Reviews
                </Button>
                <Button className="w-full justify-start h-12 rounded-full border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 font-semibold transition-all duration-300" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
