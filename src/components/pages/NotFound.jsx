import React from 'react';
import NavBar from '../navbar/NavBar';
import Galaxy from '../effects/Galaxy';
import Footer from '../navbar/Footer';
import { TextHover } from '../effects/TextHover';
import './NotFound.css'

const NotFound = ({theme, setTheme}) => {
    return (<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <div className='textmsg'>
                <TextHover text="404: NOT FOUND" />
            </div>
            <Galaxy 
                mouseRepulsion
                mouseInteraction
                density={1}
                glowIntensity={0.2}
                saturation={0}
                hueShift={100}
                twinkleIntensity={0.2}
                rotationSpeed={0.05}
                repulsionStrength={2}
                autoCenterRepulsion={0}
                starSpeed={0.33}
                speed={0.8}
            />
        </div>
        <Footer theme={theme} setTheme={setTheme}/>
    </>);
};

export default NotFound;