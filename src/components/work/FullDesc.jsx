import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import alpha from "../../assets/illust/alpha.webp";
import bravo from "../../assets/illust/bravo.webp";
import charlie from "../../assets/illust/charlie.webp";
import delta from "../../assets/illust/delta.webp";
import echo from "../../assets/illust/echo.webp";
import "./FullDesc.css";

const DAILY = ['#Castella', '#Chestnutz', '#Milkz', '#Menuz'];
const dailyCode = (d = new Date()) => {
    const days = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 9, 26)) / 864e5);
    const n = DAILY.length;
    return DAILY[((days % n) + n) % n];
};

const imagesData = [
    { src: alpha, alt: "Illust 1", code: "#01" },
    { src: bravo, alt: "Illust 2", code: "#02" },
    { src: charlie, alt: "Illust 3", code: "#03" },
    { src: delta, alt: "Illust 4", code: "#04" },
    { src: echo, alt: "Illust 5", code: dailyCode() },
];

const DebugPanel = ({ zoneRef }) => {
    const [clickCount, setClickCount] = useState(0);
    const [keyPressed, setKeyPressed] = useState("None");
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const zone = zoneRef.current;
        const onKey = (e) => setKeyPressed(e.key);
        const onMove = (e) => setCoords({ x: e.clientX, y: e.clientY });
        const onClick = () => setClickCount((prev) => prev + 1);
        window.addEventListener("keydown", onKey);
        zone.addEventListener("mousemove", onMove);
        zone.addEventListener("click", onClick);
        return () => {
            window.removeEventListener("keydown", onKey);
            zone.removeEventListener("mousemove", onMove);
            zone.removeEventListener("click", onClick);
        };
    }, [zoneRef]);

    return (
        <div className="debug-bottom-zone">
            <div className="raw-debug-code">
            <span className="bracket">&#123;</span>
            <div className="code-block-inner">
                <div><span className="key">keyPressed</span>: <span className="value">"{keyPressed}"</span>,</div>
                <div><span className="key">clicks</span>: <span className="value">{clickCount}</span>,</div>
                <div><span className="key">mouseX</span>: <span className="value">{coords.x}</span>,</div>
                <div><span className="key">mouseY</span>: <span className="value">{coords.y}</span></div>
            </div>
            <span className="bracket">&#125;</span>
            </div>
        </div>
    );
};

const FullDesc = () => {
    const zoneRef = useRef(null);
    const [activeImage, setActiveImage] = useState(null);

    return (
        <div className="fulldesc-container" ref={zoneRef}>
        <div className="container-center-zone">
            <div className="gallery-wrapper">
            <div className="gallery-flex">
                {imagesData.map((image, index) => (
                <motion.div
                    key={index}
                    className="gallery-item"
                    animate={{
                    width: activeImage === index ? "420px" : "180px",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onHoverStart={() => setActiveImage(index)}
                    onHoverEnd={() => setActiveImage(null)}
                >
                    <AnimatePresence>
                    {activeImage === index && (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="gallery-overlay"
                        />
                    )}
                    </AnimatePresence>

                    <AnimatePresence>
                    {activeImage === index && (
                        <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="gallery-code-label"
                        >
                        <p>{image.code}</p>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <img src={image.src} alt={image.alt} className="gallery-img" />
                </motion.div>
                ))}
            </div>
            </div>
        </div>

        <DebugPanel zoneRef={zoneRef} />
        </div>
    );
};

export default FullDesc;