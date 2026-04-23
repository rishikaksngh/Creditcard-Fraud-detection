import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import * as motion from 'motion/react-client';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed z-50 w-full top-0 left-0 right-0 pointer-events-none transition-all duration-300 pt-4 px-4" aria-label="Main Navigation">
      <nav className={cn(
        "pointer-events-auto mx-auto backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[var(--border)] transition-all duration-500 relative flex flex-col justify-center",
        isScrolled 
          ? "max-w-4xl rounded-[2rem] px-6 py-3 mt-2 bg-white/80" 
          : "max-w-7xl rounded-2xl px-6 sm:px-8 py-4 mt-0 bg-white/60"
      )}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] shadow-sm" aria-hidden="true">
              <ShieldCheck size={20} className="text-[var(--primary-dark)]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">FraudLens<span className="text-[var(--muted-foreground)] opacity-60">.ai</span></span>
          </div>
          <div className={cn(
            "hidden md:flex items-center transition-all duration-300",
            isScrolled ? "gap-4" : "gap-8"
          )} aria-label="Desktop Menu">
            <a href="#overview" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm p-1">Overview</a>
            <a href="#predict" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm p-1">Predict</a>
            <a href="#models" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm p-1">Models</a>
            <a href="#insights" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm p-1">Insights</a>
            <a href="#about" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm p-1">About</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--success)] whitespace-nowrap" aria-label="System status: Active">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
              </span>
              <span>System Active</span>
            </div>
            <button 
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col gap-4 border-t border-[var(--border)] overflow-hidden mt-4 pt-4"
          >
            <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm">Overview</a>
            <a href="#predict" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm">Predict</a>
            <a href="#models" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm">Models</a>
            <a href="#insights" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm">Insights</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm">About</a>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--success)] mt-2 px-2 pb-2" aria-label="System status: Active">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
              </span>
              <span>System Active</span>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
