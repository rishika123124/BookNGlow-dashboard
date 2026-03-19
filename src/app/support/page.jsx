'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  HelpCircle,
  Mail,
  Phone,
  Loader2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SUPPORT_CATEGORIES = [
  { id: 'booking', label: 'Booking Issues', icon: '📅' },
  { id: 'technical', label: 'Technical Support', icon: '🔧' },
  { id: 'account', label: 'Account Help', icon: '👤' },
  { id: 'payment', label: 'Payment Problems', icon: '💳' },
  { id: 'salon', label: 'Salon Owner Support', icon: '💇' },
  { id: 'other', label: 'Other', icon: '📝' }
];

const FAQ_ITEMS = [
  {
    question: "How do I cancel my booking?",
    answer: "You can cancel your booking from the 'My Bookings' section. Go to your booking details and click on 'Cancel Booking'. Cancellations made 24 hours before the appointment are eligible for a full refund."
  },
  {
    question: "Payment not processed",
    answer: "If your payment is not processed, please check: 1) Your internet connection, 2) Card details and expiry date, 3) Sufficient balance. If issues persist, contact your bank or try another payment method."
  },
  {
    question: "Can't find my booking",
    answer: "Check your registered email for booking confirmation. If you can't find it, ensure you're logged in with the correct account. You can also search by booking ID or contact support with your email and booking date."
  },
  {
    question: "How to update salon information?",
    answer: "For salon owners: Login to your salon dashboard, go to 'Settings' or 'Profile', update your information and save changes. For users: You can suggest updates through the 'Report Issue' feature on the salon page."
  }
];

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Email us':
        window.location.href = 'mailto:bookNGlow@gmail.com';
        break;
      case 'Call us':
        window.location.href = 'tel:+917890654321';
        break;
      case 'Payment Support':
        setCategory('booking');
        setSubject('Payment related issue');
        setMessage('I need help with a payment issue.');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('=== SUPPORT FORM SUBMISSION START ===');
    console.log('Form data:', { category, email, subject, message });
    console.log('User info:', user);

    try {
      console.log('Making API call to /api/support...');
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user?.fullName || 'Guest User',
          email: email || user?.email || 'guest@booknglow.com',
          phone: user?.phone || '7890654321',
          subject: `[${SUPPORT_CATEGORIES.find(c => c.id === category)?.label || 'Support'}] ${subject}`,
          message: `Category: ${SUPPORT_CATEGORIES.find(c => c.id === category)?.label || 'Support'}\n\n${message}\n\nContact Details:\nEmail: ${email || user?.email || 'guest@booknglow.com'}\nPhone: ${user?.phone || '7890654321'}`,
          category,
          subject,
          message,
          email: user?.email || email,
          userId: user?.id,
          createdAt: new Date()
        }),
      });

      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      const result = await response.json();
      console.log('API Response Data:', result);

      if (result.success) {
        console.log('SUCCESS: Showing success toast and alert');
        
        // Show toast notification
        toast({
          title: "Support Request Submitted",
          description: "Your support request has been submitted successfully. Our team will contact you soon.",
        });
        
        // Also show browser alert as backup
        alert('✅ Support Request Submitted Successfully!\n\nYour support request has been submitted successfully. Our team will contact you soon.');
        
        // Reset form
        setCategory('');
        setSubject('');
        setMessage('');
        setEmail('');
      } else {
        console.log('ERROR: Showing error toast and alert');
        toast({
          title: "Error",
          description: result.message || "Failed to submit support request. Please try again.",
          variant: "destructive"
        });
        
        // Also show browser alert
        alert('❌ Submission Failed!\n\n' + (result.message || "Failed to submit support request. Please try again."));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit support request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 mx-auto">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Center</span>
            </h1>
            <p className="text-xl text-white/60">
              We're here to help you 24/7 with any questions or concerns.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Support Form */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Get Help</CardTitle>
                <CardDescription className="text-white/60">
                  Fill out the form below and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 rounded-md border border-white/10 bg-slate-800 px-3 text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {SUPPORT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email (if not logged in) */}
                  {!user && (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                  )}

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="bg-slate-800 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Support Request
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <div className="space-y-6">
              <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: <Mail className="h-5 w-5 text-purple-400" />,
                      title: "Email Support",
                      description: "bookNGlow@gmail.com",
                      action: "Email us"
                    },
                    {
                      icon: <Phone className="h-5 w-5 text-blue-400" />,
                      title: "Phone Support",
                      description: "+91 78906 54321",
                      action: "Call us"
                    },
                    {
                      icon: <HelpCircle className="h-5 w-5 text-pink-400" />,
                      title: "Payment Query",
                      description: "For payment related issues",
                      action: "Payment Support"
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                      {item.icon}
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-white/60 text-sm mb-2">{item.description}</p>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleQuickAction(item.action)}>
                          {item.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Common Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {FAQ_ITEMS.map((faq, i) => (
                    <div 
                      key={i} 
                      className="rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
                    >
                      <div 
                        className="p-4 cursor-pointer flex items-center justify-between"
                        onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                      >
                        <p className="text-white/80 text-sm font-medium">{faq.question}</p>
                        {expandedFAQ === i ? (
                          <ChevronUp className="h-4 w-4 text-white/60" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/60" />
                        )}
                      </div>
                      {expandedFAQ === i && (
                        <div className="px-4 pb-4">
                          <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
