import React from 'react';
import NavBar from '../navbar/NavBar.jsx';
import BatteryRUL from '../cases/Battery.jsx';
import Footer from '../navbar/Footer.jsx';
import useScrollMemory from './useScrollMemory.js';

const Battery = ({theme, setTheme}) => {
    useScrollMemory('battery-scroll');

    return(<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <BatteryRUL theme={theme} />
        <Footer />
    </>)
}

export default Battery;
