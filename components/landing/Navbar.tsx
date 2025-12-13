'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-zinc-200 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">CashFlow Pro</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          <Link href="/login" className="hover:text-zinc-900 transition-colors">Sign in</Link>
          <Link
            href="/register"
            className="bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-zinc-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-zinc-200 p-6 md:hidden flex flex-col gap-4 shadow-xl">
          <a href="#features" className="text-lg font-medium text-zinc-900">Features</a>
          <a href="#pricing" className="text-lg font-medium text-zinc-900">Pricing</a>
          <Link href="/login" className="text-lg font-medium text-zinc-900">Sign in</Link>
          <Link href="/register" className="bg-zinc-900 text-white px-4 py-3 rounded-xl w-full text-center">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
