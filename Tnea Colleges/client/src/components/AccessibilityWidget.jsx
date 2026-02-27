import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
    Accessibility, Mic, MicOff, Volume2, VolumeX,
    Type, Sun, Moon, Languages, X, Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessibilityWidget = () => {
    const {
        isReading, isListening, highContrast, fontSize, language, readingSpeed,
        setHighContrast, setFontSize, setLanguage, setReadingSpeed,
        speak, stop, listen, readPageContent
    } = useAccessibility();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 w-72 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95"
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Accessibility className="w-5 h-5 text-indigo-600" />
                                Access Tools
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Controls Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Screen Reader */}
                            <button
                                onClick={isReading ? stop : readPageContent}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isReading ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                            >
                                {isReading ? <VolumeX className="w-6 h-6 mb-1" /> : <Volume2 className="w-6 h-6 mb-1" />}
                                <span className="text-[10px] font-bold uppercase">{isReading ? 'Stop Reading' : 'Read Page'}</span>
                            </button>

                            {/* Voice Command */}
                            <button
                                onClick={listen}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                            >
                                {isListening ? <Mic className="w-6 h-6 mb-1" /> : <MicOff className="w-6 h-6 mb-1" />}
                                <span className="text-[10px] font-bold uppercase">{isListening ? 'Listening...' : 'Voice Cmd'}</span>
                            </button>

                            {/* Font Size */}
                            <div className="col-span-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl flex items-center justify-between px-4">
                                <Type className="w-4 h-4 text-slate-400" aria-hidden="true" />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFontSize(1)}
                                        aria-label="Set Normal Font Size"
                                        className={`w-8 h-8 rounded-lg font-bold text-xs ${fontSize === 1 ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                                    >A</button>
                                    <button
                                        onClick={() => setFontSize(1.25)}
                                        aria-label="Set Large Font Size"
                                        className={`w-8 h-8 rounded-lg font-bold text-sm ${fontSize === 1.25 ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                                    >A+</button>
                                    <button
                                        onClick={() => setFontSize(1.5)}
                                        aria-label="Set Extra Large Font Size"
                                        className={`w-8 h-8 rounded-lg font-bold text-lg ${fontSize === 1.5 ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                                    >A++</button>
                                </div>
                            </div>

                            {/* Reading Speed */}
                            <div className="col-span-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl flex items-center justify-between px-4">
                                <Gauge className="w-4 h-4 text-slate-400" aria-hidden="true" />
                                <div className="flex gap-1">
                                    {[0.5, 1, 1.5, 2].map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => setReadingSpeed(speed)}
                                            aria-label={`Set Reading Speed to ${speed}x`}
                                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${readingSpeed === speed ? 'bg-white shadow text-indigo-600 scale-110' : 'text-slate-500 hover:text-indigo-500'}`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* High Contrast */}
                            <button
                                onClick={() => setHighContrast(!highContrast)}
                                aria-pressed={highContrast}
                                aria-label="Toggle High Contrast Mode"
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl col-span-1 ${highContrast ? 'bg-yellow-400 text-black font-bold ring-2 ring-black' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                            >
                                {highContrast ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
                                <span className="text-[10px] font-bold uppercase">Contrast</span>
                            </button>

                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(l => l === 'en-US' ? 'ta-IN' : 'en-US')}
                                aria-label={`Switch Language to ${language === 'en-US' ? 'Tamil' : 'English'}`}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl col-span-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                                <Languages className="w-4 h-4" aria-hidden="true" />
                                <span className="text-[10px] font-bold uppercase">{language === 'en-US' ? 'English' : 'Tamil'}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                aria-label="Open Accessibility Tools"
            >
                <Accessibility className="w-7 h-7" />
            </button>
        </div>
    );
};

export default AccessibilityWidget;
