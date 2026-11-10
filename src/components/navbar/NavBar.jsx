import React, { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import './NavBar.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo_light from '../../assets/icons/mode_light.png';
import logo_dark from '../../assets/icons/mode_dark.png';
import GitHub from '../../icons/github.jsx';
import Instagram from '../../icons/instagram.jsx';
import Linkedin from '../../icons/linkedin.jsx';
import Divider from '../../icons/divider.jsx';
import LogoMark from '../../icons/LogoMark.jsx';
import ThemeToggle from '../effects/ThemeToggle.jsx';

const CASE_STUDIES = ['/battery', '/battery/preview', '/climate', '/climate/preview', '/sentiment', '/sentiment/preview'];


const NavBar = ({theme, setTheme}) => {
    const { pathname } = useLocation();
    const socialRef = useRef(null);
    const nameRef = useRef(null);

    useEffect(() => {
        let raf = 0;
        const check = () => {
            raf = 0;
            for (const rail of [socialRef.current, nameRef.current]) {
                const r = rail.getBoundingClientRect();
                const behind = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).find(e => !e.closest('.bar'));
                rail.classList.toggle('on-dark', !!behind?.closest('[data-dark-bg]'));
            }
        };
        const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
        check();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, []);

    const toggle_mode = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';

        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        document.startViewTransition(() => {
            flushSync(() => setTheme(nextTheme));
        });
    }

    return(
        <>
            <div className='bar'>
                <div className="social-icon" ref={socialRef}>
                    <a href="https://github.com/dionsylvester/"><GitHub /></a>
                    <a href="https://www.instagram.com/dionsylvester/"><Instagram /></a>
                    <a href="https://www.linkedin.com/in/dionsylvester/"><Linkedin /></a>
                    <Divider />
                </div>
                <div className="name-icon" ref={nameRef}>
                    <p>Dionisius Sylvester Wime</p>
                    <Divider />
                </div>
                <Link to='/' state={{ top: true }}><LogoMark className='logo-dsw' title="Logo DSW" /></Link>

                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive || CASE_STUDIES.includes(pathname) ? "nav-link active-glass" : "nav-link"}> Work </NavLink>
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