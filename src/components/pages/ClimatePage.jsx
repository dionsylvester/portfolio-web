import React from 'react';
import NavBar from '../navbar/NavBar.jsx';
import ClimateRainfall from '../cases/Climate.jsx';
import Footer from '../navbar/Footer.jsx';
import useScrollMemory from './useScrollMemory.js';

const Climate = ({theme, setTheme}) => {
    useScrollMemory('climate-scroll');

    return(<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <ClimateRainfall theme={theme} />
        <Footer />
    </>)
}

export default Climate;
