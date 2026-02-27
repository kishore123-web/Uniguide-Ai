import React from 'react';

const SkipLink = () => {
    return (
        <a
            href="#main-content"
            className="fixed top-2 left-2 z-[99999] -translate-y-[200%] focus:translate-y-0 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg font-bold transition-transform duration-200 outline-none ring-2 ring-white"
        >
            Skip to Main Content
        </a>
    );
};

export default SkipLink;
