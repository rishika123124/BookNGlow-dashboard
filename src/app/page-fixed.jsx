'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Sparkles, 
  Search, 
  ChevronRight,
  LocateFixed,
  Zap,
  Gift,
  CheckCircle2,
  Award,
  Info,
  Loader2
} from 'lucide-react';

export default function Home() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const response = await fetch('/api/salons');
      const result = await response.json();
      
      if (result.success) {
        setSalons(result.data.regular || []); // Only show regular salons in categories
      }
    } catch (error) {
      console.error('Error fetching salons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter salons by category
  const maleSalons = salons.filter(salon => salon.salonType === 'Male');
  const femaleSalons = salons.filter(salon => salon.salonType === 'Female');
  const unisexSalons = salons.filter(salon => salon.salonType === 'Unisex');
  const premiumSalons = salons.filter(salon => salon.salonType === 'Premium');

  // Get styling based on salon type
  const getSalonCardStyling = (salonType) => {
    switch (salonType) {
      case 'Male':
        return {
          bg: 'bg-[#1e3a8a]',
          shadow: 'shadow-[0_20px_50px_rgba(37,99,235,0.15)]',
          badge: 'bg-blue-400 text-black',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'Female':
        return {
          bg: 'bg-[#831843]',
          shadow: 'shadow-[0_20px_50px_rgba(236,72,153,0.15)]',
          badge: 'bg-pink-400 text-black',
          button: 'bg-pink-600 hover:bg-pink-700'
        };
      case 'Unisex':
        return {
          bg: 'bg-[#7c3aed]',
          shadow: 'shadow-[0_20px_50px_rgba(124,58,237,0.15)]',
          badge: 'bg-purple-400 text-black',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'Premium':
        return {
          bg: 'bg-[#f59e0b]',
          shadow: 'shadow-[0_20px_50px_rgba(245,158,11,0.15)]',
          badge: 'bg-amber-400 text-black',
          button: 'bg-amber-600 hover:bg-amber-700'
        };
      default:
        return {
          bg: 'bg-[#1a1b3b]',
          shadow: 'shadow-[0_20px_50px_rgba(124,58,237,0.15)]',
          badge: 'bg-amber-400 text-black',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  // Salon Card Component
  const SalonCard = ({ salon }) => {
    const styling = getSalonCardStyling(salon.salonType);
    
    return (
      <div className={`group relative rounded-[30px] md:rounded-[40px] overflow-hidden ${styling.bg} ${styling.shadow} hover:scale-[1.02] transition-all duration-500`}>
        <div className="relative h-56 md:h-72">
          <Image 
            src={salon.salonImage || "https://picsum.photos/seed/salon-default/600/400"} 
            alt={salon.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent" />
          <Badge className={`absolute top-4 left-4 md:top-6 md:left-6 ${styling.badge} font-bold border-none shadow-lg text-[10px] md:text-xs`}>
            {salon.salonType}
          </Badge>
        </div>
        <div className="p-6 md:p-8 space-y-3 md:space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-xl md:text-2xl text-white">{salon.name}</h3>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
              <span className="text-sm font-bold">4.8</span>
            </div>
          </div>
          <p className="text-white/60 text-sm md:text-base line-clamp-2">{salon.location}</p>
          
          {salon.services && salon.services.length > 0 && (
            <div className="space-y-2">
              <p className="text-white/80 text-sm font-semibold">Services:</p>
              <div className="flex flex-wrap gap-2">
                {salon.services.slice(0, 3).map((service, index) => (
                  <span key={index} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                    {service.name} - ₹{service.price}
                  </span>
                ))}
                {salon.services.length > 3 && (
                  <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                    +{salon.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Button asChild className={`w-full rounded-full h-10 md:h-12 text-white font-semibold transition-all duration-300 border-none shadow-[0_0_20px_rgba(168,85,247,0.3)] ${styling.button}`}>
          <Link href={`/salons/${salon._id}`}>
            View Services
          </Link>
        </Button>
      </div>
    </div>
  );
};

  const heroImage = PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl || "https://picsum.photos/seed/salon-hero/1200/800";
  
  const categories = [
    { 
      id: 'male',
      title: "Male", 
      desc: "Premium Grooming for Men in Dehradun", 
      img: PlaceHolderImages.find(img => img.id === 'category-male')?.imageUrl || "https://picsum.photos/seed/male/600/800",
      theme: "border-blue-500 shadow-blue-500/30",
      overlay: "bg-blue-900/40",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.4)]",
      link: "/salons/male"
    },
    { 
      id: 'female',
      title: "Female", 
      desc: "Luxury Beauty & Spa Therapies for Women", 
      img: PlaceHolderImages.find(img => img.id === 'category-female')?.imageUrl || "https://picsum.photos/seed/female/600/800",
      theme: "border-pink-500 shadow-pink-500/30",
      overlay: "bg-pink-900/40",
      btn: "bg-pink-600 hover:bg-pink-700 shadow-[0_0_15px_rgba(219,39,119,0.4)]",
      link: "/salons/female"
    },
    { 
      id: 'unisex',
      title: "Unisex", 
      desc: "The Finest Inclusive Styling & Care", 
      img: PlaceHolderImages.find(img => img.id === 'category-unisex')?.imageUrl || "https://picsum.photos/seed/unisex/600/800",
      theme: "border-purple-500 shadow-purple-500/30",
      overlay: "bg-purple-900/40",
      btn: "bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.4)]",
      link: "/salons/unisex"
    }
  ];

  const localities = [
    { name: "#RajpurRoad", coords: "30.3600,78.0700" },
    { name: "#Jakhan", coords: "30.3667,78.0667" },
    { name: "#Ballupur", coords: "30.3392,78.0161" },
    { name: "#ClementTown", coords: "30.2678,78.0067" }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 font-body scroll-smooth">
      <Navbar />
      
      <main>
      
      
        {/* 1. Centered Hero Section */}
        <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroImage} 
              alt="Luxury Salon Interior" 
              fill 
              className="object-cover brightness-[0.3]"
              priority
              data-ai-hint="luxury salon"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-pink-900/20 to-blue-900/40" />
          </div>
          
          <div className="relative z-10 text-center space-y-6 md:space-y-8 px-6 max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-8xl leading-tight text-white">
              Welcome to <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold drop-shadow-sm">
                BookNGlow
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-3xl text-white/80 font-light tracking-wide max-w-2xl mx-auto">
              Dehradun's premier destination for elite grooming.
            </p>
            <div className="pt-4 md:pt-8">
              <Button asChild className="rounded-full px-8 md:px-12 h-14 md:h-16 text-lg md:text-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-none shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300">
                <Link href="#tailored-salons">Explore Salons</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Tailored For You - Gender Based Category Cards */}
        <section id="tailored-salons" className="container mx-auto px-4 py-12 md:py-20 space-y-8 md:space-y-12 scroll-mt-24">
          <div className="text-center space-y-4">
            <h2 className="font-headline text-3xl md:text-5xl text-foreground">Tailored For You</h2>
            <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`group relative h-[450px] md:h-[600px] rounded-[30px] md:rounded-[40px] overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${cat.theme}`}
              >
                <Image 
                  src={cat.img} 
                  alt={cat.title} 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  data-ai-hint={cat.id === 'male' ? 'barbershop luxury' : cat.id === 'female' ? 'spa beauty' : 'salon interior'}
                />
                <div className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-60 ${cat.overlay}`} />
                <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6 p-6 md:p-8 rounded-[24px] md:rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-3 md:gap-4 transform transition-all duration-500 group-hover:-translate-y-2">
                  <h3 className="font-headline text-2xl md:text-4xl text-white drop-shadow-md">{cat.title}</h3>
                  <p className="text-white/80 text-sm md:text-lg leading-snug drop-shadow-sm">{cat.desc}</p>
                  <Button asChild className={`w-full rounded-full h-10 md:h-12 text-sm md:text-base text-white font-semibold transition-all duration-300 border-none mt-2 ${cat.btn}`}>
                    <Link href={cat.link}>Explore Salons</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Premium Salons Grid */}
        <section id="premium-salons" className="relative bg-white py-12 md:py-24 overflow-hidden scroll-mt-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-purple-500/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 space-y-12 md:space-y-16">
            <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h2 className="font-display text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#DB2777] to-[#7C3AED] drop-shadow-[0_2px_10px_rgba(219,39,119,0.2)] leading-tight">
                  Dehradun's <span className="italic">Premium</span> Salons
                </h2>
                <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#2563EB] to-[#DB2777] animate-pulse" />
              </div>

              <p className="text-[#475569] text-sm md:text-lg tracking-wide leading-[1.8] max-w-3xl mx-auto font-sans">
                Discover the gold standard of grooming in the heart of Doon Valley. Explore Dehradun's most <span className="bg-gradient-to-r from-[#DB2777] to-[#7C3AED] bg-clip-text text-transparent font-bold">exclusive</span> premium salons—from the upscale vibes of <span className="bg-gradient-to-r from-[#DB2777] to-[#7C3AED] bg-clip-text text-transparent font-bold">Rajpur Road</span> to the elite studios of Jakhan. Whether you're looking for a <span className="bg-gradient-to-r from-[#DB2777] to-[#7C3AED] bg-clip-text text-transparent font-bold">signature glow</span> or expert styling, check out our handpicked collection of verified partners dedicated to luxury, hygiene, and perfection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : premiumSalons.length > 0 ? (
                premiumSalons.slice(0, 6).map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No salons found</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Male Salons Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 scroll-mt-24">
          <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#3B82F6] drop-shadow-[0_2px_10px_rgba(37,99,235,0.2)] leading-tight">
                Male Salons
              </h2>
              <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {maleSalons.length > 0 ? (
                maleSalons.map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No male salons found</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Female Salons Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 scroll-mt-24">
          <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#F472B6] drop-shadow-[0_2px_10px_rgba(236,72,153,0.2)] leading-tight">
                Female Salons
              </h2>
              <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#EC4899] to-[#F472B6] animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {femaleSalons.length > 0 ? (
                femaleSalons.map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No female salons found</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. Unisex Salons Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 scroll-mt-24">
          <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#A855F7] drop-shadow-[0_2px_10px_rgba(124,58,237,0.2)] leading-tight">
                Unisex Salons
              </h2>
              <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {unisexSalons.length > 0 ? (
                unisexSalons.map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No unisex salons found</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 7. Interactive 'Doon-Map' Feature */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="rounded-[2rem] md:rounded-[3rem] bg-slate-950 overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.3)] border-2 border-purple-500/20">
            <div className="grid lg:grid-cols-2">
              {/* Map Left */}
              <div className="relative h-[400px] md:h-[600px] overflow-hidden group">
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 shadow-xl">
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                  <span className="text-[8px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    50+ available salons in Doon
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-pink-600/10 pointer-events-none z-10" />
                
                <iframe
                  title="Dehradun Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55110.42835848529!2d30.325515321590483!3m2!1f0!2f0!3f0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
                  className="w-full h-full brightness-75 contrast-110 saturate-[1.2] scale-110 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute top-1/4 left-1/3 group/pin pointer-events-auto cursor-pointer">
                    <div className="h-6 w-6 md:h-7 md:w-7 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.9)] animate-bounce">
                      <div className="h-2 w-2 md:h-2.5 md:w-2.5 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-1/3 group/pin pointer-events-auto cursor-pointer">
                    <div className="h-6 w-6 md:h-7 md:w-7 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.9)] animate-bounce" style={{ animationDelay: '0.2s' }}>
                      <div className="h-2 w-2 md:h-2.5 md:w-2.5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Right */}
              <div className="p-8 md:p-16 space-y-8 md:space-y-10 flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-none px-3 py-1 md:px-4 md:py-1.5 flex items-center gap-2 w-fit shadow-lg shadow-purple-500/20 text-[10px] md:text-xs">
                    <LocateFixed className="h-3 w-3" />
                    NEON LIVE VIEW
                  </Badge>
                  <h2 className="font-headline text-3xl md:text-5xl leading-tight">Locate Your <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Nearest Glow</span></h2>
                  <p className="text-white/60 text-sm md:text-lg leading-relaxed">
                    Instantly find top-rated salons across Dehradun's hotspots. Our interactive map tracks real-time availability.
                  </p>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <Input 
                      placeholder="Search locality..." 
                      className="h-12 md:h-16 rounded-full bg-white/5 border-white/10 pl-12 md:pl-14 text-white placeholder:text-white/20 focus:ring-purple-500 focus:bg-white/10 transition-all text-sm md:text-base"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {localities.map((loc) => (
                      <button 
                        key={loc.name} 
                        className="px-4 py-2 md:px-6 md:py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all text-[10px] md:text-sm font-semibold tracking-wide shadow-lg active:scale-95"
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 md:pt-8 grid grid-cols-3 gap-2 md:gap-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.7)]" />
                    <span className="text-[8px] md:text-[10px] uppercase text-white/40 tracking-widest font-bold">Female</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
                    <span className="text-[8px] md:text-[10px] uppercase text-white/40 tracking-widest font-bold">Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
                    <span className="text-[8px] md:text-[10px] uppercase text-white/40 tracking-widest font-bold">Unisex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. About Us Section */}
        <section id="about-us" className="relative bg-slate-950 py-24 md:py-32 overflow-hidden scroll-mt-24">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 -left-1/4 w-full h-full bg-purple-600/30 rounded-full blur-[120px] animate-[pulse_10s_infinite]" />
             <div className="absolute bottom-0 -right-1/4 w-full h-full bg-blue-600/30 rounded-full blur-[120px] animate-[pulse_15s_infinite]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-16 lg:p-24 shadow-[0_0_80px_rgba(124,58,237,0.1)]">
              <div className="grid lg:grid-cols-3 gap-16 lg:gap-20 items-center">
                
                {/* Brand Identity */}
                <div className="space-y-8 text-center lg:text-left">
                  <div className="inline-flex flex-col items-center lg:items-start gap-6 group">
                    <div className="relative">
                      {/* Spinning Verified Border */}
                      <div className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-500/50 animate-[spin_8s_linear_infinite]" />
                      <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-2xl shadow-purple-500/40 animate-[bounce_4s_infinite]">
                        <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-headline text-4xl md:text-5xl text-white tracking-tight">
                        BookN<span className="text-accent">Glow</span>
                      </h2>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-accent">
                        <Award className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Dehradun's #1 Choice</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="font-headline text-xl md:text-2xl text-white/80 leading-relaxed italic">
                    "Dehradun's #1 digital bridge for elite grooming. We've handpicked the city's finest salons so you don't have to."
                  </p>
                </div>
                
                {/* Power Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 md:gap-8">
                  {[
                    { label: "Premium Salons", val: "50+", desc: "Verified partners across Rajpur Road, Jakhan, and Ballupur." },
                    { label: "Average Rating", val: "4.9/5", desc: "Rated by 5,000+ stylish Dehradun residents." },
                    { label: "Glows Delivered", val: "15k+", desc: "Successful bookings and happy faces across the city." }
                  ].map((stat, i) => (
                    <div key={i} className="group p-6 md:p-10 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 text-center space-y-3 transition-all duration-500 hover:border-purple-500/50 hover:bg-white/10 hover:-translate-y-2">
                      <div className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500 tracking-tighter">
                        {stat.val}
                      </div>
                      <div className="space-y-1">
                        <div className="text-white text-lg md:text-xl font-headline tracking-wide uppercase">{stat.label}</div>
                        <p className="text-white/40 text-xs md:text-sm font-body">{stat.desc}</p>
                      </div>
                    </div>
                  ))
                </div>

                {/* Platform Highlights */}
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h2 className="font-display text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Why Dehradun <br />Trusts BookNGlow</h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                  </div>

                  <div className="space-y-8">
                    {[
                      { icon: <Award className="h-6 w-6 text-pink-400" />, title: "Curated Selection", text: "Only salons with 4-star+ ratings and top-tier hygiene are listed." },
                      { icon: <Zap className="h-6 w-6 text-blue-400" />, title: "Instant Confirmation", text: "No more waiting for calls. Real-time slot booking." },
                      { icon: <Gift className="h-6 w-6 text-purple-400" />, title: "Glow Rewards", text: "Earn points on every booking at Dehradun's top boutiques." }
                    ].map((item, i) => (
                      <div key={i} className="group p-6 md:p-10 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 text-center space-y-3 transition-all duration-500 hover:border-purple-500/50 hover:bg-white/10 hover:-translate-y-2">
                        <div className="flex-shrink-0 p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                          {item.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg md:text-xl font-headline text-white tracking-wide">{item.title}</h4>
                          <p className="text-white/40 text-sm md:text-base leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-center lg:justify-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-white/40 text-xs md:text-sm font-body italic">
                      Trusted by top stylists at Rajpur Road.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
