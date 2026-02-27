import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo_icon.png';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log('User signed in with Google:', user);
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            alert(`Failed to sign in: ${error.message}`);
        }
    };

    const handleEmailSignIn = (e) => {
        e.preventDefault();
        console.log("Email sign in currently disabled - demonstration visual only"); // Logic placement
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-slate-950 font-sans">
            {/* Left Column - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
                <div className="mb-8">
                    <Link to="/" className="flex items-center space-x-3 group w-fit mb-12">
                        <img src={logo} alt="UniGuide AI Logo" className="h-10 w-10 object-contain" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                            UniGuide Ai
                        </span>
                    </Link>

                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-serif">Welcome to UniGuide AI</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Your personalized engineering admission guide. Please enter your details to continue.
                    </p>
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email or Application ID</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all"
                                placeholder="student@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all font-mono tracking-wide"
                                placeholder={showPassword ? "password" : "••••••••"}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-sm font-bold text-[#1e3a8a] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-base"
                    >
                        Login
                    </button>

                    <div className="relative flex items-center justify-center py-2">
                        <div className="border-t border-slate-200 dark:border-slate-800 w-full absolute"></div>
                        <span className="bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Or continue with</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center group"
                    >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don't have an account? <Link to="/register" className="text-[#1e3a8a] font-bold hover:underline">Sign up</Link>
                    </p>
                </form>

                <div className="mt-12 text-center text-xs text-slate-400 font-medium">
                    &copy; 2025 UniGuide AI. All rights reserved.
                </div>
            </div>

            {/* Right Column - Illustration & Promo */}
            <div className="hidden lg:flex w-1/2 bg-[#e8f3ff] dark:bg-slate-900 relative items-center justify-center overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 max-w-lg px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-12 relative mx-auto"
                        style={{ perspective: '1000px' }}
                    >
                        {/* 3D Card Container */}
                        <motion.div
                            className="w-[380px] h-[380px] mx-auto bg-gradient-to-br from-[#00d2ff] to-[#3a7bd5] rounded-[2.5rem] shadow-[0_20px_50px_rgba(58,123,213,0.3)] relative flex items-center justify-center transform preserve-3d"
                            animate={{ rotateY: [0, 5, 0, -5, 0], rotateX: [0, 2, 0, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                        >
                            {/* Inner Rings */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <div className="w-64 h-64 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <div className="w-80 h-80 border-2 border-white rounded-full"></div>
                            </div>

                            {/* Center Icon */}
                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-inner border border-white/20">
                                <BarChart3 className="w-16 h-16 text-white stroke-[1.5]" />
                            </div>

                            {/* Floating Stats - Top Right */}
                            <motion.div
                                className="absolute -top-6 -right-12 bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-2xl shadow-xl flex items-center gap-3"
                                animate={{ y: [-10, 0, -10] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Confidence</p>
                                    <p className="text-sm font-bold text-white">92% Match</p>
                                </div>
                            </motion.div>

                            {/* Floating Stats - Bottom Left */}
                            <motion.div
                                className="absolute -bottom-6 -left-8 bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3"
                                animate={{ y: [10, 0, 10] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="bg-[#00d2ff] p-1.5 rounded-lg">
                                    <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Analysis</p>
                                    <p className="text-sm font-bold text-white">Live Trends</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-serif">
                        Navigating your future with <span className="text-[#1e3a8a]">AI</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                        Join thousands of engineering aspirants using our smart algorithms to find their perfect campus match.
                    </p>

                    <div className="flex justify-center mt-8 space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a] transition-all"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-[#1e3a8a] cursor-pointer transition-all"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-[#1e3a8a] cursor-pointer transition-all"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
