import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Lock, Mail, KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [role, setRole] = useState('Student'); // 'Student' | 'Admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (login) {
                const user = await login(email, password);
                if (user?.role === 'Admin') navigate('/admin');
                else if (user?.role === 'Teacher') navigate('/teacher');
                else navigate('/');
            } else {
                setTimeout(() => {
                    setLoading(false);
                    if (role === 'Admin') navigate('/admin');
                    else navigate('/');
                }, 1000);
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Invalid credentials. Please verify your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
            
            {/* Ambient background glow orbs */}
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Navigation Bar */}
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md transition">
                    <ArrowLeft size={16} />
                    <span>Back to SYMECS Home</span>
                </Link>

                <div className="flex items-center gap-2">
                    <img src="/institute_logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-cyan-400/40" />
                    <span className="font-bold text-sm text-white hidden sm:inline">SYMECS Institute</span>
                </div>
            </div>

            {/* Main Login Card */}
            <div className="my-auto py-10 z-10 flex items-center justify-center">
                <div className="relative w-full max-w-lg bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-500/10 backdrop-blur-xl overflow-hidden p-6 sm:p-10">
                    
                    {/* Top Accent Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
                            <ShieldCheck size={36} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                            SYMECS Portal Login
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Sardar Yaseen Malik Institute of Information Technology
                        </p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('Student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                                role === 'Student'
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <UserCheck size={16} />
                            <span>Student Portal</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('Admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                                role === 'Admin'
                                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Lock size={16} />
                            <span>Admin / Faculty</span>
                        </button>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                {role === 'Student' ? 'Student Email / ID' : 'Admin Email'}
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
                                    className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
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
                                    className="w-full pl-10 pr-10 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs py-1">
                            <label className="flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20"
                                />
                                <span>Remember my session</span>
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
                            className="w-full py-3.5 px-4 font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 active:scale-98 transition duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span>Sign In as {role}</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
                        <p className="text-[11px] text-slate-500">
                            Developed by Usama Ali | HOD Computer SYMECS Institute
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-xs text-slate-500 z-10">
                <p>&copy; {new Date().getFullYear()} SYMECS Institute of Information Technology. All rights reserved.</p>
            </div>

        </div>
    );
};

export default Login;
