import { Navbar } from '@/components/dashboard/Navbar'
import { CategoryBar } from '@/components/dashboard/CategoryBar'
import Image from 'next/image'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Clock, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBF8F5] selection:bg-[#C5A059]/30">
      <Navbar />
      <CategoryBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl group">
          <Image 
            src="https://picsum.photos/seed/salon-hero/1200/400" 
            alt="Luxury Salon Interior" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            data-ai-hint="luxury salon"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12">
            <h1 className="font-headline text-5xl md:text-6xl text-white max-w-xl mb-6 leading-tight">
              Rediscover Your <span className="text-[#C5A059]">Inner Glow</span>
            </h1>
            <p className="font-body text-xl text-white/90 max-w-lg mb-8">
              Book exclusive treatments at Dehradun's most refined luxury salons.
            </p>
            <div className="flex gap-4">
              <Button className="bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-full px-8 h-12 text-lg font-body">
                Explore Now
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10 rounded-full px-8 h-12 text-lg font-body">
                Our Services
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Salons Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl text-foreground">Featured Collections</h2>
            <Button variant="link" className="text-[#C5A059] font-body text-lg">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={`https://picsum.photos/seed/salon-${i}/600/400`} 
                    alt={`Salon ${i}`} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint="beauty spa"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />
                    <span className="text-sm font-bold font-body">4.9</span>
                  </div>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline text-2xl text-foreground group-hover:text-[#C5A059] transition-colors">Aura Luxe Spa</h3>
                    <p className="text-[#C67575] font-body font-semibold">$$$</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-body mb-4">
                    <MapPin className="h-3 w-3" />
                    <span>Rajpur Road, Dehradun</span>
                  </div>
                  <div className="flex items-center gap-4 border-t pt-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-widest font-body">
                      <Clock className="h-3 w-3" />
                      <span>Next: 2:00 PM</span>
                    </div>
                    <Button size="sm" className="ml-auto bg-[#634D36] hover:bg-[#4d3b2a] text-white rounded-lg font-body">
                      Book Slot
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 py-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="font-headline text-2xl mb-4">
            BookN<span className="text-[#C5A059]">Glow</span>
          </div>
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
            Elevating beauty standards through technology and refined luxury.
          </p>
          <div className="flex justify-center gap-8 font-body text-sm text-muted-foreground mb-8">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link>
          </div>
          <p className="text-xs text-muted-foreground/60 font-body">
            © 2024 BookNGlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return <a href={href} className={className}>{children}</a>
}