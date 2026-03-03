'use client';

import React, { useState, useEffect } from 'react';
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
  Award,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  CalendarDays
} from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function SalonDetailPage() {
  const { salonId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch Salon Data from Firestore
  const salonRef = useMemoFirebase(() => doc(db, 'salons', salonId as string), [db, salonId]);
  const { data: salon, isLoading } = useDoc(salonRef);

  // Dynamic Open/Closed Logic
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      // Logic for 10:00 AM to 09:00 PM
      setIsOpen(hours >= 10 && hours < 21);
    };
    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#E57373] animate-spin" />
      </div>
    );
  }

  const salonImage = PlaceHolderImages.find(img => img.id.includes(salonId as string))?.imageUrl || 
                     PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || 
                     "https://picsum.photos/seed/lush/1200/800";

  // Example Services if not in DB
  const defaultServices = [
    { name: "Executive Hair Design", price: 899, time: "45 mins" },
    { name: "Luxury Beard Sculpting", price: 499, time: "30 mins" },
    { name: "Revitalizing Scalp Therapy", price: 699, time: "40 mins" },
    { name: "Charcoal Detox Facial", price: 1299, time: "60 mins" },
    { name: "Global Hair Color", price: 1999, time: "90 mins" },
  ];

  const services = salon?.services || defaultServices;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#E57373]/20">
      {/* Header with Dark Navy Background */}
      <div className="bg-[#0B1120] text-white">
        <Navbar />
      </div>

      <main className="pb-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-8 md:pt-12">
          <div className="relative h-[300px] md:h-[500px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
            <Image 
              src={salonImage} 
              alt={salon?.name || "The Lush Studio"} 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              data-ai-hint="luxury salon interior"
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

        {/* Info Header */}
        <div className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={cn(
                  "px-4 py-1.5 rounded-full text-white font-bold border-none text-[10px] tracking-widest",
                  isOpen ? "bg-emerald-500" : "bg-rose-500"
                )}>
                  {isOpen ? 'OPEN NOW' : 'CLOSED'}
                </Badge>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-lg">{salon?.rating || "4.7"}</span>
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#0B1120] tracking-tight">
                {salon?.name || "The Lush Studio"}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-[#1A1A1A]/60">
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
               <div className="flex items-center gap-4 text-sm font-medium mb-2">
                  <div className="flex items-center gap-1.5 text-emerald-600"><ShieldCheck className="h-4 w-4" /> Verified</div>
                  <div className="flex items-center gap-1.5 text-purple-600"><Award className="h-4 w-4" /> Premium</div>
               </div>
               <Button asChild size="lg" className="rounded-full bg-[#E57373] hover:bg-[#D46262] text-white font-semibold shadow-lg shadow-[#E57373]/20 border-none transition-all hover:scale-105 px-8 h-12">
                <Link href={`/book/${salonId}`} className="flex items-center gap-2">
                  Book Appointment Now
                  <CalendarDays className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          
          <div className="space-y-16">
            {/* Services List */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-[#0B1120]">Available Services</h2>
                <Scissors className="h-6 w-6 text-[#E57373]" />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {services.map((service, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white border border-black/5 hover:border-[#E57373]/30 transition-all shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg md:text-xl text-[#0B1120] group-hover:text-[#E57373] transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-black/40 text-sm font-medium">{service.time || "45 mins"}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-xl md:text-2xl text-[#E57373]">₹{service.price}</span>
                      <Button asChild variant="outline" className="rounded-full border-[#E57373]/20 hover:bg-[#E57373]/5 text-[#E57373] h-10 px-6 font-semibold">
                        <Link href={`/book/${salonId}`}>Select</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Location Card */}
            <div className="bg-white border border-black/5 rounded-[2rem] p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E57373]/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#E57373]" />
                </div>
                <h3 className="font-display text-2xl text-[#0B1120]">Location</h3>
              </div>
              <p className="text-black/60 leading-relaxed font-medium">
                {salon?.area || "Rajpur Road"}, Dehradun, Uttarakhand 248001
              </p>
              <Button className="w-full h-12 rounded-full bg-white border border-black/10 text-[#0B1120] hover:bg-black/5 gap-2 font-semibold">
                View on Map
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {/* Contact Card */}
            <div className="bg-white border border-black/5 rounded-[2rem] p-8 space-y-6 shadow-sm">
              <h3 className="font-display text-2xl text-[#0B1120]">Reach Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-black/60 hover:text-[#0B1120] transition-colors cursor-pointer">
                  <Phone className="h-5 w-5 text-[#E57373]" />
                  <span className="font-medium">+91 135-GLOW-NOW</span>
                </div>
                <div className="flex items-center gap-4 text-black/60 hover:text-[#0B1120] transition-colors cursor-pointer">
                  <Mail className="h-5 w-5 text-[#E57373]" />
                  <span className="font-medium">hello@thelushstudio.com</span>
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
