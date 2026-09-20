import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ArrowRight, GraduationCap, Sparkles, Clock, Zap } from 'lucide-react';

const Navbar = ({ onOpenLogin, onOpenAdmission }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    closeMobileMenu();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      
      {/* Animated Top Announcement Marquee Ticker */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-b border-cyan-500/30 text-white py-2 overflow-hidden relative z-50 shadow-md">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 text-xs font-semibold select-none cursor-pointer">
          
          {/* Loop Item Set 1 */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <Sparkles size={11} /> ADMISSIONS OPEN
            </span>
            <span className="text-white font-bold">🤖 AI (Artificial Intelligence) Course</span>
            <span className="text-slate-300">| Classes Start: <strong className="text-cyan-300">Monday, 5th Oct</strong></span>
            <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
              <Clock size={11} /> 7:00 PM to 8:00 PM
            </span>
          </div>

          <span className="text-cyan-400 font-extrabold text-sm">•</span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <Zap size={11} /> NEW BATCH
            </span>
            <span className="text-white font-bold">💻 CIT Advance Course</span>
            <span className="text-slate-300">| Admissions & Classes Open!</span>
            <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Clock size={11} /> 6:30 PM to 7:30 PM
            </span>
          </div>

          <span className="text-cyan-400 font-extrabold text-sm">•</span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-extrabold uppercase">
              📍 SYMECS INSTITUTE MIRPURKHAS
            </span>
            <span className="text-slate-200">Sindh Board SBTE Affiliated Programs — Apply Online Now!</span>
          </div>

          {/* Loop Item Set 2 (Identical Duplicate for Seamless Infinite Scrolling) */}
          <span className="text-cyan-400 font-extrabold text-sm">•</span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <Sparkles size={11} /> ADMISSIONS OPEN
            </span>
            <span className="text-white font-bold">🤖 AI (Artificial Intelligence) Course</span>
            <span className="text-slate-300">| Classes Start: <strong className="text-cyan-300">Monday, 5th Oct</strong></span>
            <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
              <Clock size={11} /> 7:00 PM to 8:00 PM
            </span>
          </div>

          <span className="text-cyan-400 font-extrabold text-sm">•</span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <Zap size={11} /> NEW BATCH
            </span>
            <span className="text-white font-bold">💻 CIT Advance Course</span>
            <span className="text-slate-300">| Admissions & Classes Open!</span>
            <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Clock size={11} /> 6:30 PM to 7:30 PM
            </span>
          </div>

          <span className="text-cyan-400 font-extrabold text-sm">•</span>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-extrabold uppercase">
              📍 SYMECS INSTITUTE MIRPURKHAS
            </span>
            <span className="text-slate-200">Sindh Board SBTE Affiliated Programs — Apply Online Now!</span>
          </div>

        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-2.5' 
          : 'bg-slate-950/40 backdrop-blur-md border-b border-white/5 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img 
                src="/institute_logo.jpg" 
                alt="SYMECS Institute" 
                className="relative w-11 h-11 rounded-full object-cover border-2 border-slate-900"
              />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent block">
                SYMECS <span className="text-cyan-400">Institute</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block -mt-1">
                Mirpurkhas, Sindh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <a 
              href="#home" 
              onClick={(e) => scrollToSection(e, 'home')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-full transition-all duration-200"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={(e) => scrollToSection(e, 'about')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-full transition-all duration-200"
            >
              About Us
            </a>
            <a 
              href="#courses" 
              onClick={(e) => scrollToSection(e, 'courses')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-full transition-all duration-200"
            >
              Courses
            </a>
            <a 
              href="#gallery" 
              onClick={(e) => scrollToSection(e, 'gallery')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-full transition-all duration-200"
            >
              Gallery
            </a>
            <a 
              href="#admission" 
              onClick={(e) => scrollToSection(e, 'admission')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-full transition-all duration-200"
            >
              Admissions
            </a>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-full transition-all duration-200"
            >
              Contact Us
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 rounded-xl transition-all duration-200 shadow-md hover:shadow-cyan-500/10"
            >
              <User size={16} className="text-cyan-400" />
              <span>Student/Admin Login</span>
            </button>

            <a
              href="#admission"
              onClick={(e) => {
                if (onOpenAdmission) onOpenAdmission();
                scrollToSection(e, 'admission');
              }}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl group bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 group-hover:from-blue-600 group-hover:to-cyan-400 hover:text-white text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-slate-950/20 group-hover:bg-opacity-0 rounded-[10px] flex items-center gap-2">
                <GraduationCap size={18} />
                <span>Apply Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`lg:hidden fixed inset-x-0 top-[92px] sm:top-[96px] bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/90 shadow-2xl transition-all duration-300 overflow-y-auto ${
          isMobileMenuOpen ? 'max-h-[85vh] opacity-100 py-6 px-6' : 'max-h-0 opacity-0 py-0 px-6'
        }`}
      >
        <div className="flex flex-col space-y-3">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/80 rounded-xl transition-all"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/80 rounded-xl transition-all"
          >
            About Us
          </a>
          <a
            href="#courses"
            onClick={(e) => scrollToSection(e, 'courses')}
            className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/80 rounded-xl transition-all"
          >
            Courses
          </a>
          <a
            href="#gallery"
            onClick={(e) => scrollToSection(e, 'gallery')}
            className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/80 rounded-xl transition-all"
          >
            Gallery
          </a>
          <a
            href="#admission"
            onClick={(e) => scrollToSection(e, 'admission')}
            className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/80 rounded-xl transition-all"
          >
            Admissions
          </a>
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, 'contact')}
            className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900/80 rounded-xl transition-all"
          >
            Contact Us
          </a>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
            <button
              onClick={() => {
                closeMobileMenu();
                onOpenLogin();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 rounded-xl hover:bg-slate-800 transition"
            >
              <User size={18} className="text-cyan-400" />
              <span>Student / Admin Login</span>
            </button>

            <a
              href="#admission"
              onClick={(e) => {
                closeMobileMenu();
                if (onOpenAdmission) onOpenAdmission();
                scrollToSection(e, 'admission');
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              <GraduationCap size={20} />
              <span>Apply for Admission</span>
            </a>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
