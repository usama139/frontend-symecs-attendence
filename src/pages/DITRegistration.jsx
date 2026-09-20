import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdmissionForm from '../components/AdmissionForm';

const DITRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between z-10 relative">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <img src="/institute_logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-cyan-400/40" />
          <span className="font-bold text-sm text-white hidden sm:inline">SYMECS Institute</span>
        </div>
      </div>

      <div className="relative z-10">
        <AdmissionForm preselectedCourse="Diploma in Information Technology (DIT) - 1 Year" />
      </div>

      <div className="mt-12 text-center text-xs text-slate-500 z-10 relative">
        <p>&copy; {new Date().getFullYear()} SYMECS Institute of Information Technology Mirpurkhas.</p>
      </div>

    </div>
  );
};

export default DITRegistration;
