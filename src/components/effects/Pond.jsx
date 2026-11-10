import React, { useEffect, useRef, useState } from 'react';
import './Pond.css';

const SCALE = 2;
const MAX_CHARS = 15;
const DRIFT = 15;
const SINK_AT = 20;
const SINK_AT_RIDDEN = 30;
const SINK_FOR = 1;
const LOTUS_V0 = 2 * 250 / DRIFT;
const HYACINTH_SPEED = 8;
const SPEED = { swan: 26, duck: 38, mandarin: 34, heron: 15 };
const HIT = 24;
const CURRENTS = [-3 * Math.PI / 4, 3 * Math.PI / 4, -Math.PI / 4, Math.PI / 4];
const WOBBLE_X = 0.4, WOBBLE_Y = 0.275;

const COLORS = {
    light: { top: '#87c0c8', bottom: '#6fa0bd', text: '#24395f' },
    dark: { top: '#344f88', bottom: '#24395f', text: '#c3dbe5' },
};

const BIRDS = {
    swan: {
        anchor: [33, 31],
        body: <>
            <ellipse cx="22" cy="33" rx="15" ry="8" fill="#fffaf1" />
            <path d="M14 31 Q22 25 30 32" stroke="#c3dbe5" strokeWidth="2" fill="none" />
        </>,
        head: <>
            <path d="M33 31 Q39 22 35 15 Q33 9 37 8" stroke="#fffaf1" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="37" cy="9" r="3.5" fill="#fffaf1" />
            <path d="M40 8 L45 10 L40 11 Z" fill="#b5803f" />
            <circle cx="37.6" cy="8.4" r="0.9" fill="#1c1c1c" />
        </>,
    },
    duck: {
        anchor: [32, 30],
        body: <>
            <path d="M10 32 L5 27 L12 30 Z" fill="#8b6635" />
            <ellipse cx="22" cy="34" rx="13" ry="7" fill="#8b6635" />
            <ellipse cx="20" cy="33" rx="7" ry="4" fill="#683f10" />
        </>,
        head: <>
            <rect x="29" y="25" width="6" height="6" rx="2" fill="#fffaf1" />
            <circle cx="33" cy="22" r="6" fill="#3f5435" />
            <path d="M38 21 L44 23 L38 25 Z" fill="#d1b06f" />
            <circle cx="34" cy="20.5" r="1" fill="#1c1c1c" />
        </>,
    },
    mandarin: {
        anchor: [33, 28],
        body: <>
            <path d="M10 32 L5 28 L12 30 Z" fill="#67795f" />
            <ellipse cx="22" cy="34" rx="13" ry="7" fill="#b38040" />
            <path d="M17 30 L22 21 L26 30 Z" fill="#d0b06e" />
            <circle cx="31" cy="32" r="5" fill="#5d2339" />
        </>,
        head: <>
            <path d="M28 20 L23 25 L29 25 Z" fill="#b38040" />
            <circle cx="33" cy="22" r="6" fill="#3d5033" />
            <path d="M29 20 Q34 18 39 21" stroke="#fffaf1" strokeWidth="2.5" fill="none" />
            <path d="M38 22 L43 24 L38 26 Z" fill="#c26259" />
            <circle cx="34.5" cy="22" r="1" fill="#1c1c1c" />
        </>,
    },
    heron: {
        anchor: [29, 23],
        body: <>
            <ellipse cx="22" cy="43" rx="8" ry="1.5" stroke="#fffaf1" strokeOpacity="0.6" fill="none" />
            <path d="M20 31 L19 42 M24 31 L25 42" stroke="#67795f" strokeWidth="1.5" />
            <ellipse cx="22" cy="26" rx="10" ry="6" fill="#c2dae4" transform="rotate(-15 22 26)" />
            <ellipse cx="20" cy="27" rx="8" ry="4" fill="#576784" transform="rotate(-15 20 27)" />
        </>,
        head: <>
            <path d="M29 23 Q35 16 31 11 Q29 7 33 6" stroke="#c2dae4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M31 5 L26 3" stroke="#253b6d" strokeWidth="1.5" />
            <circle cx="33" cy="6" r="3" fill="#c2dae4" />
            <path d="M35 5.5 L44 7 L35 8 Z" fill="#d0b06e" />
            <circle cx="33.6" cy="5.6" r="0.8" fill="#1c1c1c" />
        </>,
    },
};

