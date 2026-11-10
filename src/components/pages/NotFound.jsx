import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import Pond from '../effects/Pond';
import Footer from '../navbar/Footer';

const NotFound = ({theme, setTheme}) => {
    const title = useLocation().pathname === '/moonride' ? 'Moonride!' : 'Page Not Found';

    useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

    return (<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <Pond theme={theme} title={title}/>
        <Footer />
    </>);
};

export default NotFound;