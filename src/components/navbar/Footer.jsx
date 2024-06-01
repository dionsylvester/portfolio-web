import React from "react";
import logo_dsw_light from '../../assets/DSW-black.png';
import logo_dsw_dark from '../../assets/DSW-white.png';
import './Footer.css';

const Footer = ({theme}) => {
    return(<>
        <div className="footer">
            <div className="content-footer">
                <div className="content-link">
                    <div className="section-link section-one">
                        <img src={theme == 'light' ? logo_dsw_light : logo_dsw_dark} alt="Logo" />
                    </div>
                    <div className="section-link section-two">
                        <h4>MAIN</h4>
                        <a href="/"><p>Work</p></a>
                        <a href="/about"><p>About</p></a>
                    </div>
                    <div className="section-link section-three">
                        <h4>SOCIAL</h4>
                        <a href="mailto:“dionwime@gmail.com”"><p>Email ↗</p></a>
                        <a href="#"><p>Resume ↗</p></a>
                    </div>
                </div>
            </div>
            <div className='content-below'>
                <div className='copyright'>
                    <h3>&copy; {new Date().getFullYear()} Dionisius Sylvester Wime. All Rights Reserved.</h3>
                    <p>Designed & built by Dionisius Sylvester Wime with love and Caramel Macchiato (normal ice, less sugar).</p>
                </div>
            </div>
        </div>
    </>)
}

export default Footer;