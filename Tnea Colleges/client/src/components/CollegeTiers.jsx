import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Award, TrendingUp, BookOpen, Star, Info, ArrowRight, Sparkles } from 'lucide-react';



const tiers = [
    {
        id: 1,
        title: "National Elite",
        subtitle: "Tier 1",
        desc: "Premier global institutions with superior research, infrastructure, and 95%+ placement records.",
        icon: <Award className="w-5 h-5" />,
        color: "text-amber-500",
        bgBadge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
        stats: { cutoff: "190 - 200", placement: "95%+", avgPackage: "12-18 LPA" }
    },
    {
        id: 2,
        title: "State Leaders",
        subtitle: "Tier 2",
        desc: "Top state colleges with strong regional reputation and consistent multinational recruitments.",
        icon: <Star className="w-5 h-5" />,
        color: "text-blue-500",
        bgBadge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
        stats: { cutoff: "180 - 189", placement: "85%+", avgPackage: "6-10 LPA" }
    },
    {
        id: 3,
        title: "Established",
        subtitle: "Tier 3",
        desc: "Stable institutions with reliable academic delivery and standard placement support.",
        icon: <BookOpen className="w-5 h-5" />,
        color: "text-emerald-500",
        bgBadge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
        stats: { cutoff: "160 - 179", placement: "75%+", avgPackage: "4-6 LPA" }
    },
    {
        id: 4,
        title: "Emerging",
        subtitle: "Tier 4",
        desc: "Growing institutions focusing on accessibility and improving infrastructure.",
        icon: <TrendingUp className="w-5 h-5" />,
        color: "text-indigo-500",
        bgBadge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
        stats: { cutoff: "140 - 159", placement: "60%+", avgPackage: "3-4.5 LPA" }
    },
    {
        id: 5,
        title: "Opportunity",
        subtitle: "Tier 5",
        desc: "Essential engineering education providers focusing on local access and trades.",
        icon: <GraduationCap className="w-5 h-5" />,
        color: "text-slate-500",
        bgBadge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
        stats: { cutoff: "< 140", placement: "40%+", avgPackage: "2.5-3.5 LPA" }
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const CollegeTiers = () => {
    const navigate = useNavigate();
    return (
        <section id="tiers" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="flex items-center gap-2 text-[#1e3a8a] dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-3 justify-center md:justify-start">
                            <Sparkles className="w-4 h-4" /> AI-Driven Classification
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white font-serif mb-6">In-Depth Tier Analysis</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            We've categorized institutions into 5 distinct tiers using 10+ parameters including TNEA Cutoff trends, Placement records, and Infrastructure to help you find your best fit.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {tiers.map((tier) => (
                        <TierCard key={tier.id} tier={tier} navigate={navigate} />
                    ))}
                </motion.div>

                <div className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#1e3a8a] dark:text-blue-400 flex-shrink-0">
                        <Info className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Transparency Note</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            This tier classification is an internal proprietary metric of UniGuide Ai. It is based on aggregated public data (NIRF 2024, TNEA 2023-24 Cutoffs). It is <strong>not</strong> an official government ranking. usage of this data should be for reference only.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TierCard = ({ tier, navigate }) => (
    <motion.div
        variants={item}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 dark:hover:shadow-black/50 transition-all duration-300 w-full flex flex-col min-h-[300px]"
    >
        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex flex-col items-start gap-4 mb-4">
                <div className={`${tier.bgBadge} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2`}>
                    {tier.icon}
                    {tier.subtitle}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white font-serif text-2xl">
                    {tier.title}
                </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                {tier.desc}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100 dark:border-slate-800 mb-4">
                <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Cutoff</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{tier.stats.cutoff}</p>
                </div>
                <div className="text-center border-l border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Placement</p>
                    <p className="font-bold text-green-600 dark:text-green-400 text-sm">{tier.stats.placement}</p>
                </div>
                <div className="text-center border-l border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Avg Package</p>
                    <p className="font-bold text-[#1e3a8a] dark:text-blue-400 text-sm">{tier.stats.avgPackage}</p>
                </div>
            </div>

            <button
                onClick={() => navigate('/results', { state: { tier: tier.id, mode: 'browse' } })}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 group-hover:bg-[#1e3a8a] group-hover:text-white group-hover:border-[#1e3a8a] transition-all flex items-center justify-center gap-2"
            >
                View Colleges <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </motion.div>
);

export default CollegeTiers;
