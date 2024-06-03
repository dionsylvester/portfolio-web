import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import './Projects.css'
import carboss from '../../assets/carboss.png';
import finance_lover from '../../assets/finance_lover.png';
import seathediv from '../../assets/seathediv.png';
import summe from '../../assets/summe.png';

const items = [
    {
        id: 1,
        type: "APPLICATION",
        title: "Car Boss",
        img: carboss,
        desc: "2024 – Mobile App (concept) to Wishlist and Predict Car Price using ANN PSO",
        language: "Figma Jupyter-Notebook Python R",
    },
    {
        id: 2,
        type: "APPLICATION",
        title: "Finance Lover",
        img: finance_lover,
        desc: "2024 – Mobile App (concept) to Manage Wallets and Count Financial Planning",
        language: "Figma",
    },
    {
        id: 3,
        type: "WEBSITE",
        title: "Sea The Div",
        img: seathediv,
        desc: "2024 – Parallax Scrolling Website to Show The Other Side of The World",
        language: "VS-Code React CSS Framer-Motion",
    },
    {
        id: 4,
        type: "APPLICATION",
        title: "SumMe",
        img: summe,
        desc: "2023 – Mobile App to Summarize Long Paragraph Text TL;DR",
        language: "Figma Python"
    }
];

const Single = ({item}) =>{
    const ref = useRef();

    const { scrollYProgress } = useScroll({
        target: ref,
    });

    const y = useTransform(scrollYProgress, [0,1], [-100, 100]);

    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();

        const widthR = rect.width;
        const heightR = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPercent = mouseX / widthR - 0.5;
        const yPercent = mouseY / heightR - 0.5;

        xValue.set(xPercent);
        yValue.set(yPercent);
    }

    const xValue = useMotionValue(0);
    const yValue = useMotionValue(0);

    const mouseXSpring = useSpring(xValue);
    const mouseYSpring = useSpring(yValue);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);

    const handleMouseLeave = () => {
        xValue.set(0);
        yValue.set(0);
    }

    return(
        <section>
            <div className="item-container">
                <div className="wrapper">
                    <motion.div className="image-container" ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformOrigin: "center center"}}>
                        <img src={item.img} alt=""/>
                    </motion.div>
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