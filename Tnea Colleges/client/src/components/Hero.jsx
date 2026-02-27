import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ChevronRight } from 'lucide-react';

const Hero = () => {
    const scrollToPredictor = () => {
        const element = document.getElementById('predictor');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative overflow-hidden bg-slate-900">
            {/* Background Image with Overlay - University Campus Style */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="University Campus"
                    className="w-full h-full object-cover"
                />
                {/* Academic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 to-[#1e3a8a]/40 dark:from-slate-950/95 dark:to-slate-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[600px] py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >


                    <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700/50 rounded-full px-4 py-1.5 mb-6 shadow-md">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        </span>
                        <span className="text-slate-200 text-sm font-medium tracking-wide">Admissions Open 2025-26</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] font-serif tracking-tight">
                        Find the Right <br />
                        <span className="text-blue-100">Engineering College</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed font-light">
                        UniGuide Ai provides data-backed analysis using TNEA cutoff trends to help you discover your ideal academic destination. Trust the numbers, not just the names.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={scrollToPredictor}
                            className="bg-[#c0a062] hover:bg-[#b08d55] text-white font-bold px-8 py-4 rounded-md shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center text-lg"
                        >
                            Predict Your College
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>

                        <button
                            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-8 py-4 rounded-md shadow-lg transition-all flex items-center justify-center text-lg"
                        >
                            Browse All Institutions
                        </button>
                    </div>

                    {/* Stats / Trust Indicators */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <p className="text-3xl font-bold text-white font-serif">450+</p>
                            <p className="text-slate-300 text-sm">Colleges Indexed</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white font-serif">98%</p>
                            <p className="text-slate-300 text-sm">Prediction Accuracy</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white font-serif">200k+</p>
                            <p className="text-slate-300 text-sm">Data Points</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
