
import { Navbar } from '@/components/dashboard/Navbar'
import { CategoryBar } from '@/components/dashboard/CategoryBar'
import Image from 'next/image'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  Clock, 
  MapPin, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  Gem,
  Zap,
  Crown,
  Scissors,
  Flower2,
  Brush,
  Smile
} from 'lucide-react'

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'salon-hero')?.imageUrl || "https://picsum.photos/seed/salon-hero/1200/800";
  const serviceImage = PlaceHolderImages.find(img => img.id === 'salon-1')?.imageUrl || "https://picsum.photos/seed/salon-1/600/600";

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 space-y-24">
        
        {/* 1. Smart Hero Section */}
        <section className="relative flex flex-col lg:flex-row items-center gap-12 pt-8">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="font-headline text-5xl md:text-7xl text-foreground leading-tight">
              Dehradun's Finest <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-bold">
                Salon Experience
              </span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              From Rajpur Road to Jakhan, discover and book every type of beauty service—from premium hair studios to local grooming experts.
            </p>
            
            {/* Quick Book Pill */}
            <div className="bg-white/80 backdrop-blur-xl border border-primary/10 rounded-full p-2 shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto lg:mx-0">
              <div className="flex-1 flex items-center gap-2 px-6 py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full">
                <MapPin className="h-5 w-5 text-primary" />
                <select className="bg-transparent border-none focus:ring-0 font-body text-sm w-full outline-none">
                  <option>Select Locality</option>
                  <option>Rajpur Road</option>
                  <option>Jakhan</option>
                  <option>Sahastradhara</option>
                  <option>Ballupur</option>
                </select>
              </div>
              <div className="flex-1 flex items-center gap-2 px-6 py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full">
                <Crown className="h-5 w-5 text-accent" />
                <select className="bg-transparent border-none focus:ring-0 font-body text-sm w-full outline-none">
                  <option>Any Service</option>
                  <option>Hair Styling</option>
                  <option>Bridal Makeup</option>
                  <option>Luxury Facial</option>
                  <option>Nail Art</option>
                  <option>Men's Grooming</option>
                </select>
              </div>
              <div className="flex-1 flex items-center gap-2 px-6 py-2 w-full">
                <Clock className="h-5 w-5 text-primary/60" />
                <span className="font-body text-sm text-muted-foreground">Check Slots</span>
              </div>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-12 shadow-[0_0_20px_rgba(168,85,247,0.4)] group transition-all shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-xl aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2.5rem] blur-3xl animate-pulse" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
              <Image 
                src={heroImage} 
                alt="Luxury Salon Experience in Dehradun" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                data-ai-hint="luxury salon"
              />
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce duration-[3000ms] hover:animate-none">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-accent">
                    <Image src={serviceImage} alt="Stylist at work" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold">Doon Signature Glow</p>
                    <p className="text-xs text-muted-foreground font-body">Expert: Elena V.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Service Hotspots */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-headline text-4xl text-foreground">Explore Every Service</h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Whether it's a quick trim or an elaborate bridal makeover, find Dehradun's best-rated salons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Bridal Suites", 
                desc: "Exclusive for Doon weddings. Premium vanity and total privacy for your big day.", 
                icon: Crown,
                img: "https://picsum.photos/seed/bridal/600/400"
              },
              { 
                title: "Signature Grooming", 
                desc: "The ultimate men's grooming experience in a relaxed, high-end setting.", 
                icon: Gem,
                img: "https://picsum.photos/seed/grooming/600/400"
              },
              { 
                title: "Luxury Skin Therapies", 
                desc: "Advanced dermatological care meets spa-level comfort for that Doon glow.", 
                icon: Sparkles,
                img: "https://picsum.photos/seed/skin/600/400"
              }
            ].map((cat, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-primary/10 shadow-sm hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.4)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="relative h-48 overflow-hidden">
                  <Image src={cat.img} alt={cat.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <cat.icon className="absolute bottom-4 left-6 h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-headline text-2xl text-foreground group-hover:text-primary transition-colors">{cat.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{cat.desc}</p>
                  <Button variant="link" className="p-0 text-accent font-bold group/btn">
                    Discover More <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Salons Near You Live Map Feature */}
        <section className="bg-slate-50 rounded-[2.5rem] p-12 border border-gray-100 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                <Zap className="h-4 w-4 animate-pulse" />
                Live Availability
              </div>
              <h2 className="font-headline text-4xl text-foreground leading-tight">
                Instantly Locate <br />
                <span className="text-primary">Salons Across Dehradun</span>
              </h2>
              <p className="font-body text-muted-foreground text-lg">
                Our real-time network tracks the best stylists available now across Rajpur Road, Jakhan, and Sahastradhara.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { name: "Jakhan", color: "text-accent", status: "8 Active Salons" },
                  { name: "Rajpur Road", color: "text-primary", status: "Premium Partner Zone" },
                  { name: "Sahastradhara", color: "text-accent", status: "4 Available Now" }
                ].map((loc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full bg-current ${loc.color}`} />
                      <span className="font-headline text-lg">{loc.name}</span>
                    </div>
                    <span className="font-body text-sm text-muted-foreground italic">{loc.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylized Map View */}
            <div className="relative aspect-square lg:aspect-video rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-200">
               <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />
               {/* Pulse Markers */}
               <div className="absolute top-1/4 left-1/3">
                  <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping h-8 w-8" />
                  <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute top-6 left-2 bg-white px-3 py-1 rounded-lg shadow-md text-[10px] font-bold whitespace-nowrap">Aura Luxe Spa (Jakhan)</div>
               </div>
               <div className="absolute top-1/2 right-1/4">
                  <div className="absolute inset-0 bg-accent/40 rounded-full animate-ping h-8 w-8" />
                  <div className="relative h-4 w-4 bg-accent rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute top-6 left-2 bg-white px-3 py-1 rounded-lg shadow-md text-[10px] font-bold whitespace-nowrap">Nail Nirvana (Jakhan)</div>
               </div>
               <div className="absolute bottom-1/3 left-1/2">
                  <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping h-8 w-8" />
                  <div className="relative h-4 w-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute top-6 left-2 bg-white px-3 py-1 rounded-lg shadow-md text-[10px] font-bold whitespace-nowrap">Glow Studio (Premium)</div>
               </div>
            </div>
          </div>
        </section>

        {/* 4. Loyalty Glow Points */}
        <section className="text-center space-y-12 py-12">
          <div className="inline-flex flex-col items-center">
             <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] mb-6">
                <Sparkles className="h-10 w-10 text-white" />
             </div>
             <h2 className="font-headline text-5xl text-foreground">Book. Glow. Repeat.</h2>
          </div>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Earn <span className="text-primary font-bold">Glow Points</span> on every booking across all Dehradun salons. Redeem your brilliance for free head massages, luxury upgrades, or exclusive discounts.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center gap-2 max-w-[200px]">
               <div className="text-3xl font-headline text-primary">150+</div>
               <p className="font-body text-sm text-muted-foreground">Partner Salons in Doon</p>
            </div>
            <div className="flex flex-col items-center gap-2 max-w-[200px]">
               <div className="text-3xl font-headline text-accent">75K+</div>
               <p className="font-body text-sm text-muted-foreground">Glow Points Redeemed</p>
            </div>
            <div className="flex flex-col items-center gap-2 max-w-[200px]">
               <div className="text-3xl font-headline text-primary">VIP</div>
               <p className="font-body text-sm text-muted-foreground">Priority Booking for Top Earners</p>
            </div>
          </div>
          <Button className="rounded-full px-12 h-14 text-lg bg-accent hover:bg-accent/90 shadow-xl border-none">
            Join the Loyalty Circle
          </Button>
        </section>

      </main>

      {/* 5. Professional Footer */}
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
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return <a href={href} className={className}>{children}</a>
}
