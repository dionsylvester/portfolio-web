import React from 'react';
import './NavBar.css';
import logo_dsw_light from '../../assets/DSW-black.png';
import logo_dsw_dark from '../../assets/DSW-white.png';
import logo_light from '../../assets/mode_light.png';
import logo_dark from '../../assets/mode_dark.png';

const NavBar = ({theme, setTheme}) => {
    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light')
    }

    return(
        <div className='bar'>
            <a href='/work/Home.jsx'><img src={theme == 'light' ? logo_dsw_light : logo_dsw_dark}  alt="Logo DSW" className='logo-dsw'/></a>
            <ul>
                <li href='/work/Home.jsx'>Work</li>
                <li href='/about/About.jsx'>About</li>
            </ul>
            <img onClick={() => {toggle_mode()}} src={theme == 'light' ? logo_light : logo_dark} alt="Switch to Dark mode" className='icon-mode'/>
        </div>
    )
}

export default NavBar;