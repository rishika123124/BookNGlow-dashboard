'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await login(formData.email, formData.password);
      toast.success('Login successful!');
      
      console.log('Login - User data:', userData);
      console.log('Login - User role:', userData?.role);
      console.log('Login - User type:', userData?.type);
      
      // Redirect based on user role
      if (userData.role === 'salon' || userData.type === 'salon') {
        console.log('Login - Redirecting to salon dashboard...');
        router.push('/dashboard/salon');
      } else {
        console.log('Login - Redirecting to customer dashboard...');
        router.push('/dashboard/customer');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="w-full bg-slate-900/40 backdrop-blur-lg border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white">Login</CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to your BookNGlow account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
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
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <div className="text-center space-y-2">
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <a href="/register/customer" className="text-purple-400 hover:text-purple-300">
                      Register as Customer
                    </a>
                  </p>
                  <p className="text-gray-400">
                    Own a salon?{' '}
                    <a href="/register/salon" className="text-purple-400 hover:text-purple-300">
                      Register Salon
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
