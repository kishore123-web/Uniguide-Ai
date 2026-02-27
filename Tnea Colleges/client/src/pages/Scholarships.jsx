import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
    Loader2, GraduationCap, Banknote, FileText, Search,
    Filter, Info, CheckCircle2, ArrowUpRight, Building2,
    Sparkles, ShieldCheck, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                // Use 127.0.0.1 for stability
                const response = await axios.get('http://127.0.0.1:5000/api/scholarships');
                setScholarships(response.data);
                setFilteredScholarships(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching scholarships:", err);
                setError("Failed to load official scholarship data. Please check your connection.");
                setLoading(false);
            }
        };

        fetchScholarships();
    }, []);

    useEffect(() => {
        let results = scholarships;

        if (activeCategory !== 'All') {
            results = results.filter(s => s.category?.includes(activeCategory));
        }

        if (searchTerm) {
            results = results.filter(s =>
                s.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.eligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.benefits.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredScholarships(results);
    }, [searchTerm, activeCategory, scholarships]);

    const categories = ['All', 'Tamil Nadu Government', 'AICTE', 'Central Government', 'Special Schemes'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-[#1e3a8a] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 text-xs font-bold tracking-widest uppercase mb-4 border border-blue-400/30">
                            <ShieldCheck className="w-3 h-3" /> Official Educational Portals
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-6 leading-tight">
                            Financial Assistance <br /> & <span className="text-blue-300">Merit Scholarships</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive directory of state and central scholarships designed to ensure
                            no deserving student is left behind due to financial constraints.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-200 dark:border-slate-800 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by scheme name, eligibility, or benefits..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all border ${activeCategory === cat
                                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-lg shadow-blue-500/20'
                                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="text-slate-500 font-medium font-serif">Cataloging Official Schemes...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-red-200 dark:border-red-900/30">
                        <HelpCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                        <p className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-blue-600 font-bold hover:underline">Retry Connection</button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-blue-500" />
                                Available Programs
                                <span className="text-sm font-normal text-slate-400 ml-2">({filteredScholarships.length} Results)</span>
                            </h2>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode='popLayout'>
                                {filteredScholarships.map((scheme, index) => (
                                    <SchemeCard key={scheme._id || index} scheme={scheme} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredScholarships.length === 0 && (
                            <div className="text-center py-32">
                                <Search className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching schemes found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-400 text-sm mb-4 italic">
                        Note: Users are advised to check official portal websites for the most up-to-date deadlines and eligibility rules.
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">© 2025 UniGuide Ai. Financial Transparency Engine.</p>
                </div>
            </footer>
        </div>
    );
};

const SchemeCard = ({ scheme }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col h-full"
        >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-[#1e3a8a] transition-colors"></div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-100 dark:border-blue-800">
                        {scheme.category || 'Scholarship'}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors">
                    {scheme.schemeName}
                </h3>

                <div className="space-y-5 flex-grow">
                    {/* Key Metric: Benefit */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-1">
                            <Banknote className="w-4 h-4 text-emerald-500" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Benefit Amount</p>
                        </div>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                            {scheme.amount}
                        </p>
                    </div>

                    {/* Eligibility */}
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 shrink-0">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Eligibility</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-2" title={scheme.eligibility}>
                                {scheme.eligibility}
                            </p>
                        </div>
                    </div>

                    {/* Benefits Detail */}
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Benefits Detail</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-2" title={scheme.benefits}>
                                {scheme.benefits}
                            </p>
                        </div>
                    </div>

                    {/* Extra Info Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Income Limit
                            </p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {scheme.incomeLimit || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> Applicability
                            </p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {scheme.applicableTo || 'B.E / B.Tech'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">App Mode</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{scheme.applicationMode}</span>
                    </div>
                    <button className="flex items-center gap-1 text-sm font-bold text-[#1e3a8a] dark:text-blue-400 hover:underline">
                        Details <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Scholarships;