const Sprite = ({ kind, head }) => {
    if (kind === 'lotus') {
        return (
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 26 L41.4 21.3 A18 18 0 1 0 41.4 30.7 Z" fill="#557050" />
                <g transform="translate(22 24)">
                    {[0, 60, 120, 180, 240, 300].map(a => (
                        <ellipse key={a} rx="4" ry="9" cy="-6" transform={`rotate(${a})`} fill="#c9768a" />
                    ))}
                    <circle r="4" fill="#d1b06f" />
                </g>
            </svg>
        );
    }
    if (kind === 'hyacinth') {
        return (
            <svg viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="15" cy="31" rx="9" ry="6" fill="#648d47" transform="rotate(-20 15 31)" />
                <ellipse cx="33" cy="31" rx="9" ry="6" fill="#648d47" transform="rotate(20 33 31)" />
                <ellipse cx="24" cy="35" rx="10" ry="6" fill="#78a44e" />
                <circle cx="24" cy="17" r="3.5" fill="#84bec6" />
                <circle cx="20" cy="21" r="3.5" fill="#84bec6" />
                <circle cx="28" cy="21" r="3.5" fill="#84bec6" />
                <circle cx="24" cy="25" r="3.5" fill="#84bec6" />
                <circle cx="24" cy="21" r="2" fill="#4665a2" />
            </svg>
        );
    }
    const b = BIRDS[kind], h = BIRDS[head || kind];
    return (
        <svg viewBox="0 0 48 48" overflow="visible" aria-hidden="true">
            {b.body}
            <g transform={`translate(${b.anchor[0] - h.anchor[0]} ${b.anchor[1] - h.anchor[1]})`}>{h.head}</g>
        </svg>
    );
};

const TOOLS = [
    { kind: 'lotus', latin: 'Nymphaea' },
    { kind: 'hyacinth', latin: 'Pontederia' },
    { kind: 'swan', latin: 'Cygnus' },
    { kind: 'duck', latin: 'Anas' },
    { kind: 'mandarin', latin: 'Aix' },
    { kind: 'heron', latin: 'Ardea' },
];
const DRIFTERS = ['lotus', 'hyacinth'];

