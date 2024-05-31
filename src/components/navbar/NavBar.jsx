import React from 'react';
import './NavBar.css';
import logo_dsw_light from '../../assets/DSW-black.png';
import logo_dsw_dark from '../../assets/DSW-white.png';
import logo_light from '../../assets/mode_light.png';
import logo_dark from '../../assets/mode_dark.png';
import GitHub from '../../icons/github.jsx';
import Instagram from '../../icons/instagram.jsx';
import Linkedin from '../../icons/linkedin.jsx';
import Divider from '../../icons/divider.jsx';

const NavBar = ({theme, setTheme}) => {
    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }

    return(
        <>
            <div className='bar'>
                <div className="social-icon">
                    <a href="https://github.com/dionsylvester/"><GitHub /></a>
                    <a href="https://www.instagram.com/dionsylvester/"><Instagram /></a>
                    <a href="https://www.linkedin.com/in/dionsylvester/"><Linkedin /></a>
                    <Divider />
                </div>
                <div className="name-icon">
                    <p>Dionisius Sylvester Wime</p>
                    <Divider />
                </div>
                <a href='/work/Home.jsx'><img src={theme == 'light' ? logo_dsw_light : logo_dsw_dark} alt="Logo DSW" className='logo-dsw'/></a>
                <ul>
                    <li href='/work/Home.jsx'>Work</li>
                    <li href='/about/About.jsx'>About</li>
                </ul>
                <img onClick={() => {toggle_mode()}} src={theme == 'light' ? logo_light : logo_dark} alt="Switch to Dark mode" className='icon-mode'/>
            </div>
        </>
    )
}

export default NavBar;