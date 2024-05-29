import React, { useEffect, useRef, useState } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion, useScroll, useTransform } from 'framer-motion';
import self_image from '../../assets/Dionisius-edited.png';
import './GradientMesh.css';

function GradientMesh(){
    const interBubbleRef = useRef(null);

    useEffect(() => {
        const interBubble = interBubbleRef.current;
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;

        const move = () => {
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            if (interBubble) {
                interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            }
            requestAnimationFrame(move);
        };

        const handleMouseMove = (event) => {
            tgX = event.clientX;
            tgY = event.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        move();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const [show, setShow] = useState(false);

    const showElement = () => {
        setShow(true);
    }

    const [typewriter] = useTypewriter({
        words: ['Software Developer', 'Programmer', 'Tech Enthusiast'],
        loop: {},
        typeSpeed: 100,
        deleteSpeed: 50,
        delaySpeed: 500,
    })

    const { scrollYProgress } = useScroll();
    const x = useTransform(scrollYProgress, [0, 1], [-1500, -600]);

    return (
        <div className="app-container">
            <div className="text-container">
                <button className="text-button" onClick={showElement}>Hello, I'm Dion.</button>
                {
                    show && (<>
                        <img className="self_img" src={self_image} alt="Self Image"/>
                        <div className="type-writer"><h1>{typewriter}<Cursor cursorStyle='|'/></h1></div>
                        {/* <motion.h1 className='title-scroll' style={{x}}>Dionisius Sylvester Wime –</motion.h1>
                        <motion.h1 className='title-scroll-2' style={{x}}>Dionisius Sylvester Wime –</motion.h1> */}
                    </>)
                }
            </div>
            <div className="gradient-bg">
                <svg xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>
                <div className="gradients-container">
                    <div className="g1"></div>
                    <div className="g2"></div>
                    <div className="g3"></div>
                    <div className="g4"></div>
                    <div className="g5"></div>
                    <div className="interactive" ref={interBubbleRef}></div>
                </div>
            </div>
        </div>
    );
}

export default GradientMesh;