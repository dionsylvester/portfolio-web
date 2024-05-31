import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import './Projects.css'
import gambar_satu from '../../assets/projects/test-foto.png';

const items = [
    {
        id: 1,
        type: "APPLICATION",
        title: "Car Boss",
        img: gambar_satu,
        desc: "2024 – Mobile App (concept) to Wishlist and Predict Car Price using ANN PSO",
        language: "Figma Jupyter-Notebook Python R",
    },
    {
        id: 2,
        type: "WEBSITE",
        title: "Sea The Div",
        img: gambar_satu,
        desc: "2024 – Parallax Scrolling Website to Show Must-Do Hobbies in Your Life",
        language: "VS-Code React CSS Framer-Motion",
    },
    {
        id: 3,
        type: "APPLICATION",
        title: "Finance Lover",
        img: gambar_satu,
        desc: "2024 – Mobile App (concept) to Manage Wallets and Count Financial Planning",
        language: "Figma",
    },
];

const Single = ({item}) =>{
    const ref = useRef();

    const { scrollYProgress } = useScroll({
        target: ref,
    });

    const y = useTransform(scrollYProgress, [0,1], [-100, 100]);

    return(
        <section>
            <div className="item-container">
                <div className="wrapper">
                    <div className="image-container" ref={ref}>
                        <img src={item.img} alt=""/>
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
    )
}

const Projects = () => {
    const ref = useRef(null);

    const [allViewed, setAllViewed] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset:["end end", "start start"],
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

    return(<>
        <div className="portfolio" ref={ref}>
            <div className={`progress ${allViewed ? 'hidden' : ''}`}>
                {!allViewed && <h1>Featured Projects</h1>}
                <motion.div style={{ scaleX }} className="progress-bar"></motion.div>
            </div>
            {items.map(item => (
                <Single item={item} key={item.id} />
            ))}
        </div>
    </>);
}

export default Projects;