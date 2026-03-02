'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Store, 
  Sparkles, 
  Loader2, 
  ChevronRight, 
  MapPin, 
  Tag, 
  IndianRupee 
} from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const signupSchema = z.object({
  role: z.enum(['customer', 'salon']),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // Customer fields
  fullName: z.string().optional(),
  // Salon fields
  salonName: z.string().optional(),
  location: z.string().optional(),
  tier: z.string().optional(),
  avgPrice: z.string().optional(),
}).refine((data) => {
  if (data.role === 'customer') return !!data.fullName;
  if (data.role === 'salon') return !!data.salonName && !!data.location && !!data.tier && !!data.avgPrice;
  return true;
}, {
  message: "Please fill in all required fields",
  path: ["fullName"], // Default path
});

type SignupFormValues = z.infer<typeof signupSchema>;

const DEHRADUN_AREAS = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Premnagar',
  'ISBT',
  'Pacific Mall Area'
];

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'customer',
      email: '',
      password: '',
      fullName: '',
      salonName: '',
      location: '',
      tier: 'Average',
      avgPrice: '',
    },
  });

  const selectedRole = form.watch('role');

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Create Firestore User Document
      const userDocRef = doc(db, 'users', user.uid);
      const userData = {
        id: user.uid,
        email: values.email,
        role: values.role,
        fullName: values.role === 'customer' ? values.fullName : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userDocRef, userData).catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: userData,
        }));
        throw e;
      });

      // 3. If Salon, Create Salon Document
      if (values.role === 'salon') {
        const salonDocRef = doc(db, 'salons', user.uid); // Using UID as salonId for 1:1 mapping
        const salonData = {
          id: user.uid,
          ownerId: user.uid,
          name: values.salonName,
          localityId: values.location, // In a real app, this would be an ID from the localities collection
          contactEmail: values.email,
          categoryTier: values.tier,
          averagePriceRange: Number(values.avgPrice),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(salonDocRef, salonData).catch((e) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: salonDocRef.path,
            operation: 'create',
            requestResourceData: salonData,
          }));
          throw e;
        });
      }

      toast({
        title: "Success!",
        description: "Your account has been created.",
      });

      // 4. Redirect based on role
      if (values.role === 'customer') {
        router.push('/salons/male'); // Redirecting to discovery
      } else {
        router.push('/admin-dashboard'); // Redirecting to salon dashboard
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-body flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-xl space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="font-headline text-4xl md:text-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">
              Join BookNGlow
            </h1>
            <p className="text-white/40 text-sm md:text-lg">
              Experience the pinnacle of Doon's elite grooming.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Toggle */}
              <div className="flex justify-center">
                <Tabs 
                  value={selectedRole} 
                  onValueChange={(val) => form.setValue('role', val as 'customer' | 'salon')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 h-14 bg-white/5 border border-white/10 p-1 rounded-2xl">
                    <TabsTrigger 
                      value="customer" 
                      className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all text-sm font-headline"
                    >
                      <User className="h-4 w-4 mr-2" /> Customer
                    </TabsTrigger>
                    <TabsTrigger 
                      value="salon" 
                      className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all text-sm font-headline"
                    >
                      <Store className="h-4 w-4 mr-2" /> Salon Partner
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                
                {/* Email & Password (Always Visible) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-purple-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-purple-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Role-Specific Fields */}
                {selectedRole === 'customer' ? (
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Jane Doe" 
                            className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-purple-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <FormField
                      control={form.control}
                      name="salonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Salon Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Luxe Studio" 
                              className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-amber-500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white/50">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-400" />
                                    <SelectValue placeholder="Select Area" />
                                  </div>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                {DEHRADUN_AREAS.map(area => (
                                  <SelectItem key={area} value={area}>{area}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Salon Tier</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white/50">
                                  <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-amber-400" />
                                    <SelectValue placeholder="Select Tier" />
                                  </div>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                                <SelectItem value="Elite">Elite</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="avgPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-xs uppercase tracking-widest font-bold">Avg. Price for 2 (₹)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                              <Input 
                                type="number" 
                                placeholder="800" 
                                className="bg-white/5 border-white/10 rounded-xl h-12 pl-10 focus:ring-amber-500" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full h-14 rounded-full text-lg font-headline transition-all duration-300 border-none shadow-xl ${
                    selectedRole === 'customer' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] shadow-purple-500/20' 
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:scale-[1.02] shadow-amber-500/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up as {selectedRole === 'customer' ? 'Customer' : 'Salon Partner'}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-center text-sm text-white/40 font-body">
            By signing up, you agree to our <span className="text-purple-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-purple-400 hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
