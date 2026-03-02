'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Store, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'salon' | null>(null);

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center">
        <div className="text-center space-y-4 mb-12 max-w-2xl">
          <h1 className="font-headline text-4xl md:text-6xl text-foreground tracking-tight">
            Join the <span className="text-primary">Glow</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Dehradun's premier destination for elite grooming. Choose how you want to experience luxury.
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Join as Customer */}
            <Card 
              className="group relative overflow-hidden border-2 border-muted hover:border-primary/50 transition-all duration-500 cursor-pointer bg-card/50 backdrop-blur-sm"
              onClick={() => setSelectedRole('customer')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="p-8 pb-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Join as Customer</CardTitle>
                <CardDescription className="text-base mt-2">
                  Discover and book the finest salons in Dehradun.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Book appointments in seconds
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Earn Glow Rewards on every visit
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Exclusive deals at top-tier salons
                  </li>
                </ul>
                <Button className="w-full rounded-full h-12 text-lg font-headline group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                  Join Now <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Join as Salon Owner */}
            <Card 
              className="group relative overflow-hidden border-2 border-muted hover:border-accent/50 transition-all duration-500 cursor-pointer bg-card/50 backdrop-blur-sm"
              onClick={() => setSelectedRole('salon')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="p-8 pb-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Store className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-headline text-3xl">Join as Salon</CardTitle>
                <CardDescription className="text-base mt-2">
                  Grow your business with Dehradun's elite platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Manage bookings with ease
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Reach premium clients in Doon
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Showcase your salon's unique style
                  </li>
                </ul>
                <Button variant="secondary" className="w-full rounded-full h-12 text-lg font-headline group-hover:bg-accent group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all border-none">
                  Register Salon <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="w-full max-w-md bg-card border-2 border-muted p-8 rounded-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="font-headline text-3xl">Create your account</h2>
              <p className="text-muted-foreground">
                Signing up as a <span className="font-bold text-primary capitalize">{selectedRole}</span>
              </p>
              <button 
                onClick={() => setSelectedRole(null)}
                className="text-xs text-primary hover:underline"
              >
                Change account type
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground italic">
                Form for {selectedRole} will appear here...
              </p>
              <Button className="w-full rounded-full h-12" onClick={() => alert('Form implementation follows next!')}>
                Proceed
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
