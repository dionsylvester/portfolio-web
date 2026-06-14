import React, { useEffect, useState } from 'react';
import Home from './components/pages/Home.jsx';
import About from './components/pages/About.jsx';
import NotFound from './components/pages/NotFound.jsx';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const cur_theme = localStorage.getItem('cur_theme');
  const [theme, setTheme] = useState(cur_theme ? cur_theme : 'dark');

  useEffect(() => { localStorage.setItem('cur_theme', theme) }, [theme]);

  return(
  <>
    <Router>
      <div className={`container ${theme}`}>
        <Routes>
          <Route path="/" element={<Home theme={theme} setTheme={setTheme}/>} />
          <Route path="/about" element={<About theme={theme} setTheme={setTheme}/>} />
          <Route path="*" element={<NotFound theme={theme} setTheme={setTheme}/>} />
        </Routes>
      </div>
    </Router>
  </>)
}

export default App;