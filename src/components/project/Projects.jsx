import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import './Projects.css'
import gambar_satu from '../../assets/projects/test-foto.png';

const items = [
    {
        id: 1,
        type: "APPLICATION",
        title: "Carz",
        img: gambar_satu,
        desc: "2024 – Mobile App (concept) to Predict Car Price using ANN PSO",
        language: "Figma Jupyter-Notebook Python R",
    },
    {
        id: 2,
        type: "WEBSITE",
        title: "VhoTel",
        img: gambar_satu,
        desc: "2023 – Final project for Human and Computer Interaction LAB course",
        language: "HTML CSS JavaScript",
    },
];

const Single = ({item}) =>{
    const ref = useRef();

    const { scrollYProgress } = useScroll({
        target: ref,
        // offset: ["start start", "end start"],
    });

    // const y = useTransform(scrollYProgress, [0,1], ["0%", "-300%"]);
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


const Projects = ({theme, setTheme}) => {
    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }

    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset:["end end", "start start"],
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    return(<>
        <div className="portfolio" ref={ref}>
            <div className="progress">
                <h1>Featured Projects</h1>
                <motion.div style={{ scaleX }} className="progress-bar"></motion.div>
            </div>
            {items.map(item=>(
                <Single item={item} key={item.id} />
            ))}
        </div>
    </>);
    
}

export default Projects;