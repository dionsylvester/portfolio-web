import React from 'react';
import NavBar from '../navbar/NavBar.jsx';
import GradientMesh from '../work/GradientMesh.jsx';
import ShortDecs from '../work/ShortDesc.jsx';
import Projects from '../project/Projects.jsx'
import Footer from '../navbar/Footer.jsx';

const Home = ({theme, setTheme}) => {
    return(<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <GradientMesh theme={theme} setTheme={setTheme}/>
        <ShortDecs theme={theme} setTheme={setTheme}/>
        <Projects theme={theme} setTheme={setTheme}/>
        <Footer theme={theme} setTheme={setTheme}/>
    </>)
}

export default Home;