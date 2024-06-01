import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../navbar/NavBar.jsx';
import './About.css'

const About = ({theme, setTheme}) => {
    return (<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <div className='textmsg'>
            <h1>About Me</h1>
        </div>
    </>);
};

export default About;