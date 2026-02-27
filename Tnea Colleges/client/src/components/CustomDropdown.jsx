import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ label, value, options, onChange, placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const listRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        const fakeEvent = { target: { value: option } };
        onChange(fakeEvent);
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(options.indexOf(value) >= 0 ? options.indexOf(value) : 0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0) {
                    handleSelect(options[focusedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
                buttonRef.current?.focus();
                break;
            case 'Tab':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    // Scroll focused item into view
    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && listRef.current) {
            const focusedElement = listRef.current.children[0].children[focusedIndex];
            if (focusedElement) {
                focusedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [focusedIndex, isOpen]);

    return (
        <div className="space-y-2" ref={dropdownRef}>
            {label && (
                <label
                    id={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Trigger Button */}
                <button
                    ref={buttonRef}
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-labelledby={label ? `${label.replace(/\s+/g, '-').toLowerCase()}-label` : undefined}
                    aria-controls={`${label}-listbox`}
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border 
                               ${isOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a] ring-opacity-20' : 'border-slate-300 dark:border-slate-700'} 
                               rounded-md flex items-center justify-between text-left transition-all duration-200 group hover:border-[#1e3a8a] dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]`}
                >
                    <span className={`block truncate ${!value ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {value || placeholder}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-[#1e3a8a]' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        id={`${label}-listbox`}
                        ref={listRef}
                        role="listbox"
                        tabIndex={-1}
                        className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar animate-in fade-in zoom-in-95 duration-100 origin-top"
                    >
                        <div className="p-1.5 space-y-0.5">
                            {options.map((option, index) => {
                                const isSelected = option === value;
                                const isFocused = index === focusedIndex;
                                return (
                                    <div
                                        key={option}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelect(option)}
                                        className={`px-3 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors
                                            ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1e3a8a] dark:text-blue-400 font-medium'
                                                : isFocused ? 'bg-slate-100 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        <span>{option}</span>
                                        {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDropdown;
