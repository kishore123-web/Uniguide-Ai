import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Footer = () => {
    return (
        <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 group mb-6">
                            <div className="uni-logo scale-75 origin-left">
                                <div className="uni-logo-cap-top"></div>
                                <div className="uni-logo-cap-body"></div>
                                <div className="uni-logo-pen"></div>
                                <div className="uni-logo-book">
                                    <div className="uni-logo-book-left"></div>
                                    <div className="uni-logo-book-right"></div>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                                UniGuide Ai
                            </span>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            Empowering students with data-driven insights to make informed decisions about their academic future. Your trusted companion for engineering admissions.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-[#1e3a8a] dark:hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-[#1e3a8a] dark:hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-[#1e3a8a] dark:hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-[#1e3a8a] dark:hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif font-bold text-slate-900 dark:text-white text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">About UniGuide</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">College Predictor</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">TNEA Cutoffs</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Top Engineering Colleges</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Admission Process</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-serif font-bold text-slate-900 dark:text-white text-lg mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Disclaimer</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-[#1e3a8a] dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-serif font-bold text-slate-900 dark:text-white text-lg mb-6">Get in Touch</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-slate-600 dark:text-slate-400 text-sm">
                                <MapPin className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400 shrink-0" />
                                <span>123 Education Lane, Taramani,<br />Chennai, Tamil Nadu 600113</span>
                            </li>
                            <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-sm">
                                <Phone className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-sm">
                                <Mail className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400 shrink-0" />
                                <span>support@uniguide.ai</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 dark:text-slate-500 text-sm mb-4 md:mb-0">
                        © 2025 UniGuide Ai. All rights reserved.
                    </p>
                    <p className="text-slate-400 dark:text-slate-600 text-xs text-center md:text-right max-w-md">
                        Disclaimer: UniGuide Ai is an independent platform and is not affiliated with TNEA or Anna University. All data is for informational purposes only.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
