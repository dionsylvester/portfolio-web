import React, { lazy, Suspense, useEffect, useState } from 'react';
import Home from './components/pages/Home.jsx';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const About = lazy(() => import('./components/pages/About.jsx'));
const Battery = lazy(() => import('./components/pages/BatteryPage.jsx'));
const Climate = lazy(() => import('./components/pages/ClimatePage.jsx'));
const Sentiment = lazy(() => import('./components/pages/SentimentPage.jsx'));
const DemoFrame = lazy(() => import('./components/pages/DemoFrame.jsx'));
const NotFound = lazy(() => import('./components/pages/NotFound.jsx'));

const readTheme = () => {
  try { return localStorage.getItem('cur_theme') || 'dark'; } catch { return 'dark'; }
};

function App() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => { try { localStorage.setItem('cur_theme', theme); } catch {} }, [theme]);

  return(
  <>
    <Router>
      <div className={`container ${theme}`}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home theme={theme} setTheme={setTheme}/>} />
            <Route path="/about" element={<About theme={theme} setTheme={setTheme}/>} />
            <Route path="/battery" element={<Battery theme={theme} setTheme={setTheme}/>} />
            <Route path="/battery/preview" element={<DemoFrame url="https://batteryrul-app.streamlit.app/?embed=true" title="Battery RUL Predictor live demo" theme={theme} setTheme={setTheme}/>} />
            <Route path="/climate" element={<Climate theme={theme} setTheme={setTheme}/>} />
            <Route path="/climate/preview" element={<DemoFrame url="https://indonesia-rainfall-map.vercel.app/" title="Indonesia rainfall interactive map" theme={theme} setTheme={setTheme}/>} />
            <Route path="/sentiment" element={<Sentiment theme={theme} setTheme={setTheme}/>} />
            <Route path="/sentiment/preview" element={<DemoFrame url="https://sentiment-analysis-dion.streamlit.app/?embed=true" title="Sentiment Analysis live demo" theme={theme} setTheme={setTheme}/>} />
            <Route path="*" element={<NotFound theme={theme} setTheme={setTheme}/>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  </>)
}

export default App;
