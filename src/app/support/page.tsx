'use client';

import React from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserPlus,
  LogIn,
  Key,
  UserCog,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Phone,
} from 'lucide-react';

const AUTH_SUPPORT_ITEMS = [
  { icon: UserPlus, label: 'Registration Issues' },
  { icon: LogIn, label: 'Login Trouble' },
  { icon: Key, label: 'Account Recovery' },
  { icon: UserCog, label: 'Role Switching' },
];

const BOOKING_SUPPORT_ITEMS = [
  { icon: CheckCircle, label: 'Booking Status' },
  { icon: XCircle, label: 'Cancellation & Refunds' },
  { icon: Clock, label: 'Rescheduling' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              Concierge Desk
            </div>
            <h1 className="font-headline text-5xl md:text-7xl tracking-tight text-white">
              Support
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto">
              How can our luxury concierge assist you today?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Quick Categories */}
            <div className="space-y-12">
              
              {/* Authentication Support */}
              <div className="space-y-6">
                <h2 className="font-headline text-2xl tracking-wide flex items-center gap-3">
                  <Key className="h-5 w-5 text-[#A78BFA]" />
                  Authentication Support
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AUTH_SUPPORT_ITEMS.map((item) => (
                    <div 
                      key={item.label}
                      className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                    >
                      <item.icon className="h-6 w-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Support */}
              <div className="space-y-6">
                <h2 className="font-headline text-2xl tracking-wide flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#DB2777]" />
                  Booking Support
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BOOKING_SUPPORT_ITEMS.map((item) => (
                    <div 
                      key={item.label}
                      className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all cursor-pointer"
                    >
                      <item.icon className="h-6 w-6 text-pink-500 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-white/10 space-y-6">
                <h3 className="font-headline text-xl text-white">Office Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold">Email Us</p>
                      <p className="text-white font-medium">support@booknglow.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold">Our Location</p>
                      <p className="text-white font-medium">Rajpur Road, Dehradun</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold">Call Us</p>
                      <p className="text-white font-medium">+91-135-BOOK-GLOW</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Support Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8">
              <div className="space-y-2">
                <h3 className="font-headline text-3xl text-white tracking-wide">Submit an Inquiry</h3>
                <p className="text-white/40 text-sm italic">Expect a response within 2 business hours.</p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white/60">Full Name</Label>
                  <Input 
                    placeholder="Enter your full name" 
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">Registered Mobile / Email</Label>
                  <Input 
                    placeholder="name@example.com or +91..." 
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">Issue Category</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="auth">Account & Login</SelectItem>
                      <SelectItem value="booking">Booking & Cancellation</SelectItem>
                      <SelectItem value="salon">Salon Partnership</SelectItem>
                      <SelectItem value="other">Other Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">Booking ID (Optional)</Label>
                  <Input 
                    placeholder="e.g. #BNG-12345" 
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">Describe the Issue</Label>
                  <Textarea 
                    placeholder="Provide details about your inquiry..." 
                    className="bg-white/5 border-white/10 rounded-xl min-h-[120px] text-white focus:ring-purple-500" 
                  />
                </div>

                <Button 
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-all text-lg font-headline border-none shadow-xl shadow-purple-500/20"
                >
                  Send Inquiry
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
