import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../navbar/NavBar.jsx';
import FullDesc from '../work/FullDesc.jsx';
import Footer from '../navbar/Footer.jsx';
import './About.css'

const About = ({theme, setTheme}) => {
    return (<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <FullDesc theme={theme} setTheme={setTheme}/>
        <Footer theme={theme} setTheme={setTheme}/>
    </>);
};

export default About;