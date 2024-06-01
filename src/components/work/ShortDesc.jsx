import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ShortDesc.css';

const ShortDesc = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    const backgroundYone = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const backgroundYtwo = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);
    const backgroundYthree = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const backgroundYfour = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "250%"]);

    return(
    <>
        <div className='parallax-scroll' ref={ref}>
            <motion.p style={{ y: textY }} className='text-description'>I am currently a sophomore computer science major at Bina Nusantara University — Developing digital products through code, story, and passion.</motion.p>
            <motion.div style={{ y: backgroundYone }} className='layer_one'/>
            <motion.div style={{ y: backgroundYtwo }} className='layer_two' />
            <motion.div style={{ y: backgroundYthree }} className='layer_three'/>
            <motion.div style={{ y: backgroundYfour }} className='layer_four'/>
        </div>
    </>)
}

export default ShortDesc;