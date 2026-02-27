import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResultCard from '../components/ResultCard';
import Footer from '../components/Footer';
import CustomDropdown from '../components/CustomDropdown';
import { ArrowLeft, Loader2, Frown, Sparkles, Search, Filter } from 'lucide-react';

const Results = () => {
    const location = useLocation();

    // Memoize the form data to prevent infinite loops in useEffect if the object reference changes
    const memoizedFormData = useMemo(() => {
        const { mode: m, tier: t, ...rest } = location.state || {};
        return rest;
    }, [JSON.stringify(location.state)]);

    const state = location.state || {}; // Safely access state
    const mode = state.mode;
    const tier = state.tier;
    const formData = memoizedFormData;

    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState("All Branches");
    const [districtFilter, setDistrictFilter] = useState("All Districts");

    // Dynamic Filter Options based on current result set
    const { availableBranches, availableDistricts } = useMemo(() => {
        const branches = new Set();
        const districts = new Set();
        colleges.forEach(c => {
            if (c.branch) branches.add(c.branch);
            if (c.district) districts.add(c.district);
        });
        return {
            availableBranches: ["All Branches", ...Array.from(branches).sort()],
            availableDistricts: ["All Districts", ...Array.from(districts).sort()]
        };
    }, [colleges]);

    // Filter colleges based on search query and dropdowns
    const filteredColleges = useMemo(() => {
        let results = colleges;

        // Apply Dropdown Filters
        if (branchFilter !== "All Branches") {
            results = results.filter(c => c.branch === branchFilter);
        }
        if (districtFilter !== "All Districts") {
            results = results.filter(c => c.district === districtFilter);
        }

        // Apply Search Query
        if (!searchQuery) return results;
        const query = searchQuery.toLowerCase();
        return results.filter(college =>
            (college.name && college.name.toLowerCase().includes(query)) ||
            (college.code && String(college.code).includes(query)) ||
            (college.branch && college.branch.toLowerCase().includes(query)) ||
            (college.district && college.district.toLowerCase().includes(query))
        );
    }, [colleges, searchQuery, branchFilter, districtFilter]);

    // Helper to determine if we have valid data to run a search/browse
    const isValidRequest = (mode === 'browse' && tier) || (formData && formData.cutoff);

    useEffect(() => {
        if (!isValidRequest) return;

        let isMounted = true;
        const controller = new AbortController();

        const fetchResults = async () => {
            console.log(`[Effect] Fetching results (Attempt ${retryCount + 1})...`);

            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }

                // Use explicit IP to avoid localhost resolution issues
                const endpoint = 'http://127.0.0.1:5000';
                let url;
                let options = {
                    signal: controller.signal,
                    headers: { 'Content-Type': 'application/json' }
                };

                if (mode === 'browse') {
                    // Fetch by Tier
                    url = `${endpoint}/api/colleges?tier=${tier}&limit=100`;
                } else {
                    // Prediction
                    url = `${endpoint}/api/predict`;
                    options.method = 'POST';
                    options.body = JSON.stringify(formData);
                }

                console.log(`[Request] ${options.method || 'GET'} ${url}`);

                // Race the fetch against a strict timeout promise
                const fetchPromise = fetch(url, options);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), 8000)
                );

                const res = await Promise.race([fetchPromise, timeoutPromise]);

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server Error (${res.status}): ${errorText}`);
                }

                const data = await res.json();
                console.log("Data parsed, length:", data?.length);

                if (isMounted) {
                    if (Array.isArray(data)) {
                        setColleges(data);
                    } else {
                        setColleges([]);
                        setError("Received invalid data format from server.");
                    }
                }

            } catch (err) {
                console.error("Fetch Logic Error:", err);
                if (isMounted) {
                    if (err.name === 'AbortError') {
                        // Ignore aborts
                    } else if (err.message === 'Timeout') {
                        setError("Request timed out. Server took too long.");
                        controller.abort(); // Cancel the actual request
                    } else {
                        setError(`Error: ${err.message}`);
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchResults();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [mode, tier, JSON.stringify(formData), retryCount]);

    if (!isValidRequest) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center flex-col p-4 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                    <Frown className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl mb-4 font-bold font-serif">No Search Parameters Found</h2>
                <p className="text-slate-500 mb-8 max-w-md">Please start from the home page to enter your cutoff details or select a tier.</p>
                <Link to="/" className="btn-primary">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main id="main-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
                {/* Search Summary Header */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e3a8a] dark:text-white font-serif mb-2">
                            {mode === 'browse' ? `Tier ${tier} Institutions` : 'Prediction Results'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {mode === 'browse'
                                ? 'Browsing curated list of top colleges in this tier.'
                                : 'Matched institutions based on your profile.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {mode === 'browse' ? (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm font-medium">
                                Filter: <span className="text-[#1e3a8a] dark:text-blue-400 font-bold">Tier {tier}</span>
                            </span>
                        ) : (
                            <>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm font-medium">
                                    Cutoff: <span className="text-[#1e3a8a] dark:text-blue-400 font-bold">{formData.cutoff}</span>
                                </span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm font-medium">
                                    Category: <span className="text-[#1e3a8a] dark:text-blue-400 font-bold">{formData.category}</span>
                                </span>
                            </>
                        )}
                    </div>

                    <Link to="/" className="text-slate-500 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white font-medium flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {mode === 'browse' ? 'Back to Home' : 'Modify Search'}
                    </Link>
                </div>

                {loading ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center shadow-sm">
                        <Loader2 className="w-12 h-12 text-[#1e3a8a] dark:text-blue-400 animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif">
                            {mode === 'browse' ? 'Loading Directory' : 'Analyzing Database'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Fetching the latest data...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-8 rounded-lg text-center">
                        <h3 className="text-lg font-bold text-red-800 dark:text-red-400 font-serif">Error Loading Results</h3>
                        <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
                        <button
                            onClick={() => setRetryCount(c => c + 1)}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : colleges.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-16 text-center shadow-sm">
                        <div className="inline-flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
                            <Frown className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white font-serif mb-2">No Matching Institutions Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            We couldn't find any colleges matching your criteria.
                        </p>
                        <div className="mt-8">
                            <Link to="/" className="btn-outline">
                                Go Back
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Filter & Search Section */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-4">
                                    <CustomDropdown
                                        label="Specific Branch"
                                        value={branchFilter}
                                        options={availableBranches}
                                        onChange={(e) => setBranchFilter(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <CustomDropdown
                                        label="District"
                                        value={districtFilter}
                                        options={availableDistricts}
                                        onChange={(e) => setDistrictFilter(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-5 relative">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 invisible md:visible">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-md leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] sm:text-sm transition duration-150 ease-in-out"
                                            placeholder="Keyword search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pb-4">
                            <Sparkles className="w-4 h-4 text-[#c0a062]" />
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {mode === 'browse' ? `Showing ${filteredColleges.length} Institutions` : `Recommended Colleges (${filteredColleges.length})`}
                            </span>
                        </div>

                        {/* List View */}
                        <div className="flex flex-col gap-4">
                            {filteredColleges.length > 0 ? (
                                filteredColleges.map((college, idx) => (
                                    <ResultCard
                                        key={idx}
                                        college={college}
                                        cutoff={mode === 'browse' ? college.cutoff : formData.cutoff}
                                        userData={formData}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-500 dark:text-slate-400">No colleges match your search filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div >
    );
};

export default Results;
