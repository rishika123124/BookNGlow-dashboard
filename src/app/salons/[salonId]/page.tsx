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
  Zap,
  Phone,
  Mail,
  Calendar
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

  const isVelvet = salonId === 'velvet-grooming';

  const services = isVelvet ? [
    { name: "Executive Hair Design", price: "₹899", time: "45 mins", desc: "Precision cut tailored to your face shape." },
    { name: "Luxury Beard Sculpting", price: "₹499", time: "30 mins", desc: "Hot towel treatment and razor finish." },
    { name: "Revitalizing Scalp Therapy", price: "₹699", time: "40 mins", desc: "Deep conditioning with essential oils." },
    { name: "Charcoal Detox Facial", price: "₹1,299", time: "60 mins", desc: "Deep pore cleansing for a fresh glow." },
    { name: "Global Hair Color", price: "₹1,999", time: "90 mins", desc: "Premium ammonia-free coloring." },
  ] : [
    { name: "Signature Haircut", price: "₹499", time: "45 mins", desc: "Classic styling for the modern individual." },
    { name: "Spa Pedicure", price: "₹799", time: "60 mins", desc: "Relaxing foot soak and massage." },
    { name: "Deep Tissue Massage", price: "₹1,499", time: "60 mins", desc: "Muscle tension relief therapy." },
    { name: "Classic Facial", price: "₹999", time: "45 mins", desc: "Standard skin rejuvenation." },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
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
                onClick={() => router.push('/')}
                className="text-white/60 hover:text-white mb-4 gap-2 group p-0 h-auto"
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
                  {salon?.name || (isVelvet ? "Velvet Grooming" : "Premium Salon")}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/80 text-lg md:text-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <span>{salon?.area || (isVelvet ? "Rajpur Road" : "Dehradun")}, Dehradun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <span className="font-bold">{salon?.rating || "4.9"}</span>
                    <span className="text-white/40 text-sm">(120+ Reviews)</span>
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
                Experience unparalleled luxury at {salon?.name || (isVelvet ? "Velvet Grooming" : "this salon")}. 
                {isVelvet && " Known as Rajpur Road's most elite styling studio, we specialize in high-fashion grooming and therapeutic care."} 
                Our team of master stylists and therapists are dedicated to providing the gold standard of grooming in Dehradun. 
                Every visit is tailored to your unique style and relaxation needs.
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

            {/* Signature Services with Prices */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Scissors className="h-6 w-6 text-purple-400" />
                <h2 className="font-headline text-3xl tracking-wide">Signature Services & Menu</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {services.map((service, i) => (
                  <div key={i} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all hover:bg-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-headline text-xl text-white group-hover:text-purple-400 transition-colors">{service.name}</h4>
                        <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">{service.time}</Badge>
                      </div>
                      <p className="text-white/40 text-sm font-light">{service.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-2xl text-purple-400 font-headline">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Timings and Contact Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Working Hours */}
               <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <Clock className="h-6 w-6 text-blue-400" />
                   <h2 className="font-headline text-2xl">Operating Hours</h2>
                 </div>
                 <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                       <span className="text-white/60">Mon - Sun</span>
                       <span className="font-bold text-emerald-400">10:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30 italic">
                      <Info className="h-3 w-3" />
                      Appointments recommended for weekends.
                    </div>
                 </div>
               </div>

               {/* Contact details */}
               <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <Phone className="h-6 w-6 text-pink-400" />
                   <h2 className="font-headline text-2xl">Contact Details</h2>
                 </div>
                 <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                          <Phone className="h-4 w-4 text-pink-400" />
                       </div>
                       <div>
                          <p className="text-[10px] uppercase text-white/30 font-bold">Booking Hotline</p>
                          <p className="text-white font-medium">+91 135-VELVET-GLOW</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Mail className="h-4 w-4 text-blue-400" />
                       </div>
                       <div>
                          <p className="text-[10px] uppercase text-white/30 font-bold">Salon Email</p>
                          <p className="text-white font-medium">contact@velvetgrooming.com</p>
                       </div>
                    </div>
                 </div>
               </div>
            </section>
          </div>

          {/* Booking Card Sidebar */}
          <aside className="relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Initial Consultation</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Member Exclusive Rewards</span>
                    <span className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Available</span>
                  </div>
                </div>

                <Button asChild className="w-full h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all text-xl font-headline border-none shadow-2xl shadow-purple-500/30">
                  <Link href={`/book/${salonId}`}>
                    Book Now
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center gap-2">
                   <ShieldCheck className="h-3 w-3 text-emerald-400" />
                   <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                     No Pre-payment Required
                   </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4">
                <h3 className="font-headline text-xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  Locate Us
                </h3>
                <div className="space-y-4">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {salon?.area || (isVelvet ? "Rajpur Road" : "Dehradun")}, Dehradun, Uttarakhand 248001
                  </p>
                  <div className="h-64 w-full rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                    <iframe
                      title="Salon Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.603370335032!2d78.0700!3d30.3600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c03251d499!2sRajpur%20Road%2C%20Dehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
                      className="w-full h-full brightness-90 contrast-110 saturate-[1.2]"
                      loading="lazy"
                    />
                  </div>
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
