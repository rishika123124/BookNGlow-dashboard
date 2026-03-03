
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';

const AUTH_SUPPORT_ITEMS = [
  { icon: UserPlus, label: 'Registration', category: 'auth' },
  { icon: LogIn, label: 'Login', category: 'auth' },
  { icon: Key, label: 'Recovery', category: 'auth' },
  { icon: UserCog, label: 'Role Switching', category: 'auth' },
];

const BOOKING_SUPPORT_ITEMS = [
  { icon: CheckCircle, label: 'Booking Status', category: 'booking' },
  { icon: XCircle, label: 'Cancellation', category: 'booking' },
  { icon: Clock, label: 'Rescheduling', category: 'booking' },
];

export default function SupportPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contactInfo: '',
    category: '',
    subCategory: '',
    bookingId: '',
    description: '',
  });

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.displayName || '',
        contactInfo: user.email || '',
      }));
    }
  }, [user]);

  const handleCardClick = (category: string, subCategory: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
      subCategory,
      description: subCategory === 'Role Switching' 
        ? 'I would like to request a change in my account type (Customer/Salon).' 
        : prev.description
    }));

    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    toast({
      title: `${subCategory} selected`,
      description: "We've pre-filled the inquiry details for you.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.contactInfo || !formData.category || !formData.description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsLoading(true);

    const ticketData = {
      fullName: formData.fullName,
      contactInfo: formData.contactInfo,
      category: formData.category,
      subCategory: formData.subCategory,
      bookingId: formData.bookingId || '',
      description: formData.description,
      userId: user?.uid || 'guest',
      status: 'open',
      createdAt: serverTimestamp(),
    };

    try {
      const ticketsRef = collection(db, 'support_tickets');
      await addDoc(ticketsRef, ticketData).catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: 'support_tickets',
          operation: 'create',
          requestResourceData: ticketData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw e;
      });

      toast({
        title: "Inquiry Sent!",
        description: "BookNGlow will contact you shortly.",
      });
      
      // Clear form except user identity
      setFormData(prev => ({
        ...prev,
        category: '',
        subCategory: '',
        bookingId: '',
        description: '',
      }));
    } catch (error: any) {
      // Error is centrally handled by the emitter
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              BookNGlow Support
            </div>
            <h1 className="font-headline text-5xl md:text-7xl tracking-tight text-white">
              Support
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We’re here to help. Select a category below to resolve your issue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Quick Categories */}
            <div className="space-y-12">
              
              {/* Account & Login Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-headline text-2xl tracking-wide flex items-center gap-3">
                    <Key className="h-6 w-6 text-[#A78BFA]" />
                    Account & Login
                  </h2>
                  <p className="text-white/40 text-sm">Get help with registration, logging in, or managing your account settings.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AUTH_SUPPORT_ITEMS.map((item) => (
                    <div 
                      key={item.label}
                      onClick={() => handleCardClick(item.category, item.label)}
                      className={cn(
                        "group p-5 rounded-2xl bg-white/5 border border-white/10 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:bg-white/10 hover:border-purple-500/40",
                        formData.subCategory === item.label && "border-purple-500/50 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <item.icon className={cn(
                          "h-6 w-6 transition-transform group-hover:scale-110",
                          formData.subCategory === item.label ? "text-purple-400" : "text-white/40"
                        )} />
                        <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-white/40 transition-colors" />
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        formData.subCategory === item.label ? "text-white" : "text-white/80 group-hover:text-white"
                      )}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookings & Appointments Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-headline text-2xl tracking-wide flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-[#DB2777]" />
                    Bookings & Appointments
                  </h2>
                  <p className="text-white/40 text-sm">Manage your current bookings, check status, or handle cancellations.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BOOKING_SUPPORT_ITEMS.map((item) => (
                    <div 
                      key={item.label}
                      onClick={() => handleCardClick(item.category, item.label)}
                      className={cn(
                        "group p-5 rounded-2xl bg-white/5 border border-white/10 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:bg-white/10 hover:border-pink-500/40",
                        formData.subCategory === item.label && "border-pink-500/50 bg-pink-500/10 shadow-[0_0_25px_rgba(219,39,119,0.15)]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <item.icon className={cn(
                          "h-6 w-6 transition-transform group-hover:scale-110",
                          formData.subCategory === item.label ? "text-pink-500" : "text-white/40"
                        )} />
                        <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-white/40 transition-colors" />
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        formData.subCategory === item.label ? "text-white" : "text-white/80 group-hover:text-white"
                      )}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-white/10 space-y-8">
                <h3 className="font-headline text-2xl text-white">Direct Reach</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  <div className="flex items-center gap-4 text-white/60 group">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-purple-500/40 transition-colors">
                      <Mail className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">Office Email</p>
                      <p className="text-white font-medium">support@booknglow.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 group">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/40 transition-colors">
                      <Phone className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">Call Desk</p>
                      <p className="text-white font-medium">+91-135-BOOK-GLOW</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 group">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-pink-500/40 transition-colors">
                      <MapPin className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">HQ Location</p>
                      <p className="text-white font-medium">Rajpur Road, Dehradun</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Support Form */}
            <div ref={formRef} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 scroll-mt-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="space-y-3 relative z-10">
                <h3 className="font-headline text-3xl md:text-4xl text-white tracking-wide">BookNGlow</h3>
                <p className="text-white/40 text-sm md:text-base italic">Provide your details below and we will resolve your query within 2 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <Label className="text-white/60">Full Name</Label>
                  <Input 
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="e.g. Rahul Sharma" 
                    className="bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:ring-purple-500 focus:bg-white/10 transition-all" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">Registered Mobile / Email</Label>
                  <Input 
                    value={formData.contactInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                    placeholder="name@example.com or +91..." 
                    className="bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:ring-purple-500 focus:bg-white/10 transition-all" 
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white/60">Issue Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:ring-purple-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                        <SelectItem value="auth">Account & Login</SelectItem>
                        <SelectItem value="booking">Bookings & Appointments</SelectItem>
                        <SelectItem value="salon">Salon Partnership</SelectItem>
                        <SelectItem value="other">Other Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/60">Booking ID (Optional)</Label>
                    <Input 
                      value={formData.bookingId}
                      onChange={(e) => setFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                      placeholder="#BNG-XXXXX" 
                      className="bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">Describe your inquiry</Label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us how we can help you today..." 
                    className="bg-white/5 border-white/10 rounded-2xl min-h-[140px] text-white focus:ring-purple-500 focus:bg-white/10 transition-all resize-none" 
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl font-headline border-none shadow-2xl shadow-purple-500/30"
                >
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>
                      Submit Inquiry
                      <Send className="ml-3 h-5 w-5" />
                    </>
                  )}
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
