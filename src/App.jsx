import React, { useEffect, useState } from 'react';
import NavBar from './components/navbar/NavBar.jsx';
import GradientMesh from './components/work/GradientMesh.jsx';
import ShortDecs from './components/work/ShortDesc.jsx';
import Projects from './components/project/Projects.jsx'
import Footer from './components/navbar/Footer.jsx';
import './App.css'

function App() {
  const cur_theme = localStorage.getItem('cur_theme');
  const [theme, setTheme] = useState(cur_theme ? cur_theme : 'dark');

  useEffect(() => { localStorage.setItem('cur_theme', theme) }, [theme]);

  return(
    <div className={`container ${theme}`}>
      <NavBar theme={theme} setTheme={setTheme}/>
      <GradientMesh theme={theme} setTheme={setTheme}/>
      <ShortDecs theme={theme} setTheme={setTheme}/>
      <Projects theme={theme} setTheme={setTheme}/>
      <Footer theme={theme} setTheme={setTheme}/>
    </div>
  )
}

export default App;