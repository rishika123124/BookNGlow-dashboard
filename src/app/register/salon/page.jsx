'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Upload, Plus, Trash2 } from 'lucide-react';

export default function SalonRegistration() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [salonImage, setSalonImage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    salonName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    openingTime: '',
    closingTime: '',
    contactInfo: '',
    gender: '',
    services: [{ name: '', price: '', duration: '', description: '' }],
    offers: [] // Optional offers field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSalonImage(reader.result);
        setFormData(prev => ({ ...prev, salonImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', price: '', duration: '', description: '' }]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addOffer = () => {
    setFormData(prev => ({
      ...prev,
      offers: [...prev.offers, { title: '', description: '', discount: '', validUntil: '' }]
    }));
  };

  const removeOffer = (index) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index)
    }));
  };

  const updateOffer = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.map((offer, i) => 
        i === index ? { ...offer, [field]: value } : offer
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.gender) {
        throw new Error('Please select a gender category');
      }

      const response = await fetch('/api/auth/salon/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Salon registered successfully!');
        router.push('/login');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full bg-slate-900/40 backdrop-blur-lg border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white">Register Your Salon</CardTitle>
              <CardDescription className="text-gray-400">
                Join BookNGlow and reach more customers in Dehradun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salonName" className="text-white">Salon Name</Label>
                    <Input
                      id="salonName"
                      name="salonName"
                      type="text"
                      placeholder="Your Salon Name"
                      value={formData.salonName}
                      onChange={handleInputChange}
                      required
                      autoComplete="organization"
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="salon@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Rajpur Road, Dehradun"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white">Gender Type</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger className="bg-blue-50 border-blue-200 text-gray-900 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select gender type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openingTime" className="text-white">Opening Time</Label>
                    <div className="flex gap-2">
                      <Input
                        id="openingTime"
                        name="openingTime"
                        type="time"
                        placeholder="09:00"
                        value={formData.openingTime}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-800 border-white/10 text-white"
                      />
                      <select
                        name="openingTimePeriod"
                        value={formData.openingTimePeriod || 'AM'}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-white/10 text-white px-3 py-2 rounded"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closingTime" className="text-white">Closing Time</Label>
                    <div className="flex gap-2">
                      <Input
                        id="closingTime"
                        name="closingTime"
                        type="time"
                        placeholder="21:00"
                        value={formData.closingTime}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-800 border-white/10 text-white"
                      />
                      <select
                        name="closingTimePeriod"
                        value={formData.closingTimePeriod || 'PM'}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-white/10 text-white px-3 py-2 rounded"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo" className="text-white">Contact Information</Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      type="text"
                      placeholder="+91-9876543210 or salon@example.com"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      required
                      autoComplete="tel"
                      className="bg-slate-800 border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Salon Image */}
                <div className="space-y-2">
                  <Label htmlFor="salonImage" className="text-white">Salon Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="salonImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-800 border-white/10 text-white file:text-white"
                    />
                    {salonImage && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img src={salonImage} alt="Salon preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-lg">Services</Label>
                    <Button type="button" onClick={addService} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                  {formData.services.map((service, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-lg">
                      <Input
                        placeholder="Service name"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        className="bg-slate-700 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(index, 'price', e.target.value)}
                        className="bg-slate-700 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Duration"
                        value={service.duration}
                        onChange={(e) => updateService(index, 'duration', e.target.value)}
                        className="bg-slate-700 border-white/10 text-white"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Description"
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          className="bg-slate-700 border-white/10 text-white"
                        />
                        <Button
                          type="button"
                          onClick={() => removeService(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Offers (Optional) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-lg">Offers (Optional)</Label>
                    <Button type="button" onClick={addOffer} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Offer
                    </Button>
                  </div>
                  {formData.offers.map((offer, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-lg">
                      <Input
                        placeholder="Offer title"
                        value={offer.title}
                        onChange={(e) => updateOffer(index, 'title', e.target.value)}
                        className="bg-slate-700 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Discount %"
                        type="number"
                        value={offer.discount}
                        onChange={(e) => updateOffer(index, 'discount', e.target.value)}
                        className="bg-slate-700 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Valid until"
                        type="date"
                        value={offer.validUntil}
                        onChange={(e) => updateOffer(index, 'validUntil', e.target.value)}
                        className="bg-slate-700 border-white/10 text-white"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Description"
                          value={offer.description}
                          onChange={(e) => updateOffer(index, 'description', e.target.value)}
                          className="bg-slate-700 border-white/10 text-white"
                        />
                        <Button
                          type="button"
                          onClick={() => removeOffer(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register Salon'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
