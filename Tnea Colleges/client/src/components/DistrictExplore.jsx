import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Award, ArrowRight } from 'lucide-react';
import axios from 'axios';

// Top districts to feature as tabs
const FEATURED_DISTRICTS = ['Chennai', 'Coimbatore', 'Kancheepuram', 'Tiruvallur', 'Others'];

const DistrictExplore = () => {
    const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchColleges(selectedDistrict);
    }, [selectedDistrict]);

    const fetchColleges = async (district) => {
        setLoading(true);
        try {
            // For "Others", we might fetch general top colleges, or handle differently
            // Here we just pass the district if it's not 'Others'
            const params = {};
            if (district !== 'Others') params.district = district;

            const res = await axios.get('http://localhost:5000/api/colleges', { params: { ...params, limit: 6 } });
            setColleges(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Featured Colleges by District
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Explore top institutions in Tamil Nadu's major educational hubs
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {FEATURED_DISTRICTS.map((district) => (
                        <button
                            key={district}
                            onClick={() => setSelectedDistrict(district)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedDistrict === district
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {district}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                        >
                            <AnimatePresence mode="popLayout">
                                {colleges.map((college, idx) => (
                                    <motion.div
                                        key={college._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
                                    >
                                        {/* Image Placeholder with Gradient */}
                                        <div className={`h-48 w-full bg-gradient-to-br ${idx % 3 === 0 ? 'from-blue-500 to-cyan-400' :
                                            idx % 3 === 1 ? 'from-violet-500 to-purple-400' :
                                                'from-emerald-500 to-teal-400'
                                            } relative p-6 flex flex-col justify-end`}>
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                                                Tier {college.tier}
                                            </div>
                                            <h3 className="text-white font-bold text-xl leading-tight drop-shadow-md">
                                                {college.name}
                                            </h3>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span>{college.district}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                                                    <span className="block text-xs text-slate-400 uppercase tracking-wider">Top Branch</span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">{college.branch}</span>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                                                    <span className="block text-xs text-slate-400 uppercase tracking-wider">Cutoff</span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{college.cutoff}</span>
                                                </div>
                                            </div>

                                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group-hover:translate-y-0 translate-y-2 opacity-90 group-hover:opacity-100">
                                                View Details <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DistrictExplore;
