import React from 'react';
import NavBar from '../navbar/NavBar.jsx';

const About = ({theme, setTheme}) => {
    return(<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <h1>ABOUT PAGE</h1>
    </>)
}

export default About;