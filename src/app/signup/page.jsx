'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight, Loader2, Mail, Lock, User, Store, MapPin, Phone, Upload, Plus, X, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const DEHRADUN_LOCALITIES = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Sahastradhara',
  'Clement Town',
  'Dalanwala'
];

export default function SignupPage() {
  const { register } = useAuth();
  const [userType, setUserType] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  // Salon specific fields
  const [salonName, setSalonName] = useState('');
  const [salonType, setSalonType] = useState('');
  const [services, setServices] = useState([{ name: '', price: '', duration: '', description: '' }]);
  const [offers, setOffers] = useState([{ title: '', description: '', discount: '', validUntil: '' }]);
  const [images, setImages] = useState([]);
  
  const { toast } = useToast();
  const router = useRouter();

  const handleSendOTP = async (type) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          [type]: type === 'email' ? email : phone,
          type 
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ 
          title: "OTP Sent", 
          description: `OTP has been sent to your ${type}.` 
        });
        setShowOTP(true);
        
        if (result.otp) {
          console.log('Development OTP:', result.otp);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to send OTP.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          phone: phone,
          otp 
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ 
          title: "OTP Verified", 
          description: "Your identity has been verified successfully." 
        });
        setShowOTP(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message || "Invalid OTP.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (userType === 'customer') {
      // Handle single profile image for customers
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          // Convert to Base64 and update formData
          const base64String = reader.result;
          console.log('Profile image loaded, length:', base64String.length);
          setProfileImage(base64String);
        };
        reader.onerror = function(error) {
          console.error('Error reading file:', error);
          alert('Failed to read image file');
        };
        reader.readAsDataURL(file);
      }
    } else if (userType === 'salon') {
      // Handle multiple images for salons
      const newImages = [];
      let loadedCount = 0;
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = function() {
          // Convert to Base64 and update formData
          const base64String = reader.result;
          newImages[index] = base64String;
          loadedCount++;
          
          console.log(`Salon image ${index + 1} loaded, length:`, base64String.length);
          
          // Only update state when all files are loaded
          if (loadedCount === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.onerror = function(error) {
          console.error('Error reading file:', error);
          alert(`Failed to read image file ${index + 1}`);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageChange = handleImageUpload; // For backward compatibility

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addService = () => {
    setServices([...services, { name: '', price: '', duration: '', description: '' }]);
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const addOffer = () => {
    setOffers([...offers, { title: '', description: '', discount: '', validUntil: '' }]);
  };

  const updateOffer = (index, field, value) => {
    const updated = [...offers];
    updated[index][field] = value;
    setOffers(updated);
  };

  const removeOffer = (index) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Submit validation for image (optional)
      if (userType === 'customer' && profileImage === '') {
        console.log('Customer signing up without profile image');
        // Allow signup without image - it's optional
      }

      if (userType === 'salon' && images.length === 0) {
        console.log('Salon signing up without images - will use default');
        // Allow signup without images - will use default
      }

      const userData = {
        email,
        password,
        fullName,
        phone,
        userType,
        location,
        image: profileImage || '', // Send empty string if no image
        ...(userType === 'salon' && {
          salonName,
          salonType,
          services: services.filter(s => s.name && s.price).map(s => ({
            name: s.name,
            price: Number(s.price),
            duration: s.duration,
            description: s.description
          })),
          offers: offers.filter(o => o.title && o.discount),
          images: images.length > 0 ? images : [] // Send empty array if no images
        })
      };

      console.log("Form Data being sent:", userData);
      console.log("Image field length:", userData.image ? userData.image.length : 0);
      console.log("Image field preview:", userData.image ? userData.image.substring(0, 50) + '...' : 'NO IMAGE');

      const registeredUser = await register(userData);
      toast({ 
        title: "Account created!", 
        description: "Successfully registered on BookNGlow. Please login to continue." 
      });
      router.push('/login');
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">BookN<span className="text-accent">Glow</span></h1>
            </div>
            <p className="text-white/60">Join Dehradun's Premium Salon Booking Platform</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <Tabs value={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="salon">Salon Owner</TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleSendOTP('phone')}
                          className="shrink-0"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleSendOTP('email')}
                        className="shrink-0"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <select
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-10 rounded-md border border-white/10 bg-slate-800 px-3 text-white"
                      required
                    >
                      <option value="">Select your locality</option>
                      {DEHRADUN_LOCALITIES.map((locality) => (
                        <option key={locality} value={locality}>
                          {locality}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="bg-slate-800 border-white/10 text-white file:text-white file:bg-slate-700"
                      />
                      {profileImage && (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                          <img 
                            src={profileImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => console.log('Current profileImage state:', profileImage ? profileImage.substring(0, 100) + '...' : 'empty')}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Debug Image
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="•••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  {showOTP && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification OTP</Label>
                      <div className="flex gap-2">
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyOTP}
                          className="shrink-0"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Customer Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="salon" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner Name</Label>
                        <Input
                          id="ownerName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salonName">Salon Name</Label>
                        <Input
                          id="salonName"
                          type="text"
                          placeholder="Glow Salon & Spa"
                          value={salonName}
                          onChange={(e) => setSalonName(e.target.value)}
                          required
                          className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salonType">Salon Category *</Label>
                        <select
                          id="salonType"
                          value={salonType}
                          onChange={(e) => setSalonType(e.target.value)}
                          className="w-full h-10 rounded-md border border-white/10 bg-slate-800 px-3 text-white"
                          required
                        >
                          <option value="">Select salon category</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Unisex">Unisex</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salonPhone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Input
                            id="salonPhone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleSendOTP('phone')}
                            className="shrink-0"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salonEmail">Email</Label>
                        <div className="flex gap-2">
                          <Input
                            id="salonEmail"
                            type="email"
                            placeholder="salon@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleSendOTP('email')}
                            className="shrink-0"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salonLocation">Location</Label>
                        <select
                          id="salonLocation"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full h-10 rounded-md border border-white/10 bg-slate-800 px-3 text-white"
                          required
                        >
                          <option value="">Select salon locality</option>
                          {DEHRADUN_LOCALITIES.map((locality) => (
                            <option key={locality} value={locality}>
                              {locality}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salonPassword">Password</Label>
                        <Input
                          id="salonPassword"
                          type="password"
                          placeholder="•••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Services</h3>
                      <Button type="button" onClick={addService} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                    
                    {services.map((service, index) => (
                      <div key={index} className="grid md:grid-cols-4 gap-2 items-end">
                        <div className="space-y-2">
                          <Label>Service Name</Label>
                          <Input
                            placeholder="Haircut"
                            value={service.name}
                            onChange={(e) => updateService(index, 'name', e.target.value)}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price</Label>
                          <Input
                            placeholder="₹500"
                            value={service.price}
                            onChange={(e) => updateService(index, 'price', e.target.value)}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            placeholder="30 mins"
                            value={service.duration}
                            onChange={(e) => updateService(index, 'duration', e.target.value)}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeService(index)}
                          className="mb-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Offers */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Offers</h3>
                      <Button type="button" onClick={addOffer} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Offer
                      </Button>
                    </div>
                    
                    {offers.map((offer, index) => (
                      <div key={index} className="grid md:grid-cols-4 gap-2 items-end">
                        <div className="space-y-2">
                          <Label>Offer Title</Label>
                          <Input
                            placeholder="20% Off"
                            value={offer.title}
                            onChange={(e) => updateOffer(index, 'title', e.target.value)}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Discount (%)</Label>
                          <Input
                            placeholder="20"
                            value={offer.discount}
                            onChange={(e) => updateOffer(index, 'discount', e.target.value)}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valid Until</Label>
                          <Input
                            type="date"
                            value={offer.validUntil}
                            onChange={(e) => updateOffer(index, 'validUntil', e.target.value)}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOffer(index)}
                          className="mb-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Salon Images</h3>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-8 w-8 text-white/60 mb-2" />
                        <p className="text-white/60">Click to upload salon images</p>
                        <p className="text-white/40 text-sm">Multiple files allowed</p>
                      </label>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.path}
                              alt={image.originalName}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {showOTP && (
                    <div className="space-y-2">
                      <Label htmlFor="salon-otp">Verification OTP</Label>
                      <div className="flex gap-2">
                        <Input
                          id="salon-otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyOTP}
                          className="shrink-0"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Salon Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:text-accent/80 font-medium underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}