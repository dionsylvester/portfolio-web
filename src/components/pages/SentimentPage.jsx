import React from 'react';
import NavBar from '../navbar/NavBar.jsx';
import SentimentLLM from '../cases/Sentiment.jsx';
import Footer from '../navbar/Footer.jsx';
import useScrollMemory from './useScrollMemory.js';

const Sentiment = ({theme, setTheme}) => {
    useScrollMemory('sentiment-scroll');

    return(<>
        <NavBar theme={theme} setTheme={setTheme}/>
        <SentimentLLM theme={theme} />
        <Footer />
    </>)
}

export default Sentiment;
