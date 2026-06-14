import React from 'react';
import './NavBar.css';
import { NavLink } from 'react-router-dom';
import logo_dsw_light from '../../assets/DSW-black.png';
import logo_dsw_dark from '../../assets/DSW-white.png';
import logo_light from '../../assets/mode_light.png';
import logo_dark from '../../assets/mode_dark.png';
import GitHub from '../../icons/github.jsx';
import Instagram from '../../icons/instagram.jsx';
import Linkedin from '../../icons/linkedin.jsx';
import Divider from '../../icons/divider.jsx';
import ThemeToggle from '../effects/ThemeToggle.jsx';


const NavBar = ({theme, setTheme}) => {
    const toggle_mode = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';

        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        document.startViewTransition(() => {
            setTheme(nextTheme);
        });
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
                <a href='/'><img src={theme == 'light' ? logo_dsw_light : logo_dsw_dark} alt="Logo DSW" className='logo-dsw'/></a>

                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-glass" : "nav-link"}> Work </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-glass" : "nav-link"} > About </NavLink>
                    </li>
                </ul>

                <ThemeToggle isDark={theme === 'dark'} onClick={toggle_mode} logoLight={logo_light} logoDark={logo_dark} 
                />
            </div>
        </>
    )
}

export default NavBar;