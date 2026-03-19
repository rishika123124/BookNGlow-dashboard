'use client';

import { useState } from 'react';
import { MessageCircle, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkingSupportForm() {
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, title, message) => {
    console.log('=== SHOWING NOTIFICATION ===');
    console.log('Type:', type);
    console.log('Title:', title);
    console.log('Message:', message);
    
    setNotification({
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Also try browser alert as backup
    if (type === 'success') {
      alert(`✅ ${title}\n\n${message}\n\nTimestamp: ${new Date().toLocaleTimeString()}`);
    } else {
      alert(`❌ ${title}\n\n${message}\n\nTimestamp: ${new Date().toLocaleTimeString()}`);
    }
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    console.log('=== WORKING SUPPORT FORM SUBMISSION ===');
    console.log('Form data:', { category, email, subject, message });

    try {
      console.log('Making API call...');
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'User',
          email: email || 'user@example.com',
          phone: '9876543210',
          subject: `[${category || 'General'}] ${subject}`,
          message: `Category: ${category || 'General'}\n\n${message}\n\nContact Details:\nEmail: ${email || 'user@example.com'}\nPhone: 9876543210`,
          category: category || 'General',
          subject,
          message,
          createdAt: new Date()
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        console.log('SUCCESS: Showing success notification');
        showNotification(
          'success',
          'Support Request Submitted!',
          `Your support request has been sent successfully. We'll get back to you soon.\n\nMessage ID: ${data.data?.id || 'N/A'}\nStatus: ${data.data?.status || 'pending'}`
        );
        
        // Reset form
        setCategory('');
        setSubject('');
        setMessage('');
        setEmail('');
        
      } else {
        console.log('ERROR: Showing error notification');
        showNotification(
          'error',
          'Submission Failed',
          data.message || 'Failed to submit support request. Please try again.'
        );
      }
    } catch (error) {
      console.error('CATCH ERROR: Showing error notification');
      console.error('Error details:', error);
      showNotification(
        'error',
        'Network Error',
        error.message || 'Failed to connect to server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Notification Display */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
            notification.type === 'success' 
              ? 'bg-green-600 border-green-700' 
              : 'bg-red-600 border-red-700'
          }`}>
            <div className="flex items-start">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-white mr-3 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-white mr-3 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold">
                  {notification.title}
                </h4>
                <p className="text-green-100 text-sm mt-1">
                  {notification.message}
                </p>
                <p className="text-green-200 text-xs mt-2">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Get Help - Working Version
            </CardTitle>
            <p className="text-gray-400">
              Fill out the form below and we'll respond as soon as possible.
            </p>
            <p className="text-yellow-400 text-sm mt-2">
              This version includes: Alert notifications, Visual notifications, Console logging
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <option value="booking">📅 Booking Issues</option>
                  <option value="technical">🔧 Technical Support</option>
                  <option value="account">👤 Account Help</option>
                  <option value="payment">💳 Payment Problems</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  required
                />
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

            {/* Debug Info */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Debug Information:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✅ Browser alert notifications enabled</li>
                <li>✅ Visual notifications enabled</li>
                <li>✅ Console logging enabled</li>
                <li>✅ Multiple notification methods</li>
                <li>✅ Form validation included</li>
                <li>✅ Error handling included</li>
              </ul>
              <p className="text-gray-400 text-xs mt-2">
                Check browser console (F12) for detailed logs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
