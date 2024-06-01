import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../navbar/NavBar';
import './NotFound.css'

const NotFound = ({theme, setTheme}) => {
    return (<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <div className='textmsg'>
            <h1>404: NOT FOUND</h1>
        </div>
    </>);
};

export default NotFound;