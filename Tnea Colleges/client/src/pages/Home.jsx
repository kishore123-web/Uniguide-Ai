import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AboutSection from '../components/AboutSection';
import CollegeTiers from '../components/CollegeTiers';

import PredictorForm from '../components/PredictorForm';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            // Clear state so it doesn't scroll again on refresh? 
            // Actually router state persists, but usually acceptable or we can replace history.
            window.history.replaceState({}, document.title)
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />
            <main id="main-content">
                <Hero />
                <PredictorForm />
                <AboutSection />
                <Features />
                <CollegeTiers />
            </main>

            {/* Simple Footer */}
            <footer className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <p>© 2025 UniGuide Ai. All rights reserved </p>
            </footer>
        </div>
    );
};

export default Home;
