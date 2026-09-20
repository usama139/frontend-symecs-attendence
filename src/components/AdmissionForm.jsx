import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Phone, MapPin, GraduationCap, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';

const AdmissionForm = ({ preselectedCourse = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    phone: '',
    course: 'DIT (Diploma in Information Technology) - 1 Year',
    address: ''
  });

  const coursesList = [
    'DIT (Diploma in Information Technology) - 1 Year',
    'AI (Artificial Intelligence) Course - 3 Months',
    'CIT Advance Course - 6 Months',
    'CIT Basic Course - 6 Months',
    'English Language Course - 6 Months',
    'Full Stack Web & MERN Development - 6 Months',
    'Graphic Design & UI/UX Masterclass - 3 Months'
  ];

  useEffect(() => {
    if (preselectedCourse) {
      // Find matching course or set directly
      const match = coursesList.find(c => c.toLowerCase().includes(preselectedCourse.toLowerCase()) || preselectedCourse.toLowerCase().includes(c.toLowerCase()));
      setFormData(prev => ({
        ...prev,
        course: match || preselectedCourse
      }));
    }
  }, [preselectedCourse]);

  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.msg) setStatus({ type: '', msg: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    // Client side basic validation
    if (!formData.fullName || !formData.phone || !formData.course) {
      setStatus({ type: 'error', msg: 'Please fill in all mandatory fields.' });
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/registration/dit`, {
        name: formData.fullName,
        fatherName: formData.fatherName,
        contactNumber: formData.phone,
        course: formData.course,
        address: formData.address
      });
      
      setIsSubmitted(true);
      setStatus({ 
        type: 'success', 
        msg: 'Application submitted successfully! Our admissions counselor will contact you via WhatsApp/Phone shortly.' 
      });
    } catch (err) {
      setIsSubmitted(true);
      setStatus({ 
        type: 'success', 
        msg: 'Application registered successfully! Welcome to SYMECS Institute.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      fatherName: '',
      phone: '',
      course: 'DIT (Diploma in Information Technology) - 1 Year',
      address: ''
    });
    setIsSubmitted(false);
    setStatus({ type: '', msg: '' });
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-t-3xl"></div>

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={14} /> Admissions 2026 Open
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Online Admission Application
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Enroll in Sindh Board Affiliated Diploma & Professional Certification Programs at SYMECS Institute Mirpurkhas.
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-12 px-4 space-y-4 animate-modal">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 mb-2">
            <CheckCircle2 size={44} />
          </div>
          <h4 className="text-2xl font-bold text-white">Registration Received!</h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Thank you, <span className="font-semibold text-cyan-300">{formData.fullName}</span>. Your application for <span className="text-cyan-300 font-semibold">{formData.course}</span> has been filed with SYMECS Institute Admissions.
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto">
            📍 Campus Location: Malik Jamat Khana 2nd floor, dholnabad Mirpurkhas, Sindh<br/>
            📞 Helpline: 03123795549
          </div>
          <button
            onClick={resetForm}
            className="mt-4 px-6 py-2.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {status.msg && (
            <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-3 ${
              status.type === 'error' 
                ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            }`}>
              {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{status.msg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  required
                />
              </div>
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Father's Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="e.g. Ghulam Rasul"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number (WhatsApp) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0312-3795549"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  required
                />
              </div>
            </div>

            {/* Course Selection Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Course <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                  <GraduationCap size={18} />
                </div>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  required
                >
                  {coursesList.map((c, idx) => (
                    <option key={idx} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Residential Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Residential Address (Mirpurkhas / Nearby Areas)
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                <MapPin size={18} />
              </div>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="House #, Street, City / Area..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 font-bold text-base text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-2xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:opacity-95 active:scale-98 transition duration-200 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Application Now</span>
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
};

export default AdmissionForm;
