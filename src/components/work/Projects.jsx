import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import './Projects.css'
import battery from '../../assets/projects/battery.webp';
import climate from '../../assets/projects/climate.webp';
import sentiment from '../../assets/projects/sentiment.webp';

const items = [
    {
        id: 6,
        type: "Web Application",
        title: "Indonesia Rainfall Map",
        img: climate,
        framework: "Python PyTorch PyTorch_Geometric xarray React D3 Vercel",
        path: "/climate",
    },
    {
        id: 1,
        type: "Web Application",
        title: "LLM Sentiment Analysis",
        img: sentiment,
        framework: "Python scikit-learn PyTorch Hugging_Face Ollama Groq Pydantic Streamlit",
        path: "/sentiment",
    },
    {
        id: 2,
        type: "Web Application",
        title: "Battery Health Prediction",
        img: battery,
        framework: "Python Scikit-learn Pandas FastAPI Docker Streamlit",
        path: "/battery",
    },
    {
        id: 5,
        type: "Website",
        title: "Moonride",
        img: null,
        framework: "Error 404",
        path: "/moonride",
        hidden: true,
    }
];

const GEM = items.find(item => item.hidden).id;
const CELL_W = 280, CELL_H = 210, PAD = 24;

const slot = (i, windows, { w, h }) => {
    if (windows) {
        const rows = Math.max(1, Math.floor((h - PAD) / CELL_H));
        return { left: PAD + Math.floor(i / rows) * CELL_W, top: PAD + (i % rows) * CELL_H };
    }
    const cols = Math.max(1, Math.floor((w - PAD) / CELL_W));
    return { right: PAD + (i % cols) * CELL_W, top: PAD + Math.floor(i / cols) * CELL_H };
};

const hhmm = (d) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;

const Clock = ({ windows }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 10000);
        return () => clearInterval(id);
    }, []);

    if (windows) {
        return (
            <div className="desk-clock">
                <span>{hhmm(now)}</span>
                <span>{now.toLocaleDateString()}</span>
            </div>
        );
    }
    return (
        <div className="desk-clock">
            {now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} {hhmm(now)}
        </div>
    );
};

const Projects = () => {
    const deskRef = useRef(null);
    const navigate = useNavigate();
    const [windows] = useState(() => new Date().getMinutes() % 2 === 1);
    const [selected, setSelected] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [order, setOrder] = useState(() => items.map(item => item.id));
    const [dragged, setDragged] = useState(() => new Set());
    const [tip, setTip] = useState({ right: false, up: false });
    const [size, setSize] = useState({ w: 0, h: 0 });

    useLayoutEffect(() => {
        const desk = deskRef.current;
        const measure = () => setSize({ w: desk.clientWidth, h: desk.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(desk);
        return () => ro.disconnect();
    }, []);
    const gemShown = items.every(item => item.hidden || dragged.has(item.id));

    const onDragStart = (id) => {
        setDragging(true);
        const reveal = !gemShown && items.every(item => item.hidden || item.id === id || dragged.has(item.id));
        setOrder(o => {
            const rest = o.filter(x => x !== id && !(reveal && x === GEM));
            return reveal ? [...rest, GEM, id] : [...rest, id];
        });
        setDragged(s => new Set(s).add(id));
    };

    const placeTip = (e) => {
        const r = e.currentTarget.getBoundingClientRect(), d = deskRef.current.getBoundingClientRect();
        setTip({ right: r.left + r.width / 2 > d.left + d.width / 2, up: r.top + r.height / 2 > d.top + d.height / 2 });
    };

    const menu = (
        <div className="desk-menu">
            <p className="desk-menu-title">Dionisius Sylvester Wime</p>
            {items.filter(item => !item.hidden).map(item => item.path
                ? <Link key={item.id} to={item.path} state={{ top: true }}>{item.title}</Link>
                : <p key={item.id}>{item.title}</p>)}
        </div>
    );

    return (
        <section className="desktop-section">
            <div className={`desktop ${windows ? 'os-windows' : 'os-mac'}`} data-dark-bg>
                {!windows && (
                    <div className="desk-menubar">
                        <button className="desk-start" onClick={() => setMenuOpen(o => !o)}>Dion</button>
                        <Clock windows={false} />
                        {menuOpen && menu}
                    </div>
                )}

                <div
                    className={`desk-area ${dragging ? 'dragging' : ''}`}
                    ref={deskRef}
                    onPointerDown={(e) => {
                        if (e.target === e.currentTarget) { setSelected(null); setMenuOpen(false); }
                    }}
                >
                    {items.filter(item => !item.hidden || gemShown).map((item, i) => (
                        <motion.div
                            key={item.id}
                            className={`desk-icon ${item.hidden ? 'gem' : ''} ${selected === item.id ? 'selected' : ''}`}
                            style={{ ...slot(i, windows, size), zIndex: order.indexOf(item.id) + 1 }}
                            tabIndex={0}
                            drag
                            dragConstraints={deskRef}
                            dragMomentum={false}
                            dragElastic={0}
                            initial={item.hidden ? { opacity: 0, scale: 0.9 } : false}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            onPointerDown={() => {
                                setSelected(item.id);
                                setOrder(o => [...o.filter(x => x !== item.id), item.id]);
                            }}
                            onDoubleClick={() => item.path && navigate(item.path, { state: { top: true } })}
                            onKeyDown={(e) => e.key === 'Enter' && item.path && navigate(item.path, { state: { top: true } })}
                            onPointerEnter={placeTip}
                            onFocus={placeTip}
                            onDragStart={() => onDragStart(item.id)}
                            onDragEnd={() => setDragging(false)}
                        >
                            {item.img
                                ? <img src={item.img} alt="" draggable={false} />
                                : <div className="desk-thumb-empty">?</div>}
                            <span className="desk-label">{item.title}</span>
                            <div className={`desk-tip ${tip.right ? 'tip-right' : ''} ${tip.up ? 'tip-up' : ''}`} role="tooltip">
                                <p>Title: {item.title}</p>
                                <p>Type: {item.type}</p>
                                <p>Framework: {item.framework}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {windows && (
                    <div className="desk-taskbar">
                        <button className="desk-start" onClick={() => setMenuOpen(o => !o)}>Start</button>
                        <Clock windows />
                        {menuOpen && menu}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;