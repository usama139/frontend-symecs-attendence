import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState('Student'); // 'Student' | 'Admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (login) {
        const user = await login(email, password);
        onClose();
        if (user?.role === 'Admin') navigate('/admin');
        else if (user?.role === 'Teacher') navigate('/teacher');
        else navigate('/');
      } else {
        // Fallback simulation if AuthContext isn't available
        setTimeout(() => {
          setLoading(false);
          onClose();
          if (role === 'Admin') navigate('/admin');
          else navigate('/student-dashboard');
        }, 1000);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-modal">
      <div 
        className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient header accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Portal Access</h3>
            <p className="text-xs text-slate-400 mt-1">
              SYMECS Institute Management & Student Portal
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-950/70 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole('Student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
                role === 'Student'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck size={16} />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('Admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all ${
                role === 'Admin'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock size={16} />
              <span>Admin / Faculty</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {role === 'Student' ? 'Student Email or Roll No.' : 'Admin Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'Student' ? 'student@symecs.edu.pk' : 'admin@symecs.edu.pk'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("For password reset assistance, please contact the HOD/Admin office at 03123795549.");
                }}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 active:scale-98 transition duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In as {role}</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              🔒 Encrypted SSL Secure Authentication • SYMECS IT Systems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
