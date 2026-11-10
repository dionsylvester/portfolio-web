import React from 'react';
import NavBar from '../navbar/NavBar.jsx';
import FullDesc from '../work/FullDesc.jsx';
import Footer from '../navbar/Footer.jsx';
import './About.css'
import useScrollMemory from './useScrollMemory.js';

const About = ({theme, setTheme}) => {
    useScrollMemory('about-scroll');

    return (<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <FullDesc />
        <Footer />
    </>);
};

export default About;