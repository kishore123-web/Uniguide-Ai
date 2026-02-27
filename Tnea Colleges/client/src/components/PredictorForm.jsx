import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calculator, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const PredictorForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cutoff: '',
        category: 'OC',
        preferredBranch: 'All Branches',
        district: 'All Districts',
        gender: 'Male',
        isGovtSchool: false,
        incomeCategory: 'Medium',
        isPwD: false,
        disabilityCategory: 'Locomotor Disability',
        disabilityPercentage: '',
        hasMedicalCertificate: true,
        requireAssistiveSupport: false
    });

    const [categories, setCategories] = useState(['OC', 'BC', 'BCM', 'MBC', 'DNC', 'SC', 'SCA', 'ST']);
    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                // Use explicit IP to avoid localhost resolution issues
                const response = await axios.get('http://127.0.0.1:5000/api/filters');
                if (response.data) {
                    if (response.data.branches && response.data.branches.length > 0) {
                        setBranches(['All Branches', ...response.data.branches]);
                    }
                    if (response.data.districts && response.data.districts.length > 0) {
                        setDistricts(['All Districts', ...response.data.districts]);
                    }
                    if (response.data.categories && response.data.categories.length > 0) {
                        setCategories(response.data.categories);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch filters, using fallbacks:", error);
                // Fallbacks
                setBranches(['All Branches', 'COMPUTER SCIENCE AND ENGINEERING', 'INFORMATION TECHNOLOGY', 'ELECTRONICS AND COMMUNICATION ENGINEERING']);
                setDistricts(['All Districts', 'Chennai', 'Coimbatore', 'Madurai']);
            }
        };

        fetchFilters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Calculate cutoff: Maths + (Physics/2) + (Chemistry/2)
            const p = parseFloat(formData.physics) || 0;
            const c = parseFloat(formData.chemistry) || 0;
            const m = parseFloat(formData.maths) || 0;

            // Explicit calculation as requested by user to ensure accuracy
            const calculatedCutoff = (m + (p / 2) + (c / 2)).toFixed(2);

            const payload = { ...formData, cutoff: calculatedCutoff };

            console.log("[PredictorForm] Submitting Payload:", payload);

            // Simulate API logic or actual call if backend is ready
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Pass calculated payload
            navigate('/results', { state: payload });
        } catch (err) {
            console.error("Prediction Error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="predictor" className="py-20 bg-white dark:bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="academic-card p-8 md:p-12 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                    {/* Decorative Top header */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[#1e3a8a]"></div>

                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-slate-800 rounded-full mb-4 text-[#1e3a8a] dark:text-blue-400">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">College Predictor Tool</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                            Enter your academic details below to discover which universities and colleges you are eligible for based on previous years' cutoff trends.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Screen Reader Instructions - Visually Hidden */}
                            <div className="sr-only" role="note" tabIndex="0">
                                To enter your cutoff marks, please provide your marks out of 100 for Math, Physics, and Chemistry.
                                The system will automatically calculate your aggregate cutoff.
                                For Community selection, choose your category from the list.
                                If you are a differently abled student, check the PwD box to access specific reservation inputs.
                            </div>

                            {/* PCM Inputs - Replaces Single Cutoff */}
                            <div className="space-y-4 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" id="marks-label">
                                    Academic Marks (Out of 100)
                                </label>
                                <div className="grid grid-cols-3 gap-4" role="group" aria-labelledby="marks-label">
                                    <div className="space-y-1">
                                        <label htmlFor="maths" className="text-xs font-medium text-slate-500 uppercase">Maths</label>
                                        <input
                                            id="maths"
                                            name="maths"
                                            aria-label="Enter Maths Mark out of 100"
                                            type="number"
                                            min="0"
                                            max="100"
                                            required
                                            className="input-academic text-center font-mono font-bold"
                                            placeholder="100"
                                            value={formData.maths || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                                                    setFormData({ ...formData, maths: val });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="physics" className="text-xs font-medium text-slate-500 uppercase">Physics</label>
                                        <input
                                            id="physics"
                                            name="physics"
                                            aria-label="Enter Physics Mark out of 100"
                                            type="number"
                                            min="0"
                                            max="100"
                                            required
                                            className="input-academic text-center font-mono font-bold"
                                            placeholder="100"
                                            value={formData.physics || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                                                    setFormData({ ...formData, physics: val });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="chemistry" className="text-xs font-medium text-slate-500 uppercase">Chemistry</label>
                                        <input
                                            id="chemistry"
                                            name="chemistry"
                                            aria-label="Enter Chemistry Mark out of 100"
                                            type="number"
                                            min="0"
                                            max="100"
                                            required
                                            className="input-academic text-center font-mono font-bold"
                                            placeholder="100"
                                            value={formData.chemistry || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                                                    setFormData({ ...formData, chemistry: val });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500" aria-live="polite">
                                    *Enter marks out of 100. Cutoff will be calculated as: Maths + (Physics/2) + (Chemistry/2).
                                </p>
                            </div>

                            {/* Category Select */}
                            <CustomDropdown
                                label="Community Category"
                                value={formData.category}
                                options={categories}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />

                            {/* Branch Select */}
                            <CustomDropdown
                                label="Preferred Branch"
                                value={formData.preferredBranch}
                                options={branches}
                                onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                            />

                            {/* District Select */}
                            <CustomDropdown
                                label="Preferred District / Region"
                                value={formData.district}
                                options={districts}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />

                            {/* Additional AI Parameters */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <CustomDropdown
                                    label="Gender"
                                    value={formData.gender}
                                    options={['Male', 'Female', 'Other']}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                />
                                <CustomDropdown
                                    label="Annual Income Category"
                                    value={formData.incomeCategory}
                                    options={['Low (<2.5L)', 'Medium (2.5-8L)', 'High (>8L)']}
                                    onChange={(e) => setFormData({ ...formData, incomeCategory: e.target.value })}
                                />
                                <div className="flex flex-col justify-center">
                                    <label className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-[#1e3a8a] rounded"
                                            checked={formData.isGovtSchool}
                                            onChange={(e) => setFormData({ ...formData, isGovtSchool: e.target.checked })}
                                        />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">7.5% Govt School Quota</span>
                                    </label>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <label className="flex items-center space-x-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-indigo-600 rounded"
                                            checked={formData.isPwD}
                                            onChange={(e) => setFormData({ ...formData, isPwD: e.target.checked })}
                                        />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Differently Abled (PwD)</span>
                                    </label>
                                </div>
                            </div>

                            {/* PwD Profile Section (Conditional) */}
                            {formData.isPwD && (
                                <div className="md:col-span-2 space-y-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        <h4 className="font-bold text-slate-900 dark:text-white">PwD Reservation Profile</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomDropdown
                                            label="Disability Category"
                                            value={formData.disabilityCategory}
                                            options={['Locomotor Disability', 'Visual Impairment', 'Hearing Impairment', 'Speech and Language Disability', 'Intellectual Disability']}
                                            onChange={(e) => setFormData({ ...formData, disabilityCategory: e.target.value })}
                                        />
                                        <div className="space-y-1">
                                            <label htmlFor="disability-percentage" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Disability Percentage</label>
                                            <input
                                                id="disability-percentage"
                                                type="number"
                                                placeholder="e.g. 45"
                                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                                value={formData.disabilityPercentage}
                                                onChange={(e) => setFormData({ ...formData, disabilityPercentage: e.target.value })}
                                            />
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">*Min 40% required for reservation</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id="cert"
                                                checked={formData.hasMedicalCertificate}
                                                onChange={(e) => setFormData({ ...formData, hasMedicalCertificate: e.target.checked })}
                                                className="w-4 h-4 text-indigo-600 rounded"
                                            />
                                            <label htmlFor="cert" className="text-sm font-medium text-slate-700 dark:text-slate-300">Medical Certificate Available</label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id="assist"
                                                checked={formData.requireAssistiveSupport}
                                                onChange={(e) => setFormData({ ...formData, requireAssistiveSupport: e.target.checked })}
                                                className="w-4 h-4 text-indigo-600 rounded"
                                            />
                                            <label htmlFor="assist" className="text-sm font-medium text-slate-700 dark:text-slate-300">Require Assistive Support</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <div className="hidden md:block text-sm text-slate-500 italic">
                                *Predictions are based on last year's trends.
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto btn-primary bg-[#1e3a8a] text-lg px-10 py-4 shadow-xl hover:shadow-2xl"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Analyzing Data...
                                    </>
                                ) : (
                                    <>
                                        Predict My Colleges
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default PredictorForm;
