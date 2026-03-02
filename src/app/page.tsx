import { Navbar } from '@/components/dashboard/Navbar'
import Image from 'next/image'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  MapPin, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  Quote
} from 'lucide-react'

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl || "https://picsum.photos/seed/salon-hero/1200/800";
  
  const categories = [
    { 
      id: 'male',
      title: "Male", 
      desc: "Premium Grooming for Men in Dehradun", 
      img: PlaceHolderImages.find(img => img.id === 'category-male')?.imageUrl || "https://picsum.photos/seed/male/600/800",
      theme: "border-blue-500 shadow-blue-500/30",
      overlay: "bg-blue-900/40",
      btn: "bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
    },
    { 
      id: 'female',
      title: "Female", 
      desc: "Luxury Beauty & Spa Therapies for Women", 
      img: PlaceHolderImages.find(img => img.id === 'category-female')?.imageUrl || "https://picsum.photos/seed/female/600/800",
      theme: "border-pink-500 shadow-pink-500/30",
      overlay: "bg-pink-900/40",
      btn: "bg-pink-600 hover:bg-pink-700 shadow-[0_0_15px_rgba(219,39,119,0.4)]"
    },
    { 
      id: 'unisex',
      title: "Unisex", 
      desc: "The Finest Inclusive Styling & Care", 
      img: PlaceHolderImages.find(img => img.id === 'category-unisex')?.imageUrl || "https://picsum.photos/seed/unisex/600/800",
      theme: "border-purple-500 shadow-purple-500/30",
      overlay: "bg-purple-900/40",
      btn: "bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
    }
  ];

  const premiumSalons = [
    { 
      name: "Aura Luxe Spa", 
      area: "Jakhan", 
      rating: "4.9", 
      img: PlaceHolderImages.find(img => img.id === 'salon-aura')?.imageUrl || "https://picsum.photos/seed/aura/600/600" 
    },
    { 
      name: "The Doon Mirror", 
      area: "Rajpur Road", 
      rating: "4.8", 
      img: PlaceHolderImages.find(img => img.id === 'salon-mirror')?.imageUrl || "https://picsum.photos/seed/mirror/600/600" 
    },
    { 
      name: "Velvet Grooming", 
      area: "Rajpur Road", 
      rating: "5.0", 
      img: PlaceHolderImages.find(img => img.id === 'salon-velvet')?.imageUrl || "https://picsum.photos/seed/velvet/600/600" 
    },
    { 
      name: "The Lush Studio", 
      area: "Jakhan", 
      rating: "4.7", 
      img: PlaceHolderImages.find(img => img.id === 'salon-lush')?.imageUrl || "https://picsum.photos/seed/lush/600/600" 
    },
    { 
      name: "Serene Day Spa", 
      area: "Rajpur Road", 
      rating: "4.9", 
      img: PlaceHolderImages.find(img => img.id === 'salon-serene')?.imageUrl || "https://picsum.photos/seed/serene/600/600" 
    },
    { 
      name: "Classic Cut Barbers", 
      area: "Ballupur", 
      rating: "4.8", 
      img: PlaceHolderImages.find(img => img.id === 'salon-classic')?.imageUrl || "https://picsum.photos/seed/classic/600/600" 
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 font-body">
      <Navbar />
      
      <main>
        
        {/* 1. Centered Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
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
          
          <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl">
            <h1 className="font-headline text-6xl md:text-8xl leading-tight text-white">
              Welcome to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold drop-shadow-sm">
                BookNGlow
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 font-light tracking-wide max-w-2xl mx-auto">
              Dehradun’s premier destination for elite grooming.
            </p>
            <div className="pt-8">
              <Button className="rounded-full px-12 h-16 text-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-none shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 transition-all duration-300">
                Explore Salons
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Tailored For You - Gender Based Category Cards */}
        <section className="container mx-auto px-4 py-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-headline text-5xl text-foreground">Tailored For You</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`group relative h-[600px] rounded-[40px] overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${cat.theme}`}
              >
                {/* Background Image with Zoom */}
                <Image 
                  src={cat.img} 
                  alt={cat.title} 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  data-ai-hint={cat.id === 'male' ? 'barbershop luxury' : cat.id === 'female' ? 'spa beauty' : 'salon interior'}
                />
                
                {/* Colored Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-60 ${cat.overlay}`} />

                {/* Glassmorphic Content Box */}
                <div className="absolute inset-x-6 bottom-6 p-8 rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-4 transform transition-all duration-500 group-hover:-translate-y-2">
                  <h3 className="font-headline text-4xl text-white drop-shadow-md">{cat.title}</h3>
                  <p className="text-white/80 text-lg leading-snug drop-shadow-sm">{cat.desc}</p>
                  <Button className={`w-full rounded-full h-12 text-white font-semibold transition-all duration-300 border-none mt-2 ${cat.btn}`}>
                    Explore Salons
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Premium Salons Grid */}
        <section className="bg-slate-50/50 py-24">
          <div className="container mx-auto px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4">
                <h2 className="font-headline text-5xl text-foreground">The Premium Collection</h2>
                <p className="text-muted-foreground text-xl">Handpicked elite salons across Rajpur Road and Jakhan.</p>
              </div>
              <Button variant="link" className="text-purple-600 font-bold text-lg group">
                View All Elite <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {premiumSalons.map((salon, i) => (
                <div 
                  key={i} 
                  className="group relative rounded-[40px] overflow-hidden bg-[#1a1b3b] shadow-[0_20px_50px_rgba(124,58,237,0.15)] hover:scale-[1.02] transition-all duration-500"
                >
                  <div className="relative h-72">
                    <Image src={salon.img} alt={salon.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent" />
                    <Badge className="absolute top-6 left-6 bg-amber-400 text-black font-bold border-none shadow-lg">
                      PREMIUM
                    </Badge>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-headline text-2xl text-white">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-bold">{salon.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="h-4 w-4" />
                      <span>{salon.area}, Dehradun</span>
                    </div>
                    <Button className="w-full rounded-full bg-white/10 hover:bg-white/20 text-white border-none h-12">
                      View Profile
                    </Button>
                  </div>
                  <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0)] group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-all duration-500 rounded-[40px]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Interactive 'Doon-Map' Feature */}
        <section className="container mx-auto px-4 py-24">
          <div className="rounded-[2.5rem] bg-slate-950 overflow-hidden shadow-2xl border border-white/5">
            <div className="grid lg:grid-cols-2">
              {/* Map Left */}
              <div className="relative h-[500px] bg-[#0f172a] p-8 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:30px_30px]" />
                <div className="relative w-full h-full border border-white/10 rounded-2xl overflow-hidden bg-slate-900/50">
                   <div className="absolute top-1/4 left-1/3 group">
                      <div className="h-4 w-4 bg-purple-500 rounded-full animate-ping absolute" />
                      <div className="h-4 w-4 bg-purple-500 rounded-full border-2 border-white relative z-10 shadow-[0_0_15px_rgba(168,85,247,1)]" />
                   </div>
                   <div className="absolute top-1/2 right-1/4 group">
                      <div className="h-4 w-4 bg-blue-500 rounded-full animate-ping absolute" />
                      <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white relative z-10 shadow-[0_0_15px_rgba(59,130,246,1)]" />
                   </div>
                   <div className="absolute bottom-1/3 left-1/2 group">
                      <div className="h-4 w-4 bg-purple-500 rounded-full animate-ping absolute" />
                      <div className="h-4 w-4 bg-purple-500 rounded-full border-2 border-white relative z-10 shadow-[0_0_15px_rgba(168,85,247,1)]" />
                   </div>
                   <div className="absolute bottom-8 left-8 text-white/40 text-xs font-headline uppercase tracking-widest">Minimalist Doon View</div>
                </div>
              </div>
              
              {/* Content Right */}
              <div className="p-12 md:p-16 space-y-10 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-white">
                <div className="space-y-4">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 px-4 py-1">LIVE VIEW</Badge>
                  <h2 className="font-headline text-5xl">Locate Your Nearest Glow</h2>
                  <p className="text-white/60 text-lg leading-relaxed">
                    Instantly find top-rated salons across Dehradun's prime hotspots. Our map tracks real-time availability.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <Input 
                      placeholder="Search locality..." 
                      className="h-16 rounded-full bg-white/5 border-white/10 pl-14 text-white placeholder:text-white/20 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {["#RajpurRoad", "#Jakhan", "#Ballupur", "#Sahastradhara"].map((chip) => (
                      <button key={chip} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all text-sm font-medium">
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Platform Stats & About */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Sparkles className="h-full w-full rotate-12 scale-150" />
          </div>
          <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="font-headline text-5xl">Our Story</h2>
              <div className="space-y-6 font-headline text-2xl leading-relaxed italic opacity-90">
                <Quote className="h-12 w-12 text-blue-200 opacity-50 mb-4" />
                <p>
                  BookNGlow was born from a simple vision: to bring world-class beauty and grooming experiences to the heart of Dehradun. We connect you with the finest artisans who treat beauty as a refined art form.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { label: "Verified Salons", val: "50+" },
                { label: "Happy Clients", val: "10,000+" },
                { label: "Doon Localities", val: "20+" },
                { label: "Glow Experts", val: "200+" }
              ].map((stat, i) => (
                <div key={i} className="p-10 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 text-center space-y-2">
                  <div className="text-5xl font-bold">{stat.val}</div>
                  <div className="text-white/70 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-slate-950 text-white pt-24 pb-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="font-headline text-3xl tracking-tight">
                  BookN<span className="text-accent">Glow</span>
                </span>
              </div>
              <p className="font-body text-white/60 leading-relaxed">
                Elevating beauty standards through technology and refined luxury in the heart of Dehradun.
              </p>
              <div className="flex gap-4">
                <div className="p-2 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="p-2 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-headline text-xl">Popular Areas</h4>
              <ul className="font-body text-white/60 space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Rajpur Road</li>
                <li className="hover:text-white cursor-pointer transition-colors">Jakhan</li>
                <li className="hover:text-white cursor-pointer transition-colors">Sahastradhara Road</li>
                <li className="hover:text-white cursor-pointer transition-colors">Ballupur</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-headline text-xl">Top Services</h4>
              <ul className="font-body text-white/60 space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Bridal Makeovers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Keratin Treatment</li>
                <li className="hover:text-white cursor-pointer transition-colors">Deep Tissue Spa</li>
                <li className="hover:text-white cursor-pointer transition-colors">Signature Facials</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-headline text-xl">Newsletter</h4>
              <p className="font-body text-sm text-white/60">Subscribe for exclusive Doon offers.</p>
              <div className="flex flex-col gap-2">
                <Input placeholder="Your email" className="bg-white/5 border-white/10 text-white rounded-xl h-12" />
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-8">
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-headline uppercase tracking-widest text-white/40">Verified Salons</span>
              </div>
              <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                <CreditCard className="h-6 w-6 text-accent" />
                <span className="text-[10px] font-headline uppercase tracking-widest text-white/40">Secure Payment</span>
              </div>
            </div>
            
            <p className="text-xs text-white/40 font-body">
              © 2024 BookNGlow Dehradun. Crafted for the radiant.
            </p>
            
            <div className="flex gap-8 font-body text-xs text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
