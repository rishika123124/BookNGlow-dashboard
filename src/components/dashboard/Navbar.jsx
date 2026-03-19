'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Search, 
  Store, 
  LayoutDashboard, 
  Scissors, 
  Heart, 
  Users, 
  HelpCircle, 
  LogOut,
  User
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AISearchDialogNew } from './AISearchDialogNew';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout successful!');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      // Still redirect to login even if logout fails
      router.push('/login');
    }
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'salon':
        return '/dashboard/salon';
      case 'user':
        return '/dashboard/customer';
      case 'customer':
        return '/dashboard/customer';
      case 'owner':
        return '/dashboard/salon';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-white/10 h-20 md:h-24 flex items-center shadow-2xl">
      <div className="container mx-auto px-4 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Mobile Menu & Logo Section */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          {/* Mobile Horizontal Dropdown Menu - Below Navbar */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 z-50 lg:hidden">
              {/* Horizontal Menu Content - Navbar Colors */}
              <div className="bg-slate-950/95 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="container mx-auto px-4">
                  <div className="py-3 space-y-1">
                    {/* Navigation Links */}
                    <a 
                      href="/" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Store className="h-4 w-4" /> Home
                    </a>
                    <a 
                      href="/salons/male" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Scissors className="h-4 w-4" /> For Men
                    </a>
                    <a 
                      href="/salons/female" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 text-pink-500" /> For Women
                    </a>
                    <a 
                      href="/salons/unisex" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="h-4 w-4 text-purple-400" /> Unisex
                    </a>
                    <a 
                      href="/support" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4 text-white/60" /> Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2 md:gap-3 group transition-all duration-300">
              <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-lg md:p-1.5 md:rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
                <Sparkles className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <span className="font-headline text-xl md:text-3xl tracking-tight text-white">
                BookN<span className="text-accent">Glow</span>
              </span>
            </a>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center justify-center flex-1 gap-8 xl:gap-12">
          <a href="/" className="text-white/80 hover:text-white transition-colors font-medium">Home</a>
          <a href="/salons/male" className="text-white/80 hover:text-white transition-colors font-medium">For Men</a>
          <a href="/salons/female" className="text-white/80 hover:text-white transition-colors font-medium">For Women</a>
          <a href="/salons/unisex" className="text-white/80 hover:text-white transition-colors font-medium">Unisex</a>
          <a href="/support" className="text-white/80 hover:text-white transition-colors font-medium">Support</a>
        </div>

        {/* Right Section - Search, Auth */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* AI Search */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAISearchOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-white/10" align="end">
                <DropdownMenuItem className="text-white/80 hover:bg-white/10 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{user.name || 'User'}</div>
                      <div className="text-xs text-white/60">{user.email}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-white/80 hover:bg-white/10 cursor-pointer">
                  <a href={getDashboardLink()} className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:flex rounded-full bg-purple-600 hover:bg-purple-700 text-white border-none px-6">
              <a href="/login">Sign In</a>
            </Button>
          )}
        </div>
      </div>
      <AISearchDialogNew open={isAISearchOpen} onOpenChange={setIsAISearchOpen} />
    </nav>
  );
}
