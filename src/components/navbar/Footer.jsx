import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo_dsw_light from '../../assets/DSW-black.png';
import logo_dsw_dark from '../../assets/DSW-white.png';
import resume from '../../assets/projects/resume.pdf';
import ArrowUp from '../../icons/ArrowUp.jsx';
import './Footer.css';

const Footer = ({theme}) => {
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const resumePdf = resume;

    return(<>
        <div className="footer">
            <div className="content-footer">
                <div className="content-link">
                    <div className="section-link section-one">
                        <img src={theme == 'light' ? logo_dsw_light : logo_dsw_dark} alt="Logo" />
                    </div>
                    <div className="section-link section-two">
                        <h4>MAIN</h4>
                        <Link to="/" className="animation-link link-001">
                            <p>Work</p>
                            <ArrowUp />
                        </Link>
                        <Link to="/about" className="animation-link link-002">
                            <p>About</p>
                            <ArrowUp />
                        </Link>
                    </div>
                    
                    <div className="section-link section-three">
                        <h4>SOCIAL</h4>
                            
                        <a href="mailto:dionwime@gmail.com" target="_blank" rel="noopener noreferrer" className="animation-link link-001">
                            <p>Email</p>
                            <ArrowUp />
                        </a>
                            
                        <button 
                            onClick={() => setIsResumeOpen(true)} 
                            className="animation-link link-002 footer-resume-btn"
                        >
                            <p>Resume</p>
                            <ArrowUp />
                        </button>
                    </div>
                </div>
            </div>

            <div className='content-below'>
                <div className='copyright'>
                    <h3>&copy; {new Date().getFullYear()} Dionisius Sylvester Wime. All Rights Reserved.</h3>
                    <p>Designed & built by Dionisius Sylvester Wime with love and Caffe Latte (less ice, no sugar).</p>
                </div>
            </div>

            <AnimatePresence>
                {isResumeOpen && (
                    <div className="pdf-modal-overlay">
                        <motion.div 
                            className="pdf-modal-backdrop"
                            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            onClick={() => setIsResumeOpen(false)}
                        />

                        <motion.div 
                            className="pdf-modal-popup"
                            initial={{
                                opacity: 0,
                                filter: 'blur(4px)',
                                transform: 'perspective(500px) rotateX(-20deg) scale(0.8)',
                            }}
                            animate={{
                                opacity: 1,
                                filter: 'blur(0px)',
                                transform: 'perspective(500px) rotateX(0deg) scale(1)',
                            }}
                            exit={{
                                opacity: 0,
                                filter: 'blur(4px)',
                                transform: 'perspective(500px) rotateX(-20deg) scale(0.8)',
                            }}
                            transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                        >
                            <motion.button 
                                className="pdf-modal-close-btn"
                                onClick={() => setIsResumeOpen(false)}
                                aria-label="Close Dialog"
                                animate={{ rotate: [0, 360] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    repeatDelay: 2,
                                    ease: "easeInOut"
                                }}
                            >
                                X
                            </motion.button>

                            <div className="pdf-viewer-container">
                                <iframe 
                                    src={`${resumePdf}#toolbar=0`} 
                                    title="Resume PDF Viewer"
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </>);
}

export default Footer;