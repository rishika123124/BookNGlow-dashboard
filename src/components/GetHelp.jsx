'use client';

import { useState } from 'react';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

const SUPPORT_CATEGORIES = [
  { id: 'booking', label: 'Booking Issues', icon: '📅' },
  { id: 'technical', label: 'Technical Support', icon: '🔧' },
  { id: 'account', label: 'Account Help', icon: '👤' },
  { id: 'salon', label: 'Salon Owner Support', icon: '💇' },
  { id: 'payment', label: 'Payment Problems', icon: '💳' },
  { id: 'other', label: 'Other', icon: '📝' }
];

export default function GetHelp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user?.fullName || 'Guest User',
          email: user?.email || 'guest@booknglow.com',
          phone: user?.phone || '',
          subject: `[${SUPPORT_CATEGORIES.find(c => c.id === category)?.label || 'Support'}] ${subject}`,
          message: `Category: ${SUPPORT_CATEGORIES.find(c => c.id === category)?.label || 'Support'}\n\n${message}\n\nContact Details:\nEmail: ${user?.email || 'guest@booknglow.com'}\nPhone: ${user?.phone || 'Not provided'}`,
          category,
          subject,
          message,
          userId: user?.id,
          createdAt: new Date()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Support Request Submitted",
          description: "Your support request has been submitted successfully. We'll get back to you within 24 hours.",
        });
        
        // Clear form
        setCategory('');
        setSubject('');
        setMessage('');
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit support request. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit support request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-green-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 mr-2" />
              Support Request Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">
              Thank you for contacting us! Your support request has been submitted successfully.
            </p>
            <p className="text-gray-400 text-sm">
              We'll get back to you within 24 hours. You can track your request status in your profile.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            Get Help
          </CardTitle>
          <p className="text-gray-400">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info Display */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{user?.fullName || 'Guest User'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{user?.email || 'guest@booknglow.com'}</span>
                </div>
                {user?.phone && (
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white ml-2">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 min-h-[120px]"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Support Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
