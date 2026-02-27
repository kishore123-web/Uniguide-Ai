import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion, Reorder } from 'framer-motion';
import {
    Brain, ShieldCheck, AlertTriangle, Star, DollarSign,
    ArrowRight, Loader2, GripVertical, CheckCircle2, Lock
} from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

const ChoiceFilling = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        cutoff: '',
        community: 'BC',
        income: '',
        isGovtSchool: false,
        isFirstGraduate: false,
        preferredBranch: 'All Branches',
        preferredDistrict: 'All Districts'
    });

    // Choices State
    const [choices, setChoices] = useState([]);
    const [categories, setCategories] = useState(['OC', 'BC', 'BCM', 'MBC', 'DNC', 'SC', 'SCA', 'ST']);
    const [branches, setBranches] = useState(['All Branches']);
    const [districts, setDistricts] = useState(['All Districts']);

    // Fetch Filters on Load
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/filters');
                if (response.data) {
                    if (response.data.branches) setBranches(['All Branches', ...response.data.branches]);
                    if (response.data.districts) setDistricts(['All Districts', ...response.data.districts]);
                }
            } catch (error) {
                console.error("Filter fetch failed", error);
            }
        };
        fetchFilters();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Calculate cutoff on demand
            const p = parseFloat(formData.physics) || 0;
            const c = parseFloat(formData.chemistry) || 0;
            const m = parseFloat(formData.maths) || 0;
            const calculatedCutoff = (m + ((p + c) / 2)).toFixed(2);

            const payload = { ...formData, cutoff: calculatedCutoff };

            const res = await axios.post('http://localhost:5000/api/choice-filling/generate', payload);
            setChoices(res.data.choices);
            setStep(2);
        } catch (err) {
            console.error(err);
            alert("Failed to generate choices. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main id="main-content" className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <HeaderSection />

                {step === 1 && (
                    <InputForm
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        branches={branches}
                        districts={districts}
                        handleGenerate={handleGenerate}
                        loading={loading}
                    />
                )}

                {step === 2 && (
                    <ResultsView
                        choices={choices}
                        setChoices={setChoices}
                        setStep={setStep}
                    />
                )}
            </main>
        </div>
    );
};

const HeaderSection = () => (
    <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 text-purple-600 dark:text-purple-300">
            <Brain className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white font-serif mb-4">
            AI Choice Filter & Optimizer
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Don't fill your choices blindly. Let our AI engineer the optimal order for maximum admission probability and ROI.
        </p>
    </div>
);

const InputForm = ({ formData, setFormData, categories, branches, districts, handleGenerate, loading }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8"
        >
            <form onSubmit={handleGenerate} className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                        1. Academic Details
                    </h2>

                    {/* PCM Marks Inputs */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="maths-input" className="block text-xs font-bold text-slate-500 uppercase mb-1">Maths</label>
                            <input
                                id="maths-input"
                                type="number" min="0" max="100" required
                                value={formData.maths || ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                                        setFormData({ ...formData, maths: val });
                                    }
                                }}
                                className="w-full p-3 text-center font-mono font-bold text-lg rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="100"
                            />
                        </div>
                        <div>
                            <label htmlFor="physics-input" className="block text-xs font-bold text-slate-500 uppercase mb-1">Physics</label>
                            <input
                                id="physics-input"
                                type="number" min="0" max="100" required
                                value={formData.physics || ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                                        setFormData({ ...formData, physics: val });
                                    }
                                }}
                                className="w-full p-3 text-center font-mono font-bold text-lg rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="100"
                            />
                        </div>
                        <div>
                            <label htmlFor="chemistry-input" className="block text-xs font-bold text-slate-500 uppercase mb-1">Chemistry</label>
                            <input
                                id="chemistry-input"
                                type="number" min="0" max="100" required
                                value={formData.chemistry || ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                                        setFormData({ ...formData, chemistry: val });
                                    }
                                }}
                                className="w-full p-3 text-center font-mono font-bold text-lg rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="100"
                            />
                        </div>
                    </div>

                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                        2. Personal & Preferences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Community */}
                        <div className="px-1">
                            <CustomDropdown
                                label="Community"
                                options={categories}
                                value={formData.community}
                                onChange={e => setFormData({ ...formData, community: e.target.value })}
                            />
                        </div>

                        {/* Annual Income */}
                        <div>
                            <label htmlFor="income-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Annual Family Income</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400" aria-hidden="true">₹</span>
                                <input
                                    id="income-input"
                                    type="number"
                                    value={formData.income}
                                    onChange={e => setFormData({ ...formData, income: e.target.value })}
                                    className="w-full pl-8 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="e.g. 150000"
                                />
                            </div>
                        </div>

                        {/* District Preference */}
                        <div className="px-1">
                            <CustomDropdown
                                label="Preferred District"
                                options={districts}
                                value={formData.preferredDistrict}
                                onChange={e => setFormData({ ...formData, preferredDistrict: e.target.value })}
                            />
                        </div>

                        {/* Branch Preference */}
                        <div className="px-1 md:col-span-2">
                            <CustomDropdown
                                label="Preferred Branch"
                                options={branches}
                                value={formData.preferredBranch}
                                onChange={e => setFormData({ ...formData, preferredBranch: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <input
                                type="checkbox"
                                checked={formData.isGovtSchool}
                                onChange={e => setFormData({ ...formData, isGovtSchool: e.target.checked })}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white block">Government School Student</span>
                                <span className="text-xs text-slate-500">Studied 6th to 12th in Govt. School</span>
                            </div>
                        </label>

                        <label className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <input
                                type="checkbox"
                                checked={formData.isFirstGraduate}
                                onChange={e => setFormData({ ...formData, isFirstGraduate: e.target.checked })}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white block">First Graduate</span>
                                <span className="text-xs text-slate-500">First person in family to attend college</span>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Brain className="mr-2" />}
                            Generate AI Choice List
                        </button>
                    </div>
                </div>
            </form>
        </motion.div >
    );
};

