"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Phone, CheckCircle } from "lucide-react";

// Form validation schema
const salonSchema = z.object({
  salonName: z.string().min(2, "Salon name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  offers: z.union([z.string(), z.array(z.string())]).optional(),
  openingTime: z.string().min(1, "Opening time is required"),
  closingTime: z.string().min(1, "Closing time is required"),
  contactInfo: z.string().min(5, "Contact info must be at least 5 characters"),
  gender: z.enum(["male", "female", "unisex"], {
    required_error: "Please select a gender type",
  }),
});

const SalonRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [serviceImages, setServiceImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const form = useForm({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      salonName: "",
      ownerName: "",
      email: "",
      phone: "",
      location: "",
      price: "",
      offers: "",
      openingTime: "",
      closingTime: "",
      contactInfo: "",
      gender: "",
    },
  });

  // Handle image upload preview
  const handleServiceImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setServiceImages(prev => [...prev, ...newImages]);
  };

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setGalleryImages(prev => [...prev, ...newImages]);
  };

  const removeServiceImage = (index) => {
    setServiceImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Mock OTP functions (replace with actual SMS service)
  const sendOTP = async (phoneNumber) => {
    // Simulate OTP sending
    console.log("Sending OTP to:", phoneNumber);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("123456"); // Mock OTP
      }, 1000);
    });
  };

  const verifyOTP = async () => {
    // Simulate OTP verification
    console.log("Verifying OTP:", otp);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          resolve(true);
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 1000);
    });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!otpVerified) {
      alert("Please verify your phone number first");
      return;
    }

    // Validate required fields
    const requiredFields = ['salonName', 'ownerName', 'email', 'phone', 'location', 'serviceName', 'price', 'contactInfo', 'openingTime', 'closingTime', 'gender'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        if (key === 'offers') {
          // Handle offers field - ensure it's sent as a string that can be parsed as array
          const offersValue = Array.isArray(data[key]) ? JSON.stringify(data[key]) : (data[key] || '[]');
          formData.append(key, offersValue);
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Debug: Log form data
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form Data Object:', data);
      console.log('Gender:', data.gender);
      console.log('Offers:', data.offers);
      console.log('Offers Type:', typeof data.offers);
      console.log('Required Fields Check:');
      const requiredFields = ['salonName', 'ownerName', 'email', 'phone', 'location', 'serviceName', 'price', 'contactInfo', 'openingTime', 'closingTime', 'gender'];
      requiredFields.forEach(field => {
        console.log(`${field}: ${data[field]} (${data[field] ? '✅' : '❌ Missing'})`);
      });
      console.log('FormData Contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value} (${typeof value})`);
      }
      
      // Add phone verification status
      formData.append('phoneVerified', 'true');

      // Add service images
      serviceImages.forEach((imageObj, index) => {
        formData.append('serviceImages', imageObj.file);
      });

      // Add gallery images
      galleryImages.forEach((imageObj, index) => {
        formData.append('galleryImages', imageObj.file);
      });

      // Send to backend
      const response = await fetch('/api/register-salon', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      console.log('=== REGISTRATION RESULT DEBUG ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      console.log('Data:', result.data);

      if (result.success) {
        toast.success("Salon registered successfully!");
        form.reset();
        setServiceImages([]);
        setGalleryImages([]);
        setOtpVerified(false);
        setOtpSent(false);
        setOtp("");
        // Redirect to login or dashboard
        window.location.href = "/login";
      } else {
        console.error('Error Response:', result);
        console.error('Status Code:', response.status);
        console.error('Missing Fields:', result.missingFields);
        
        if (response.status === 400) {
          if (result.missingFields && result.missingFields.length > 0) {
            alert(`Validation Error: Missing required fields: ${result.missingFields.join(', ')}`);
          } else {
            alert(`Validation Error: ${result.message}`);
          }
        } else {
          alert("Error: " + result.message);
        }
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOTP = async () => {
    const phone = form.getValues("phone");
    if (!phone) {
      alert("Please enter a phone number first");
      return;
    }
    
    try {
      await sendOTP(phone);
      setOtpSent(true);
      alert("OTP sent! Use 123456 for testing");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP();
      setOtpVerified(true);
      alert("Phone number verified successfully!");
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Salon Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salonName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="salonName">Salon Name</FormLabel>
                        <FormControl>
                          <Input 
                            id="salonName"
                            name="salonName"
                            placeholder="Enter salon name" 
                            autoComplete="name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="ownerName">Owner Name</FormLabel>
                        <FormControl>
                          <Input 
                            id="ownerName"
                            name="ownerName"
                            placeholder="Enter owner name" 
                            autoComplete="name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="gender">Gender Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email" 
                            autoComplete="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phone">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            id="phone"
                            name="phone"
                            placeholder="+1234567890" 
                            autoComplete="tel"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Phone Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Phone Verification</h3>
                
                {!otpSent ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOTP}
                    disabled={!form.getValues("phone")}
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Send OTP
                  </Button>
                ) : !otpVerified ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6}
                      className="w-full"
                    >
                      Verify OTP
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Phone number verified
                  </div>
                )}
              </div>

              {/* Business Hours */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Hours</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="openingTime">Opening Time</FormLabel>
                        <FormControl>
                          <Input 
                            id="openingTime"
                            name="openingTime"
                            type="time"
                            autoComplete="off"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="closingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="closingTime">Closing Time</FormLabel>
                        <FormControl>
                          <Input 
                            id="closingTime"
                            name="closingTime"
                            type="time"
                            autoComplete="off"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="contactInfo">Contact Information</FormLabel>
                      <FormControl>
                        <Input 
                          id="contactInfo"
                          name="contactInfo"
                          type="text"
                          placeholder="e.g., +91-9876543210 or salon@example.com" 
                          autoComplete="tel"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Service Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="serviceName">Service Name</FormLabel>
                        <FormControl>
                          <Input 
                            id="serviceName"
                            name="serviceName"
                            placeholder="e.g., Hair Cutting" 
                            autoComplete="organization"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="price">Price (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            id="price"
                            name="price"
                            placeholder="299" 
                            autoComplete="off"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="offers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="offers">Offers (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          id="offers"
                          name="offers"
                          placeholder="e.g., 20% off on first visit" 
                          autoComplete="off"
                          {...field} 
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
              </div>

              {/* Service Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Images</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleServiceImageChange}
                    className="hidden"
                    id="service-images"
                  />
                  <label htmlFor="service-images" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload service images
                      </p>
                    </div>
                  </label>
                </div>

                {serviceImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {serviceImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Service ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeServiceImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Salon Gallery Images</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImageChange}
                    className="hidden"
                    id="gallery-images"
                  />
                  <label htmlFor="gallery-images" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload gallery images
                      </p>
                    </div>
                  </label>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !otpVerified}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalonRegistrationForm;
