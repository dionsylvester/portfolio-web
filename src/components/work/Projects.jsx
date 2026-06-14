import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import ProgressiveBlur from "../effects/ProgressiveBlur.jsx";
import BorderGlow from "../effects/BorderGlow.jsx";
import './Projects.css'
import sentiment_analysis from '../../assets/projects/sentiment_analysis.webp';
import battery_rul from '../../assets/projects/battery_rul.webp';
import jejaksinema from '../../assets/projects/jejaksinema.webp';
import seathediv from '../../assets/projects/seathediv.webp';

const items = [
    {
        id: 1,
        type: "WEB APPLICATION",
        title: "Sentiment Analysis",
        img: sentiment_analysis,
        desc: "2026 – Interactive Web Applciation to Classify Text Sentiment",
        language: "Streamlit Python",
    },
    {
        id: 2,
        type: "WEB APPLICATION",
        title: "Battery RUL",
        img: battery_rul,
        desc: "2025 – Interactive Web Application to Estimate Battery RUL using Gradient Boosting",
        language: "Streamlit Python Scikit-learn",
    },
    {
        id: 3,
        type: "FULLSTACK WEB",
        title: "JejakSinema",
        img: jejaksinema,
        desc: "2024 – Dynamic Web Platform to Track and Review Indonesian Movies",
        language: "React Node.js MySQL",
    },
    {
        id: 4,
        type: "WEBSITE",
        title: "Sea The Div",
        img: seathediv,
        desc: "2024 – Parallax Scrolling Website to Show The Other Side of The World",
        language: "Vercel React CSS Framer-Motion",
    }
];

const Single = ({ item }) => {
    const ref = useRef();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-200, 180]);

    return (
        <section ref={ref}>
            <div className="item-container">
                <div className="wrapper">
                    <div className="image-container">
                        <BorderGlow
                            edgeSensitivity={30}
                            glowColor="40 80 80"
                            backgroundColor="transparent"
                            borderRadius={28}
                            glowRadius={40}
                            glowIntensity={1}
                            coneSpread={25}
                            animated={false}
                            colors={['#c084fc', '#f472b6', '#38bdf8']}
                        >
                            <img src={item.img} alt={item.title} />
                        </BorderGlow>
                    </div>
                    
                    <motion.div className="text-project" style={{ y }}>
                        <h3>{item.type}</h3>
                        <h2>{item.title}</h2>
                        <p>{item.desc}</p>
                        <p className="type-language">{item.language}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Projects = () => {
    const ref = useRef(null);
    const [allViewed, setAllViewed] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["end end", "start start"],
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((value) => {
            setAllViewed(value === 0);
        });

        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <>
            <div className="portfolio" ref={ref}>
                <ProgressiveBlur position="top" height="250px" blurAmount="6px" />
                <ProgressiveBlur position="bottom" height="100px" blurAmount="2px" />

                <div className={`progress ${allViewed ? 'hidden' : ''}`}>
                    {!allViewed && <h1>Featured Projects</h1>}
                    <motion.div style={{ scaleX }} className="progress-bar"></motion.div>
                </div>
                {items.map(item => (
                    <Single item={item} key={item.id} />
                ))}
            </div>
        </>
    );
};

export default Projects;