const Pond = ({ theme, title }) => {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const apiRef = useRef(null);
    const toolRef = useRef(null);
    const charsRef = useRef(new Map());
    const [current] = useState(() => CURRENTS[Math.floor(Math.random() * CURRENTS.length)]);
    const [tool, setTool] = useState(null);
    const [chars, setChars] = useState([]);
    toolRef.current = tool;

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const tex = document.createElement('canvas');
        const tctx = tex.getContext('2d', { willReadFrequently: true });
        const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w, h, cur, prev, texBuf, img, out, wobX, wobY, raf, last = performance.now(), nextDrop = 0, pressed = false, visible = true;

        const buildTexture = () => {
            const c = COLORS[apiRef.current.theme] || COLORS.light;
            tex.width = w; tex.height = h;
            const g = tctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, c.top);
            g.addColorStop(1, c.bottom);
            tctx.fillStyle = g;
            tctx.fillRect(0, 0, w, h);
            tctx.fillStyle = c.text;
            tctx.globalAlpha = 0.85;
            tctx.font = `bold ${Math.round(w * 0.08)}px Helvetica, Arial, sans-serif`;
            tctx.textAlign = 'center';
            tctx.textBaseline = 'middle';
            tctx.fillText(apiRef.current.title, w / 2, h / 2);
            tctx.globalAlpha = 1;
            texBuf = new Uint32Array(tctx.getImageData(0, 0, w, h).data.buffer);
            out.set(texBuf);
        };

        const init = () => {
            w = Math.max(3, Math.ceil(wrap.clientWidth / SCALE));
            h = Math.max(3, Math.ceil(wrap.clientHeight / SCALE));
            canvas.width = w; canvas.height = h;
            cur = new Float32Array(w * h);
            prev = new Float32Array(w * h);
            wobX = new Float32Array(h);
            wobY = new Float32Array(w);
            img = ctx.createImageData(w, h);
            out = new Uint32Array(img.data.buffer);
            buildTexture();
        };

        const drop = (cx, cy, r, strength) => {
            const x0 = cx / SCALE, y0 = cy / SCALE;
            for (let y = Math.max(1, Math.floor(y0 - r)); y < Math.min(h - 1, y0 + r); y++) {
                for (let x = Math.max(1, Math.floor(x0 - r)); x < Math.min(w - 1, x0 + r); x++) {
                    const d = Math.hypot(x - x0, y - y0);
                    if (d < r) cur[y * w + x] += strength * (1 - d / r);
                }
            }
        };

        const step = () => {
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const i = y * w + x;
                    prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) / 2 - prev[i]) * 0.985;
                }
            }
            const t = prev; prev = cur; cur = t;
        };

        const render = (now) => {
            const t = now / 1000;
            if (!still) {
                for (let y = 0; y < h; y++) wobX[y] = Math.sin(y * 0.09 + t * 1.6) * WOBBLE_X;
                for (let x = 0; x < w; x++) wobY[x] = Math.cos(x * 0.07 + t * 1.3) * WOBBLE_Y;
            }
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const i = y * w + x;
                    const dx = cur[i - 1] - cur[i + 1], dy = cur[i - w] - cur[i + w];
                    const fx = Math.min(w - 1.001, Math.max(0, x + dx * 0.06 + wobX[y]));
                    const fy = Math.min(h - 1.001, Math.max(0, y + dy * 0.06 + wobY[x]));
                    const x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0;
                    const j = y0 * w + x0;
                    const c00 = texBuf[j], c10 = texBuf[j + 1], c01 = texBuf[j + w], c11 = texBuf[j + w + 1];
                    let r = 0, g = 0, b = 0;
                    for (let s = 0; s < 24; s += 8) {
                        const top = ((c00 >> s) & 255) + (((c10 >> s) & 255) - ((c00 >> s) & 255)) * ax;
                        const bot = ((c01 >> s) & 255) + (((c11 >> s) & 255) - ((c01 >> s) & 255)) * ax;
                        const v = top + (bot - top) * ay;
                        if (s === 0) r = v; else if (s === 8) g = v; else b = v;
                    }
                    if (Math.abs(dx) + Math.abs(dy) > 40) {
                        const c2 = texBuf[Math.min(h - 1, Math.max(0, Math.round(fy + dy * 0.06))) * w + Math.min(w - 1, Math.max(0, Math.round(fx + dx * 0.06)))];
                        r = (r + (c2 & 255)) / 2; g = (g + ((c2 >> 8) & 255)) / 2; b = (b + ((c2 >> 16) & 255)) / 2;
                    }
                    const light = dx * 0.12;
                    r = Math.min(255, Math.max(0, r + light));
                    g = Math.min(255, Math.max(0, g + light));
                    b = Math.min(255, Math.max(0, b + light));
                    out[i] = (255 << 24) | (b << 16) | (g << 8) | r;
                }
            }
            ctx.putImageData(img, 0, 0);
        };

        const startSink = (ch, now) => {
            ch.sinkT = now;
            drop(ch.x, ch.y, 4, 300);
            const rider = ch.rider && charsRef.current.get(ch.rider);
            if (rider) { rider.on = null; rider.a = Math.random() * Math.PI * 2; }
            ch.rider = null;
        };

        const moveChars = (now, dt) => {
            const W = wrap.clientWidth, H = wrap.clientHeight;
            const map = charsRef.current;
            for (const [id, ch] of map) {
                const age = (now - ch.born) / 1000;
                let speed = SPEED[ch.kind] || 0, scale = ch.big ? 1.5 : 1, opacity = 1;

                if (ch.on) {
                    const plant = map.get(ch.on);
                    if (plant) { ch.x = plant.x; ch.y = plant.y - 10; }
                    else ch.on = null;
                    speed = 0;
                } else if (ch.kind === 'lotus') {
                    speed = LOTUS_V0 * Math.max(0, 1 - age / DRIFT);
                    if (!ch.sinkT && age >= (ch.rider ? SINK_AT_RIDDEN : SINK_AT)) startSink(ch, now);
                } else if (ch.kind === 'hyacinth') {
                    speed = HYACINTH_SPEED;
                } else if (ch.kind === 'heron') {
                    if (now > ch.until) {
                        ch.walking = !ch.walking && Math.random() < 0.5;
                        ch.until = now + (ch.walking ? 1000 + Math.random() * 1000 : 3000 + Math.random() * 3000);
                        if (ch.walking) ch.a = Math.random() * Math.PI * 2;
                    }
                    if (!ch.walking) {
                        speed = 0;
                        if (now > ch.wake) { drop(ch.x + Math.sign(Math.cos(ch.a) || 1) * 14, ch.y + 16, 2, 120); ch.wake = now + 2000 + Math.random() * 2000; }
                    }
                } else {
                    ch.a += (Math.random() - 0.5) * 2 * dt;
                    if (now > ch.wake) { drop(ch.x, ch.y + 12, 2, 50); ch.wake = now + 350; }
                }

                if (ch.sinkT) {
                    const p = Math.min(1, (now - ch.sinkT) / 1000 / SINK_FOR);
                    speed = 0;
                    scale *= 1 - 0.6 * p;
                    opacity = 1 - p;
                    if (p >= 1) { apiRef.current.remove(id); continue; }
                }

                if (!ch.on) {
                    ch.x += Math.cos(ch.a) * speed * dt;
                    ch.y += Math.sin(ch.a) * speed * dt * (DRIFTERS.includes(ch.kind) ? 1 : 0.6);
                    const hitX = ch.x < 24 || ch.x > W - 24, hitY = ch.y < 24 || ch.y > H - 24;
                    if (hitX || hitY) {
                        ch.x = Math.min(W - 24, Math.max(24, ch.x));
                        ch.y = Math.min(H - 24, Math.max(24, ch.y));
                        if (ch.kind === 'hyacinth' && ch.rider) { if (!ch.sinkT) startSink(ch, now); }
                        else { if (hitX) ch.a = Math.PI - ch.a; if (hitY) ch.a = -ch.a; }
                    }
                }

                if (ch.el) {
                    const face = DRIFTERS.includes(ch.kind) || Math.cos(ch.a) >= 0 ? 1 : -1;
                    ch.el.style.transform = `translate(${ch.x - 24}px, ${ch.y - 24}px) scale(${face * scale}, ${scale})`;
                    ch.el.style.opacity = opacity;
                    ch.el.style.zIndex = (ch.y | 0) + (ch.on ? 20 : 0);
                }
            }
        };

        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            moveChars(now, dt);
            if (!visible) return;
            if (!still && now > nextDrop) {
                drop(Math.random() * wrap.clientWidth, Math.random() * wrap.clientHeight, 2, 120);
                nextDrop = now + 1200 + Math.random() * 1500;
            }
            step();
            render(now);
        };

        const pos = (e) => {
            const r = wrap.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const onDown = (e) => {
            const [x, y] = pos(e);
            if (toolRef.current) {
                apiRef.current.add(toolRef.current, x, y);
                drop(x, y, 5, 400);
            } else {
                pressed = true;
                drop(x, y, 4, 600);
            }
        };
        const onMove = (e) => { if (pressed) { const [x, y] = pos(e); drop(x, y, 3, 200); } };
        const onUp = () => { pressed = false; };
        const onKey = (e) => { if (e.key === 'Escape') setTool(null); };

        apiRef.current = { ...apiRef.current, rebuild: buildTexture, drop };
        init();
        drop(wrap.clientWidth / 2, wrap.clientHeight / 2, 12, 900);
        raf = requestAnimationFrame(frame);
        const ro = new ResizeObserver(() => { if (Math.ceil(wrap.clientWidth / SCALE) !== w || Math.ceil(wrap.clientHeight / SCALE) !== h) init(); });
        const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
        ro.observe(wrap); io.observe(wrap);
        wrap.addEventListener('pointerdown', onDown);
        wrap.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('keydown', onKey);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect(); io.disconnect();
            wrap.removeEventListener('pointerdown', onDown);
            wrap.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('keydown', onKey);
        };
    }, []);

    const forget = (id) => {
        const map = charsRef.current, ch = map.get(id);
        if (!ch) return;
        const rider = ch.rider && map.get(ch.rider);
        if (rider) rider.on = null;
        const plant = ch.on && map.get(ch.on);
        if (plant) plant.rider = null;
        map.delete(id);
    };

    apiRef.current = {
        ...apiRef.current,
        theme,
        title,
        add: (kind, x, y) => {
            const map = charsRef.current;
            let on = null;
            if (BIRDS[kind]) {
                let hitId = null, best = HIT * HIT;
                for (const [id, ch] of map) {
                    const d = (ch.x - x) ** 2 + (ch.y - y) ** 2;
                    if (!ch.sinkT && d < best) { best = d; hitId = id; }
                }
                const hit = hitId && map.get(hitId);
                if (hit && DRIFTERS.includes(hit.kind) && !hit.rider) {
                    on = hitId;
                } else if (hit && BIRDS[hit.kind] && !hit.on && !hit.bred) {
                    if (hit.kind === kind) hit.big = true;
                    else { hit.head = hit.kind; hit.kind = kind; }
                    hit.bred = true;
                    setChars(list => list.map(c => c.id === hitId ? { ...c, kind: hit.kind, head: hit.head, big: hit.big } : c));
                    return;
                }
            }
            const id = Date.now() + Math.random();
            const plant = on && map.get(on);
            map.set(id, {
                kind,
                x: plant ? plant.x : x,
                y: plant ? plant.y - 10 : y,
                a: DRIFTERS.includes(kind) ? current : Math.random() * Math.PI * 2,
                born: performance.now(),
                wake: 0,
                until: 0,
                on,
                el: null,
            });
            if (plant) plant.rider = id;
            setChars(list => {
                const next = [...list, { id, kind }];
                while (next.length > MAX_CHARS) forget(next.shift().id);
                return next;
            });
        },
        remove: (id) => {
            forget(id);
            setChars(list => list.filter(c => c.id !== id));
        },
    };
    useEffect(() => { apiRef.current.rebuild?.(); }, [theme, title]);

    return (
        <section className="pond-section">
            <div className="pond">
                <div className={`pond-water ${tool ? 'placing' : ''}`} ref={wrapRef} data-dark-bg>
                    <canvas ref={canvasRef} className="pond-canvas" role="img" aria-label={title} />
                    {chars.map(({ id, kind, head, big }) => (
                        <div
                            key={id}
                            className={`pond-char pond-${kind}${head ? ` pond-head-${head}` : ''}${big ? ' pond-big' : ''}`}
                            ref={el => { const ch = charsRef.current.get(id); if (ch) ch.el = el; }}
                        >
                            <Sprite kind={kind} head={head} />
                        </div>
                    ))}
                </div>
                <div className="pond-taskbar" role="toolbar" aria-label="Choose a character">
                    {TOOLS.map(t => (
                        <button
                            key={t.kind}
                            className="pond-tool"
                            aria-pressed={tool === t.kind}
                            aria-label={t.latin}
                            onClick={() => setTool(cur => cur === t.kind ? null : t.kind)}
                        >
                            <Sprite kind={t.kind} />
                            <span className="pond-tip" aria-hidden="true"><i>{t.latin}</i></span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pond;
