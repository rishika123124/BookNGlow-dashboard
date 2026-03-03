'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight, Loader2, Mail, Lock, User, Store, MapPin } from 'lucide-react';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEHRADUN_LOCALITIES = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Sahastradhara',
  'Clement Town',
  'Dalanwala'
];

const SALON_CATEGORIES = [
  'Luxury Spa',
  'Premium Barber',
  'Unisex Salon',
  'Skin & Nails Studio',
  'Bridal Boutique'
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userRole, setUserRole] = useState<'customer' | 'salon'>('customer');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!", description: "Successfully logged in to BookNGlow." });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Update display name
        await updateProfile(newUser, { 
          displayName: userRole === 'customer' ? fullName : ownerName 
        });

        // Create firestore profile
        const profileData = {
          id: newUser.uid,
          email,
          role: userRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...(userRole === 'customer' ? { fullName } : { salonName, ownerName, businessCategory, location })
        };

        await setDoc(doc(db, 'users', newUser.uid), profileData);
        
        toast({ 
          title: "Account Created!", 
          description: `Welcome to the ${userRole === 'customer' ? 'family' : 'partner network'}, ${userRole === 'customer' ? fullName : ownerName}!` 
        });
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#A78BFA] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-body relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              Elite Grooming Network
            </div>
            <h1 className="font-headline text-4xl md:text-6xl tracking-tight text-white">
              {authMode === 'login' ? 'Welcome Back' : 'Join the Glow'}
            </h1>
            <p className="text-white/40 text-lg">
              {authMode === 'login' 
                ? 'Continue your luxury grooming journey in Dehradun.' 
                : 'Experience and deliver excellence in the Doon Valley.'}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <Tabs defaultValue="customer" className="w-full" onValueChange={(val) => setUserRole(val as any)}>
              {authMode === 'signup' && (
                <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1 mb-8 border border-white/10">
                  <TabsTrigger value="customer" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Customer
                  </TabsTrigger>
                  <TabsTrigger value="salon" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Salon
                  </TabsTrigger>
                </TabsList>
              )}

              <form onSubmit={handleAuth} className="space-y-6">
                
                {authMode === 'signup' && userRole === 'customer' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="fullName" className="text-white/60">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <Input 
                        id="fullName" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma" 
                        className="bg-white/5 border-white/10 rounded-xl pl-12 h-12 text-white focus:ring-purple-500" 
                        required 
                      />
                    </div>
                  </div>
                )}

                {authMode === 'signup' && userRole === 'salon' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salonName" className="text-white/60">Salon Name</Label>
                        <div className="relative">
                          <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                          <Input 
                            id="salonName" 
                            value={salonName}
                            onChange={(e) => setSalonName(e.target.value)}
                            placeholder="e.g. Velvet Grooming" 
                            className="bg-white/5 border-white/10 rounded-xl pl-12 h-12 text-white focus:ring-purple-500" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerName" className="text-white/60">Owner Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                          <Input 
                            id="ownerName" 
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="Owner's full name" 
                            className="bg-white/5 border-white/10 rounded-xl pl-12 h-12 text-white focus:ring-purple-500" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/60">Business Category</Label>
                        <Select onValueChange={setBusinessCategory} required>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            {SALON_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60">Location (Dehradun)</Label>
                        <Select onValueChange={setLocation} required>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-purple-500">
                            <SelectValue placeholder="Select locality" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            {DEHRADUN_LOCALITIES.map(loc => (
                              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/60">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com" 
                      className="bg-white/5 border-white/10 rounded-xl pl-12 h-12 text-white focus:ring-purple-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/60">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="bg-white/5 border-white/10 rounded-xl pl-12 h-12 text-white focus:ring-purple-500" 
                      required 
                    />
                  </div>
                </div>

                <Button 
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all text-lg font-headline border-none shadow-xl shadow-purple-500/20 mt-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {authMode === 'login' ? 'Enter BookNGlow' : 'Create Elite Account'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Tabs>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-white/40 hover:text-white transition-colors text-sm"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Join the glow" 
                  : "Already a member? Sign in instead"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
