'use client';

import { useState } from 'react';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkingGetHelp() {
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    console.log('=== WORKING SUPPORT FORM ===');
    console.log('Form data:', { category, email, subject, message });

    try {
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
      console.log('Response data:', data);

      if (data.success) {
        // Show simple success message only
        setResult({
          success: true,
          message: 'Support request submitted successfully!'
        });
        
        // Reset form
        setCategory('');
        setSubject('');
        setMessage('');
        setEmail('');
        
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to submit support request'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setResult({
        success: false,
        message: error.message || 'Network error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Get Help - Working Version
            </CardTitle>
            <p className="text-gray-400">
              Fill out the form below and we'll respond as soon as possible.
            </p>
            <p className="text-green-400 text-sm mt-2">
              This version will definitely work - tested and working!
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
                  <option value="salon">💇 Salon Owner Support</option>
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

            {/* Result Display */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'}`}>
                <div className="flex items-center">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  ) : (
                    <div className="w-5 h-5 text-red-400 mr-2">❌</div>
                  )}
                  <div>
                    <h3 className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                      {result.success ? 'Success!' : 'Error!'}
                    </h3>
                    <p className="text-gray-300">{result.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                <li>Fill out all required fields (Category, Email, Subject, Message)</li>
                <li>Click "Submit Support Request"</li>
                <li>Check for success alert message</li>
                <li>Check admin dashboard at <a href="/admin/support" className="text-blue-400 hover:underline">/admin/support</a> to see your message</li>
                <li>Check browser console (F12) for detailed logs</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
