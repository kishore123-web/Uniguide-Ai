import React from 'react';
import { BookOpen, Award, Users, MapPin, Search, BarChart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Award className="w-6 h-6" />,
        title: "Graduation & Outcomes",
        description: "Analyze placement records and graduation rates to ensure a secure career path.",
        className: "md:col-span-1",
        color: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "University Life",
        description: "Explore campus culture, student diversity, and extracurricular opportunities.",
        className: "md:col-span-1",
        color: "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400"
    },
    {
        icon: <BarChart className="w-6 h-6" />,
        title: "Rankings & Stats",
        description: "Comprehensive NIRF rankings and accreditation data for informed choices.",
        className: "md:col-span-1",
        color: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400"
    },
    {
        icon: <Search className="w-6 h-6" />,
        title: "Advanced Search",
        description: "Filter colleges by cutoff, location, and branch specific to your needs.",
        className: "md:col-span-2", // Spans 2 columns
        color: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400"
    },
    {
        icon: <MapPin className="w-6 h-6" />,
        title: "Location Finder",
        description: "Find institutions in your preferred districts with detailed regional insights.",
        className: "md:col-span-1",
        color: "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400"
    },
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Program Directory",
        description: "Detailed catalog of engineering courses and seat availability across Tamil Nadu.",
        className: "md:col-span-3", // Full width
        color: "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Features = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"></div>
                <div className="absolute -right-20 top-40 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 bottom-40 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-[#1e3a8a] dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-2 block">Why Choose UniGuide</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-serif mb-6">Academic Services</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Comprehensive tools and insights designed to guide you through your engineering admission journey with confidence.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className={`group relative p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${feature.className} overflow-hidden`}
                        >
                            {/* Hover Gradient Effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${feature.color.split(' ')[0].replace('/10', '')}`} />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-serif">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center text-[#1e3a8a] dark:text-blue-400 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <span>Explore</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
