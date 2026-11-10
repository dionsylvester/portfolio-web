import React from 'react';
import NavBar from '../navbar/NavBar.jsx';
import Calligraphy from '../effects/Calligraphy.jsx';
import ShortDecs from '../work/ShortDesc.jsx';
import Projects from '../work/Projects.jsx'
import Footer from '../navbar/Footer.jsx';
import useScrollMemory from './useScrollMemory.js';

const Home = ({theme, setTheme}) => {
    useScrollMemory('work-scroll');

    return(<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <Calligraphy theme={theme} />
        <ShortDecs />
        <Projects />
        <Footer />
    </>)
}

export default Home;