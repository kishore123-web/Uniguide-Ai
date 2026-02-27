import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Check, Globe, MonitorPlay, Users, GraduationCap } from 'lucide-react';
import studentImg from '../assets/about_students_main.png';
import campusImg from '../assets/about_campus.png';

const AboutSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
            {/* Decorative Elements mimicking the design */}
            <div className="hidden lg:block absolute left-[-100px] top-[15%] w-[500px] h-[500px] rounded-full border border-red-500/10 z-0 pointer-events-none" />
            <div className="hidden lg:block absolute left-[50px] top-[10%] w-[300px] h-[300px] rounded-full border border-green-500/10 z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
                    {/* Left: Images Layout */}
                    <div className="w-full lg:w-1/2 relative h-[500px]">
                        {/* Main Student Image */}
                        <div className="absolute top-0 right-4 lg:right-10 w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-2xl z-20">
                            <img
                                src={studentImg}
                                alt="Students"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Secondary Campus Image (Overlapping) */}
                        <div className="absolute bottom-0 left-4 lg:left-0 w-[60%] h-[55%] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white dark:border-slate-800 z-30">
                            <img
                                src={campusImg}
                                alt="Campus"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Small Decorative Floating Image/Element (Optional 3rd element feel) */}
                        <div className="absolute top-[40%] left-[-20px] w-24 h-24 bg-amber-400/10 rounded-full blur-xl z-10 animate-pulse" />
                    </div>

                    {/* Right: Content */}
                    <div className="w-full lg:w-1/2">
                        <span className="text-[#1e3a8a] dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-3 block">About UniGuide</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white font-serif mb-6 leading-tight">
                            Degrees in Various <br /> Academic Disciplines
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Not only can UniGuide provide a pathway to your engineering dreams, but we also offer an environment rich in data-driven insights and academic clarity. We help you navigate the complexities of TNEA admissions with ease.
                        </p>

                        <ul className="space-y-5 mb-10">
                            {[
                                "Access to comprehensive college data",
                                "Analyze latest cutoff trends",
                                "Find your perfect academic match"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center space-x-3 group">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button className="btn-primary shadow-lg shadow-blue-900/20">
                            Read More
                        </button>
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 p-8 md:p-12 transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <StatItem
                            icon={<Globe className="w-7 h-7" />}
                            number="3+"
                            label="Years of Data"
                            color="text-blue-600"
                            bgColor="bg-blue-50 dark:bg-blue-900/20"
                        />
                        <StatItem
                            icon={<MonitorPlay className="w-7 h-7" />}
                            number="450+"
                            label="Colleges Indexed"
                            color="text-emerald-600"
                            bgColor="bg-emerald-50 dark:bg-emerald-900/20"
                        />
                        <StatItem
                            icon={<Users className="w-7 h-7" />}
                            number="98%"
                            label="Prediction Accuracy"
                            color="text-purple-600"
                            bgColor="bg-purple-50 dark:bg-purple-900/20"
                        />
                        <StatItem
                            icon={<GraduationCap className="w-7 h-7" />}
                            number="200k+"
                            label="Data Points"
                            color="text-amber-600"
                            bgColor="bg-amber-50 dark:bg-amber-900/20"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ icon, number, label, color, bgColor }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    const numericValue = parseFloat(number.replace(/[^0-9.]/g, '')) || 0;
    const suffix = number.replace(/[0-9.]/g, '');

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, numericValue, { duration: 2.5, ease: "easeOut" }); // Slower, smoother animation
            return controls.stop;
        }
    }, [isInView, numericValue, count]);

    return (
        <div ref={ref} className="flex items-center space-x-4 p-2">
            <div className={`flex-shrink-0 p-4 ${bgColor} rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-3xl font-bold text-slate-900 dark:text-white font-serif flex items-center">
                    <motion.span>{rounded}</motion.span>
                    <span>{suffix}</span>
                </h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>
        </div>
    );
};

export default AboutSection;
