import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import CollegeDetails from './pages/CollegeDetails';
import Login from './pages/Login';
import Scholarships from './pages/Scholarships';
import ChoiceFilling from './pages/ChoiceFilling';
import AlternatePathPredictor from './pages/AlternatePathPredictor';

import { AccessibilityProvider } from './context/AccessibilityContext';
import AccessibilityWidget from './components/AccessibilityWidget';
import SkipLink from './components/SkipLink';

const App = () => {
  return (
    <AccessibilityProvider>
      <SkipLink />
      <AccessibilityWidget />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/college/:id" element={<CollegeDetails />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/choice-filling" element={<ChoiceFilling />} />
        <Route path="/alternate-path" element={<AlternatePathPredictor />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AccessibilityProvider>
  );
};

export default App;
