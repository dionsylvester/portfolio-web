import React from "react";
import { Link } from "react-router-dom";
import ArrowUp from '../../icons/ArrowUp.jsx';
import LogoFull from '../../icons/LogoFull.jsx';
import './Footer.css';

const Footer = () => {
    return(<>
        <div className="footer">
            <div className="content-footer">
                <div className="content-link">
                    <div className="section-link section-one">
                        <LogoFull className="footer-logo" title="Logo" />
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
                            
                        <a href="mailto:dionwime@gmail.com" className="animation-link link-001">
                            <p>Email</p>
                            <ArrowUp />
                        </a>
                    </div>
                </div>
            </div>

            <div className='content-below'>
                <div className='copyright'>
                    <h3>&copy; {new Date().getFullYear()} Dionisius Sylvester Wime. All Rights Reserved.</h3>
                    <p>Designed & built by Dionisius Sylvester Wime with love and Caffe Latte (less ice, no sugar).</p>
                </div>
            </div>
        </div>
    </>);
}

export default Footer;