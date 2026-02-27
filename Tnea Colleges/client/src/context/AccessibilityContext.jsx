import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    const [isReading, setIsReading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState(1); // 1, 1.25, 1.5
    const [language, setLanguage] = useState('en-US'); // 'en-US' or 'ta-IN'

    const [readingSpeed, setReadingSpeed] = useState(1); // 0.5, 1, 1.5, 2

    // Voice Synthesis Ref
    const synth = window.speechSynthesis;
    const utteranceRef = useRef(null);

    // Voice Recognition Ref
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize Speech Recognition if supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            // Stop existing instance if any
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = language;

            recognition.onstart = () => {
                console.log("Voice Recognition Started");
                setIsListening(true);
            };

            recognition.onend = () => {
                console.log("Voice Recognition Ended");
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                console.log("Voice Command:", command);
                handleVoiceCommand(command);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                // setIsListening(false); // onend will handle this
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [language]);

    useEffect(() => {
        // Apply High Contrast & Font Changes to Body
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
        document.documentElement.style.fontSize = `${fontSize * 100}%`;
    }, [highContrast, fontSize]);

    // Ensure voices are loaded
    const [voices, setVoices] = useState([]);
    useEffect(() => {
        const loadVoices = () => {
            const vs = synth.getVoices();
            setVoices(vs);
        };
        loadVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }, [synth]);

    // Fix for Chrome Garbage Collection bug:
    // If the utterance object is garbage collected, the onend event won't fire and speech stops.
    // We maintain a global reference to active utterances.
    if (!window.speechUtterances) {
        window.speechUtterances = [];
    }

    const speak = (text) => {
        if (!synth) return;

        // Force reset
        synth.cancel();
        setIsReading(true);

        // Chunking Strategy: Browsers fail on long text (>32kb or sometimes less).
        // We'll take the first 200 words for immediate feedback, then users can navigate.
        // For a full reader, we would queue chunks, but for now let's ensure *something* plays.
        const SAFE_LENGTH = 1000;
        let textToPlay = text;
        if (text.length > SAFE_LENGTH) {
            textToPlay = text.substring(0, SAFE_LENGTH) + "... content truncated for playback.";
        }

        const utterance = new SpeechSynthesisUtterance(textToPlay);

        // Robust Voice Selection
        const voices = synth.getVoices();
        // Try strict, then loose, then default
        const voice = voices.find(v => v.lang === language) ||
            voices.find(v => v.lang.includes(language.split('-')[0])) ||
            voices[0]; // Fallback to *any* voice

        if (voice) {
            utterance.voice = voice;
        }

        utterance.rate = readingSpeed;
        utterance.pitch = 1;

        // Event Handling
        utterance.onstart = () => {
            console.log("Audio started playing...");
            setIsReading(true);
        };

        utterance.onend = () => {
            console.log("Audio finished.");
            setIsReading(false);
            // Cleanup from global registry
            const index = window.speechUtterances.indexOf(utterance);
            if (index > -1) {
                window.speechUtterances.splice(index, 1);
            }
        };

        utterance.onerror = (err) => {
            console.error("Audio Engine Error:", err);
            setIsReading(false);
        };

        // Add to global registry to prevent GC
        window.speechUtterances.push(utterance);

        // PLAY
        synth.speak(utterance);
    };

    const stop = () => {
        if (synth.speaking) {
            synth.cancel();
            setIsReading(false);
        }
    };

    const listen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic start failed", e);
            }
        }
    };

    const handleVoiceCommand = (cmd) => {
        if (cmd.includes("stop")) {
            stop();
        } else if (cmd.includes("read") || cmd.includes("start")) {
            // Try to find the main content to read
            const mainContent = document.querySelector('main') || document.body;
            speak(mainContent.innerText);
        } else if (cmd.includes("home")) {
            window.location.href = "/";
        } else if (cmd.includes("next")) {
            window.scrollBy(0, window.innerHeight);
        } else if (cmd.includes("back")) {
            window.history.back();
        }
    };

    const readPageContent = () => {
        if (isReading) {
            stop();
            return;
        }

        // 1. Try to find the main content container
        const main = document.querySelector('main') || document.querySelector('#root') || document.body;

        // 2. Get text and clean it up (remove extra whitespace)
        let text = main.innerText || "";
        text = text.replace(/\s+/g, ' ').trim();

        if (text.length === 0) {
            speak("I cannot find any text on this page to read.");
            return;
        }

        speak("Reading page content. " + text);
    };

    return (
        <AccessibilityContext.Provider value={{
            isReading, isListening, highContrast, fontSize, language, readingSpeed,
            setHighContrast, setFontSize, setLanguage, setReadingSpeed,
            speak, stop, listen, readPageContent
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};
