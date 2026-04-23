import React, { useRef } from 'react';
import { Button } from '../ui';
import { ArrowRight, BarChart3, Network, Target, Shield, Database, Lock, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Parallax based on scroll
  const { scrollY } = useScroll();
  const scrollY1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const scrollY2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const scrollY3 = useTransform(scrollY, [0, 1000], [0, 100]);

  // Mouse Parallax based on cursor movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  const layer2X = useTransform(smoothX, [-0.5, 0.5], [-70, 70]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [-70, 70]);
  
  const layer3X = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const layer3Y = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const xPct = e.clientX / window.innerWidth - 0.5;
    const yPct = e.clientY / window.innerHeight - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 flex flex-col items-center px-4" 
      aria-labelledby="hero-heading"
    >
      {/* Background decoration & 3D Interactive Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(182,236,244,0.6),rgba(255,255,255,0))]" aria-hidden="true"></div>
      
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" style={{ perspective: '1200px' }} aria-hidden="true">
        
        {/* Left Floating Shape - Target (Foreground, strong movement) */}
        <motion.div style={{ x: layer2X, y: layer2Y }} className="hidden md:block absolute top-[20%] left-[5%] lg:left-[8%] z-20">
          <motion.div style={{ y: scrollY2, transformStyle: 'preserve-3d' }}>
            <motion.div
              animate={{ rotateY: 360, rotateX: 360, y: [0, -25, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border border-[var(--primary-dark)]/20 bg-[var(--primary)]/10 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center justify-center text-[var(--primary-dark)]/50"
            >
              <Target size={40} style={{ transform: "translateZ(40px)" }} />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Right Floating Shape - Network (Midground) */}
        <motion.div style={{ x: layer1X, y: layer1Y }} className="hidden md:block absolute top-[5%] right-[5%] lg:right-[10%] z-10">
          <motion.div style={{ y: scrollY1, transformStyle: 'preserve-3d' }}>
            <motion.div
              animate={{ rotateY: -360, rotateX: 360, y: [0, 35, 0] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-[var(--secondary-dark)]/20 bg-[var(--secondary)]/10 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center justify-center text-[var(--secondary-dark)]/40"
            >
              <Network size={48} style={{ transform: "translateZ(30px)" }} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Small Bottom Left - Database (Background, subtle movement) */}
        <motion.div style={{ x: layer3X, y: layer3Y }} className="hidden xl:block absolute bottom-[10%] left-[15%] opacity-60">
          <motion.div style={{ y: scrollY3, transformStyle: 'preserve-3d' }}>
            <motion.div
              animate={{ rotateZ: 360, x: [0, 15, 0] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[var(--primary-dark)]/10 bg-white/40 shadow-xl flex items-center justify-center text-[var(--primary-dark)]/40 backdrop-blur-sm"
            >
              <Database size={24} style={{ transform: "translateZ(20px)" }} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Small Top Right - Shield (Background, subtle focus) */}
        <motion.div style={{ x: layer3X, y: layer3Y }} className="hidden lg:block absolute top-[10%] right-[35%] opacity-70">
          <motion.div style={{ y: scrollY1, transformStyle: 'preserve-3d' }}>
            <motion.div
              animate={{ rotateY: 180, rotateZ: -10, y: [0, -15, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[var(--success)]/20 bg-[var(--success)]/5 shadow-xl flex items-center justify-center text-[var(--success)]/50 backdrop-blur-md"
            >
              <Shield size={28} style={{ transform: "translateZ(25px)" }} />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10"
      >
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center rounded-full border border-[var(--primary-dark)]/20 bg-[var(--primary)]/20 px-3 py-1 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm text-[var(--primary-dark)] cursor-default shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[var(--success)] mr-2" aria-hidden="true"></span>
            Enterprise Fraud Intelligence
          </motion.div>
          
          <h1 id="hero-heading" className="max-w-4xl font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            Detect credit card fraud with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary-dark)] hover:opacity-80 transition-opacity">ML precision</span>
          </h1>
          
          <p className="max-w-2xl text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-[var(--muted-foreground)] mb-8 sm:mb-10 px-2 sm:px-0">
            Fast, clear, data-driven fraud analysis. Harness the power of random forests and gradient boosting to instantly flag suspicious transactions with high accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <Button size="lg" className="rounded-full px-8 h-12 w-full sm:w-auto text-base gap-2 group hover:scale-105 transition-transform shadow-md hover:shadow-lg" onClick={() => document.getElementById('predict')?.scrollIntoView({ behavior: 'smooth' })}>
              Run Prediction <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 w-full sm:w-auto text-base gap-2 hover:scale-105 transition-transform backdrop-blur-md shadow-sm" onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}>
              View Model Performance <BarChart3 size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="relative h-[300px] sm:h-[400px] w-full flex items-center justify-center" style={{ perspective: '1200px' }} aria-hidden="true">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-[300px] h-[190px] sm:w-[380px] sm:h-[240px]"
          >
            {/* Front Face of Credit Card */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1A365D] to-[#2D3748] p-5 sm:p-6 shadow-2xl flex flex-col justify-between text-white border border-white/10" style={{ backfaceVisibility: 'hidden' }}>
              <div className="flex justify-between items-start">
                <div className="w-10 h-8 sm:w-12 sm:h-9 bg-yellow-400/80 rounded border border-yellow-300 flex items-center justify-center opacity-90 overflow-hidden">
                  <div className="w-full h-full border border-yellow-500/50 flex flex-col justify-evenly">
                    <div className="w-full h-[1px] bg-yellow-600/40"></div>
                    <div className="w-full h-[1px] bg-yellow-600/40"></div>
                  </div>
                </div>
                <span className="font-mono text-sm sm:text-lg font-bold tracking-widest opacity-80 backdrop-blur-sm text-[var(--primary)]">FRAUDLENS</span>
              </div>
              
              <div style={{ transform: "translateZ(10px)" }}>
                <div className="font-mono text-xl sm:text-2xl tracking-[0.1em] sm:tracking-[0.2em] mb-3 sm:mb-4 drop-shadow-md">**** **** **** 4281</div>
                <div className="flex justify-between items-end text-[10px] sm:text-xs uppercase opacity-80">
                  <div>
                    <div className="text-[7px] sm:text-[8px] opacity-60">Card Holder</div>
                    <div className="font-semibold tracking-wider">JOHN M DOE</div>
                  </div>
                  <div>
                    <div className="text-[7px] sm:text-[8px] opacity-60">Valid Thru</div>
                    <div className="font-semibold tracking-wider">12/28</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Face of Credit Card */}
            <div className="absolute inset-0 rounded-2xl bg-[#0f172a] shadow-2xl overflow-hidden border border-white/5" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="w-full h-10 sm:h-12 bg-black/90 mt-6 sm:mt-8"></div>
              <div className="px-4 sm:px-6 mt-4 sm:mt-6">
                <div className="w-full h-8 bg-white/90 rounded-sm flex items-center justify-end px-3">
                  <span className="font-mono text-sm text-gray-800 font-bold italic">123</span>
                </div>
                <p className="text-[6px] sm:text-[7px] text-white/30 mt-3 sm:mt-4 leading-[1.4] text-justify">
                  This card is property of FraudLens.ai. If found, please return to the nearest enterprise security team. Use of this card is subject to the terms and conditions outlined in the end user license agreement. Unauthorized use is strictly prohibited.
                </p>
              </div>
            </div>
            
            {/* 3D Floating Adornments orbiting the card */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-8 animate-pulse" style={{ transform: "translateZ(60px)" }}>
              <div className="bg-[var(--destructive)] text-white px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-xl backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                <Shield size={14} /> Risk: 98%
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-8" style={{ transform: "translateZ(80px)" }}>
              <div className="bg-[var(--success)] text-white px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-xl backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                <CheckCircle2 size={14} /> Model Active
              </div>
            </div>
            
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