const ResultsView = ({ choices, setChoices, setStep }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium flex items-center"
                >
                    &larr; Refine Inputs
                </button>
                <div className="flex space-x-3">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        {choices.filter(c => c.probability.label === 'Safe').length} Safe
                    </div>
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                        {choices.filter(c => c.probability.label === 'Moderate').length} Moderate
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl mb-8 flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>AI Strategy:</strong> Choices are ordered from "Dream" to "Safe". This maximizes your chance of getting a better college (Dream) while keeping Safe colleges as backups.
                </p>
            </div>

            <Reorder.Group axis="y" values={choices} onReorder={setChoices} className="space-y-4">
                {choices.map((choice) => (
                    <ChoiceCard key={choice._id || choice.code + choice.branch} choice={choice} />
                ))}
            </Reorder.Group>

            {choices.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    No colleges found matching your criteria. Try widening your filters.
                </div>
            )}
        </div>
    );
};

const ChoiceCard = ({ choice }) => {
    // Determine colors
    const probColor =
        choice.probability.label === 'Safe' ? 'bg-green-100 text-green-700 border-green-200' :
            choice.probability.label === 'Moderate' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                choice.probability.label === 'Dream' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                    'bg-slate-100 text-slate-700';

    return (
        <Reorder.Item value={choice} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-0 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing overflow-hidden group">
            <div className="flex flex-col md:flex-row">
                {/* Drag Handle & Tier Strip */}
                <div className="bg-slate-50 dark:bg-slate-800 w-full md:w-12 flex md:flex-col items-center justify-center p-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                    <GripVertical className="text-slate-400 w-5 h-5 mb-0 md:mb-2" />
                    <span className="text-xs font-black text-slate-400 uppercase rotate-0 md:-rotate-90 whitespace-nowrap">Rank {choice.nirfRank || 'N/A'}</span>
                </div>

                <div className="p-5 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${probColor}`}>
                                    {choice.probability.label}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700`}>
                                    {choice.probability.percent}% Probability
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                    Tier {choice.tier}{choice.subTier}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                {choice.name}
                            </h3>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                                {choice.branch} <span className="text-slate-300 mx-2">|</span> Code: {choice.code}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                {choice.cutoff.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">Cutoff</div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 flex flex-wrap gap-4 md:gap-8 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                                <DollarSign className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Net Year Fee</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    ₹{(choice.financials.netFee / 1000).toFixed(0)}k
                                    {choice.financials.waiver > 0 && <span className="text-xs text-green-500 ml-1 line-through opacity-70">₹{(choice.financials.totalFee / 1000).toFixed(0)}k</span>}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                                <Star className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Est. ROI Score</p>
                                <div className="flex items-center">
                                    <div className="w-16 h-1.5 bg-slate-200 rounded-full mr-2 overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${choice.placementScore}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold">{choice.placementScore}/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex items-start text-xs text-slate-500 italic">
                        <CheckCircle2 className="w-3 h-3 mr-1.5 mt-0.5 text-purple-500" />
                        {choice.reason}
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
};

export default ChoiceFilling;
