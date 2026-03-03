'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Loader2, 
  Sparkles, 
  Scissors, 
  CheckCircle2, 
  Info,
  Award,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SalonDetailPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const salonRef = useMemoFirebase(() => doc(db, 'salons', salonId as string), [db, salonId]);
  const { data: salon, isLoading } = useDoc(salonRef);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
      </div>
    );
  }

  // Fallback images based on ID or defaults
  const salonImage = PlaceHolderImages.find(img => img.id.includes(salonId as string))?.imageUrl || 
                     PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl || 
                     "https://picsum.photos/seed/salon/1200/800";

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <Image 
            src={salonImage} 
            alt={salon?.name || "Salon Details"} 
            fill 
            className="object-cover brightness-50 scale-105"
            priority
            data-ai-hint="luxury salon interior"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="container mx-auto space-y-6">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="text-white/60 hover:text-white mb-4 gap-2 group p-0"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back to Discovery
              </Button>
              
              <div className="space-y-4">
                <Badge className="bg-purple-600 text-white border-none px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/20">
                  <Award className="h-3 w-3 mr-2" />
                  VERIFIED PARTNER
                </Badge>
                <h1 className="font-headline text-5xl md:text-8xl tracking-tight leading-tight">
                  {salon?.name || "Premium Salon"}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/80 text-lg md:text-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <span>{salon?.area || salon?.location || "Dehradun"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <span className="font-bold">{salon?.rating || "4.9"}</span>
                    <span className="text-white/40 text-sm">(120+ Reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span>Open Today until 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          
          <div className="space-y-16">
            {/* About */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-purple-400" />
                <h2 className="font-headline text-3xl tracking-wide">About the Experience</h2>
              </div>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed">
                Experience unparalleled luxury at {salon?.name || "this salon"}. Our team of master stylists and therapists are dedicated to providing the gold standard of grooming in Dehradun. From precision haircuts to rejuvenating spa treatments, every visit is tailored to your unique style and relaxation needs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium">Certified Hygiene Standards</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium">Instant Slot Confirmation</span>
                </div>
              </div>
            </section>

            {/* Popular Services Preview */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Scissors className="h-6 w-6 text-purple-400" />
                <h2 className="font-headline text-3xl tracking-wide">Signature Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Executive Hair Design", price: "₹899", time: "45 mins" },
                  { name: "Luxury Beard Sculpting", price: "₹499", time: "30 mins" },
                  { name: "Revitalizing Scalp Therapy", price: "₹699", time: "40 mins" },
                  { name: "Charcoal Detox Facial", price: "₹1,299", time: "60 mins" },
                ].map((service, i) => (
                  <div key={i} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all hover:bg-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-headline text-xl text-white group-hover:text-purple-400 transition-colors">{service.name}</h4>
                      <span className="font-bold text-purple-400">{service.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{service.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Card Sidebar */}
          <aside className="relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Starting from</p>
                  <p className="text-4xl font-bold">₹299</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Consultation</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Member Discount</span>
                    <span className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Available</span>
                  </div>
                </div>

                <Button asChild className="w-full h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all text-xl font-headline border-none shadow-2xl shadow-purple-500/30">
                  <Link href={`/book/${salonId}`}>
                    Book Appointment
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest font-bold">
                  No advance payment required
                </p>
              </div>

              {/* Location Card */}
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4">
                <h3 className="font-headline text-xl">Find Us</h3>
                <div className="flex items-start gap-3 text-white/60">
                  <MapPin className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">
                    {salon?.area || "Rajpur Road"}, Dehradun, Uttarakhand 248001
                  </p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
