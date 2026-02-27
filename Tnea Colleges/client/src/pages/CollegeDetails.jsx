import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BookOpen, Globe, Phone, Mail, Award, CheckCircle, Star, User, TrendingUp, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CollegeDetails = () => {
    const { id } = useParams();
    // Simulate fetching data based on ID - in real app, fetch from backend
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({ user: '', rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCollegeAndReviews = async () => {
            if (!id) return;

            try {
                // Fetch College
                const collegeRes = await fetch(`http://127.0.0.1:5000/api/college/${id}`);

                if (!collegeRes.ok) {
                    throw new Error(`College fetch failed: ${collegeRes.statusText}`);
                }

                const collegeData = await collegeRes.json();

                if (collegeData && !collegeData.error) {
                    const placementStats = getPlacementStats(collegeData.tier || '3');
                    if (collegeData.averagePackage) placementStats.average = collegeData.averagePackage;
                    if (collegeData.highestPackage) placementStats.highest = collegeData.highestPackage;
                    if (collegeData.placementDescription) placementStats.report = collegeData.placementDescription;

                    let branchesData = ["Computer Science", "ECE", "EEE", "Mechanical", "Civil"];
                    if (collegeData.code) {
                        try {
                            // Fetch Available Branches
                            const branchesRes = await fetch(`http://127.0.0.1:5000/api/college_branches/${collegeData.code}`);
                            if (branchesRes.ok) {
                                branchesData = await branchesRes.json();
                            }
                        } catch (e) {
                            console.warn("Branch fetch failed", e);
                        }
                    }

                    setCollege({
                        ...collegeData,
                        location: collegeData.district || "Chennai, Tamil Nadu",
                        description: generateDescription(collegeData),
                        placement: placementStats,
                        placementLink: collegeData.placementLink,
                        website: collegeData.website || "www.annauniv.edu",
                        contact: collegeData.phone || "044 - 2235 8315",
                        email: collegeData.email || "enquiry@annauniv.edu",
                        nirf: (collegeData.nirfRank && collegeData.nirfRank !== 999) ? collegeData.nirfRank : "Not Ranked",
                        courses: Array.isArray(branchesData) && branchesData.length > 0 ? branchesData : ["Computer Science", "ECE", "EEE", "Mechanical", "Civil"],
                    });

                    // Fetch Reviews
                    if (collegeData.code) {
                        try {
                            const reviewsRes = await fetch(`http://127.0.0.1:5000/api/reviews/${collegeData.code}`);
                            if (reviewsRes.ok) {
                                const reviewsData = await reviewsRes.json();
                                setReviews(reviewsData.length > 0 ? reviewsData : generateReviews(collegeData));
                            } else {
                                setReviews(generateReviews(collegeData));
                            }
                        } catch (e) {
                            console.warn("Reviews fetch failed", e);
                            setReviews(generateReviews(collegeData));
                        }
                    }
                } else {
                    setCollege(null);
                }
            } catch (error) {
                console.error("Failed to fetch college details", error);
                setCollege(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCollegeAndReviews();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collegeCode: id,
                    ...reviewForm
                })
            });

            if (response.ok) {
                const newReview = await response.json();
                setReviews([newReview, ...reviews]);
                setIsReviewModalOpen(false);
                setReviewForm({ user: '', rating: 5, comment: '' });
                alert("Review submitted successfully!");
            }
        } catch (error) {
            console.error("Failed to submit review", error);
            alert("Error submitting review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateDescription = (data) => {
        return `${data.name} is a premier institution located in ${data.district}. Designated as a Tier ${data.tier} college, it is known for its academic excellence in ${data.branch} and consistent performance in university examinations.`;
    };

    const getPlacementStats = (tier) => {
        if (tier === '1') {
            return {
                rate: "96%",
                highest: "44 LPA",
                average: "8.5 LPA",
                topRecruiters: ["Amazon", "Google", "Microsoft", "Zoho", "TCS Digital"],
                report: "Tier 1 institutions typically maintain an exceptional placement record. Students receive offers from top-tier product companies and mass recruiters alike. The placement cell is highly active, providing rigorous training from the pre-final year.",
                trend: "Rising consistently with more product-based offers."
            };
        } else if (tier === '2') {
            return {
                rate: "85%",
                highest: "18 LPA",
                average: "5.5 LPA",
                topRecruiters: ["Cognizant", "Infosys", "Wipro", "Accenture", "Zoho"],
                report: "Tier 2 colleges offer strong placement opportunities, primarily with major service-based IT companies and core engineering firms. Consistent performers often secure 'Dream' offers.",
                trend: "Stable with increasing average packages."
            };
        } else {
            return {
                rate: "70%",
                highest: "10 LPA",
                average: "3.5 LPA",
                topRecruiters: ["TCS Ninja", "HCL", "Sutherland", "Local Startups"],
                report: "Focus is on employability and skill development. While top-tier product companies are fewer, students have ample opportunities in service sectors and core industries through off-campus drives.",
                trend: "Improving with focused skill-development programs."
            };
        }
    };

    const generateReviews = (data) => [
        { user: "Student A", rating: 4, comment: `Good infrastructure and lab facilities in ${data.district}.`, date: new Date() },
        { user: "Student B", rating: 5, comment: "Faculty members are helpful. Placements are good for CSE/IT.", date: new Date() },
        { user: "Student C", rating: 3, comment: "Strict rules but good for academics.", date: new Date() }
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!college) return <div className="min-h-screen flex items-center justify-center">College not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
            <Navbar />

            {/* Header Banner */}
            <div className="bg-[#1e3a8a] text-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="px-3 py-1 bg-white/20 rounded border border-white/30 text-xs font-semibold backdrop-blur-sm">
                                    Code: {college.code}
                                </span>
                                <span className="px-3 py-1 bg-amber-400/20 text-amber-200 rounded border border-amber-400/30 text-xs font-semibold">
                                    {college.tier}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4 leading-tight">
                                {college.name}
                            </h1>
                            <div className="flex flex-wrap gap-4 items-center text-blue-200 text-sm md:text-base">
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    {college.location}
                                </div>
                                {college.branch && (
                                    <div className="flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2 text-blue-300" />
                                        {college.branch}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 min-w-[200px] text-center">
                            <p className="text-sm text-blue-200 uppercase tracking-widest font-semibold mb-1">Expect Cutoff</p>
                            <p className="text-4xl font-bold font-serif">{college.cutoff}</p>
                            <p className="text-xs text-blue-300 mt-2">{college.category || 'OC'} Category (2024)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Overview & Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm">
                            <h2 className="text-2xl font-bold font-serif text-[#1e3a8a] dark:text-white mb-4">About the Institute</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {college.description}
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start">
                                    <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 mr-4">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Website</p>
                                        <a href={`http://${college.website}`} target="_blank" className="text-blue-600 hover:underline">{college.website}</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 mr-4">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">NIRF Rank</p>
                                        <p className="text-slate-600 dark:text-slate-400">{college.nirf} (Engineering)</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Placement Highlights */}
                        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm">
                            <h2 className="text-2xl font-bold font-serif text-[#1e3a8a] dark:text-white mb-6">Placement Stats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                                <div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{college.placement.rate}</p>
                                    <p className="text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Placed</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{college.placement.highest}</p>
                                    <p className="text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Highest</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{college.placement.average}</p>
                                    <p className="text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Average</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Top Recruiters</h3>
                                <div className="flex flex-wrap gap-2">
                                    {college.placement.topRecruiters.map((recruiter, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-sm">
                                            {recruiter}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Placement Analysis</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-justify">
                                    {college.placement.report}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="inline-flex items-center text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-md">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Current Trend: {college.placement.trend}
                                    </div>
                                    {college.placementLink && (
                                        <a href={college.placementLink} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                            View Official Report <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Reviews Section - Implementation */}
                        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold font-serif text-[#1e3a8a] dark:text-white">Student Reviews</h2>
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Write a Review
                                </button>
                            </div>

                            <div className="space-y-6">
                                {reviews.map((review, i) => (
                                    <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                    {review.user[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{review.user}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {review.date ? new Date(review.date).toLocaleDateString() : 'Engineering Student'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold border border-amber-100 dark:border-amber-900/30">
                                                <Star className="w-3 h-3 fill-current mr-1" />
                                                {review.rating}.0
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Review Modal */}
                    {isReviewModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit your review</h3>
                                    <button
                                        onClick={() => setIsReviewModalOpen(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={reviewForm.user}
                                            onChange={(e) => setReviewForm({ ...reviewForm, user: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    className={`p-1 transition-colors ${reviewForm.rating >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                                                >
                                                    <Star className={`w-8 h-8 ${reviewForm.rating >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Experience</label>
                                        <textarea
                                            required
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            rows="4"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Write your review here..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Right Sidebar: Quick Details */}
                    <aside className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm sticky top-24">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 font-serif text-lg">Offered Courses</h3>
                            <ul className="space-y-3">
                                {college.courses.map((course, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                        {course}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 font-serif text-lg">Contact Admission</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                        <Phone className="w-4 h-4 mr-3 text-blue-600" />
                                        {college.contact}
                                    </li>
                                    <li className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                        <Mail className="w-4 h-4 mr-3 text-blue-600" />
                                        {college.email}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CollegeDetails;
