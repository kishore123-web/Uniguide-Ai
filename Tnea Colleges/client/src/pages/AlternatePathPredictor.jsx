import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Brain, Award, AlertTriangle, TrendingUp, CheckCircle, BookOpen } from 'lucide-react';
import axios from 'axios';

// --- SUB COMPONENTS MOVED OUTSIDE TO FIX RE-RENDER COMPOSITION ISSUES ---

const Step1_CareerSelection = ({ domains, selectedDomain, setSelectedDomain, setStep }) => (
    <div className="space-y-6">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Dream Career Goal</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Don't worry about the branch names yet. What do you want to become?
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
                <motion.button
                    key={domain}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedDomain(domain); setStep(2); }}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${selectedDomain === domain
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                        : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                            <Target className="w-6 h-6" />
                        </div>
                        {selectedDomain === domain && <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{domain}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View alternate pathways to become a pro in {domain}.</p>
                </motion.button>
            ))}
        </div>
    </div>
);

const Step2_AcademicProfile = ({ selectedDomain, academicProfile, handleProfileChange, handlePredict, loading, setStep }) => (
    <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your Academic Profile</h2>
            <p className="text-slate-600 dark:text-slate-400">
                We'll analyze your marks to find the best entry routes for <strong>{selectedDomain}</strong>.
            </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Maths</label>
                    <input
                        type="number"
                        name="maths"
                        value={academicProfile.maths}
                        onChange={handleProfileChange}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Physics</label>
                    <input
                        type="number"
                        name="physics"
                        value={academicProfile.physics}
                        onChange={handleProfileChange}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chemistry</label>
                    <input
                        type="number"
                        name="chemistry"
                        value={academicProfile.chemistry}
                        onChange={handleProfileChange}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0-100"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Risk Tolerance</label>
                <select
                    name="riskTolerance"
                    value={academicProfile.riskTolerance}
                    onChange={handleProfileChange}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="Low">Low (Prefer Safe Options)</option>
                    <option value="Medium">Medium (Balanced)</option>
                    <option value="High">High (Ambitious)</option>
                </select>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-6 text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handlePredict}
                    disabled={loading || !academicProfile.maths || !academicProfile.physics}
                    className="flex-1 py-3 px-6 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex justify-center items-center"
                >
                    {loading ? 'Analyzing...' : 'Find Alternate Paths'}
                </button>
            </div>
        </div>
    </div>
);

const Step3_Dashboard = ({ results, selectedDomain, setStep }) => {
    if (!results) return null;

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Career Recovery Plan</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Target: <span className="text-blue-600 dark:text-blue-400 font-semibold">{selectedDomain}</span>
                    </p>
                </div>
                <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white underline">Start New Search</button>
            </div>

            {/* Section 1: Dream Path Feasibility */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h3 className="text-lg font-medium text-blue-200 mb-1">Direct Entry feasibility</h3>
                    <div className="flex items-baseline gap-3 mb-4">
                        <h2 className="text-4xl font-bold">{results.dreamPath.branch}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${results.dreamPath.admissionProbability === 'High' ? 'bg-green-500/20 text-green-300' :
                            results.dreamPath.admissionProbability === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                            }`}>
                            {results.dreamPath.admissionProbability} Probability
                        </span>
                    </div>
                    <p className="text-blue-100/70 max-w-lg">
                        Based on your cutoff of <strong>{results.dreamPath.cutoff}</strong>, getting a direct seat in this branch might be
                        {results.dreamPath.admissionProbability === 'Low' ? ' highly competitive. Consider the alternate paths below.' : ' possible, but having backups is smart.'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                    <div className="relative mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={377}
                                strokeDashoffset={377 - (377 * (results.dreamPath.cutoff / 200))}
                                className="text-blue-600" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{results.dreamPath.cutoff}</span>
                            <span className="text-xs text-slate-500">/ 200</span>
                        </div>
                    </div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Your Engineering Cutoff</h4>
                </div>
            </section>

            {/* Section 2: Alternate Branch Mapping */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Brain className="text-blue-600 w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Alternate Branches</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {results.alternateBranches.map((branch, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-4 line-clamp-2 h-14">{branch.branchName}</h4>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold uppercase text-slate-500 mb-1">
                                        <span>Career Match</span>
                                        <span>{branch.similarityScore}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${branch.similarityScore}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold uppercase text-slate-500 mb-1">
                                        <span>Placement Overlap</span>
                                        <span>{branch.placementOverlapScore}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${branch.placementOverlapScore}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Section 3 & 4: Roadmap & Upgrades */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Roadmap */}
                <section className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-blue-600 w-6 h-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skill Development Roadmap</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {results.roadmap.map((year, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-slate-500 font-bold z-10">
                                        {year.year}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-2">Year {year.year} Focus</h4>
                                        <ul className="space-y-2">
                                            {year.recommendedSkills.map((skill, i) => (
                                                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                        {year.certifications.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                <span className="text-xs font-semibold text-slate-500 uppercase">Certifications:</span>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {year.certifications.map((cert, c) => (
                                                        <span key={c} className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{cert}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Upgrades */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="text-blue-600 w-6 h-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Upgrades</h3>
                    </div>
                    <div className="bg-gradient-to-b from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-orange-100 dark:border-slate-700 p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Taking an alternate branch? Boost your profile with these additions:
                            </p>
                        </div>
                        <div className="space-y-3">
                            {results.academicUpgrades.map((upgrade, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{upgrade}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Why this works?</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Empirical data shows that students from alternate branches with these specific certifications and minors have a <strong>90%+ placement success rate</strong> in {selectedDomain} companies.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const AlternatePathPredictor = () => {
    const [step, setStep] = useState(1);
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [academicProfile, setAcademicProfile] = useState({
        physics: '',
        chemistry: '',
        maths: '',
        riskTolerance: 'Medium'
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch domains on load
        const fetchDomains = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/alternate-path/domains');
                setDomains(res.data);
            } catch (err) {
                console.error("Failed to fetch domains", err);
                // Fallback if API fails
                setDomains([
                    "Software Development",
                    "Cyber Security",
                    "AI / Data Science",
                    "Core Mechanical",
                    "Civil Engineering",
                    "Electronics / Embedded Systems"
                ]);
            }
        };
        fetchDomains();
    }, []);

    const handleProfileChange = (e) => {
        setAcademicProfile({ ...academicProfile, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/alternate-path/predict', {
                careerDomain: selectedDomain,
                physics: academicProfile.physics,
                chemistry: academicProfile.chemistry,
                maths: academicProfile.maths
            });
            setResults(res.data);
            setStep(3);
        } catch (err) {
            console.error("Prediction failed", err);
            alert("Failed to generate prediction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wider uppercase mb-3">
                        New Feature
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Alternate Path <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Predictor</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Missed your dream branch? Don't panic. Discover data-backed alternate routes to reach your career goals.
                    </p>
                </div>

                {/* Content */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 && (
                            <Step1_CareerSelection
                                domains={domains}
                                selectedDomain={selectedDomain}
                                setSelectedDomain={setSelectedDomain}
                                setStep={setStep}
                            />
                        )}
                        {step === 2 && (
                            <Step2_AcademicProfile
                                selectedDomain={selectedDomain}
                                academicProfile={academicProfile}
                                handleProfileChange={handleProfileChange}
                                handlePredict={handlePredict}
                                loading={loading}
                                setStep={setStep}
                            />
                        )}
                        {step === 3 && (
                            <Step3_Dashboard
                                results={results}
                                selectedDomain={selectedDomain}
                                setStep={setStep}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AlternatePathPredictor;
