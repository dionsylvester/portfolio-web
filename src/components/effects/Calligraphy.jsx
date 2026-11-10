import React, { useEffect, useRef, useState } from 'react';
import './Calligraphy.css';

const NAMES = ['Dion', 'ディオン', '徐顯順'];

const SCALE = 2;
const RIPPLE = 1.5;
const WOBBLE = 0.4;
const INK = { light: [0x1c, 0x1c, 0x1c], dark: [0xff, 0xfa, 0xf1] };
const NAME = { light: '#344f88', dark: '#87c0c8' };
const HOLD = 20, DISSOLVE = 5;
const NAME_FADE = 1000;
const WIDTH_MAX = 28, WIDTH_MIN = 6;
const SLOW = 0.2, FAST = 2.5;
const BRISTLES = 5;
const FOLLOW = 0.35;
const ERASE = 28, RIM = 40;
const CARRY = 0.9;
const COVER = 0.8, UNCOVER = 0.2;

const Calligraphy = ({ theme }) => {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const apiRef = useRef({});
    const [nameIdx, setNameIdx] = useState(0);
    apiRef.current.theme = theme === 'dark' ? 'dark' : 'light';
    apiRef.current.name = NAMES[nameIdx];

    useEffect(() => {
        const wrap = wrapRef.current, canvas = canvasRef.current, ctx = canvas.getContext('2d');
        const tex = document.createElement('canvas'), tctx = tex.getContext('2d', { willReadFrequently: true });
        const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w, h, cur, prev, texBuf, img, out, ink, nextInk, born, disp, nameMask, wobY;
        const nb = new Int32Array(4);
        let oldTex = null, fadeFrom = 0;
        let raf, visible = true, nextDrop = 0, nextCheck = 0, armed = true, inked = false;
        let tool = null, last = null, width = WIDTH_MAX, seed = 0;

        const buildTexture = () => {
            const theme = apiRef.current.theme;
            tex.width = w; tex.height = h;
            tctx.fillStyle = getComputedStyle(wrap).backgroundColor;
            tctx.fillRect(0, 0, w, h);
            tctx.font = `${96 / SCALE}px Helvetica, Arial, sans-serif`;
            tctx.textAlign = 'center';
            tctx.textBaseline = 'middle';
            tctx.fillStyle = NAME[theme];
            tctx.fillText(apiRef.current.name, w / 2, h / 2);
            texBuf = new Uint32Array(tctx.getImageData(0, 0, w, h).data.buffer);
            out.set(texBuf);
            tctx.clearRect(0, 0, w, h);
            tctx.fillStyle = '#000';
            tctx.fillText(apiRef.current.name, w / 2, h / 2);
            const a = tctx.getImageData(0, 0, w, h).data, idx = [];
            for (let i = 0; i < w * h; i++) if (a[i * 4 + 3] > 128) idx.push(i);
            nameMask = Int32Array.from(idx);
        };

        const init = () => {
            w = Math.max(3, Math.ceil(wrap.clientWidth / SCALE));
            h = Math.max(3, Math.ceil(wrap.clientHeight / SCALE));
            canvas.width = w; canvas.height = h;
            cur = new Float32Array(w * h); prev = new Float32Array(w * h);
            ink = new Float32Array(w * h); nextInk = new Float32Array(w * h);
            born = new Float32Array(w * h); disp = new Float32Array(w * h);
            wobY = new Float32Array(w);
            img = ctx.createImageData(w, h);
            out = new Uint32Array(img.data.buffer);
            inked = false; oldTex = null;
            buildTexture();
        };

        const drop = (cx, cy, r, strength) => {
            r *= RIPPLE; strength *= RIPPLE;
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

        const phase = (i, t) => Math.min(1, Math.max(0, (t - born[i] - HOLD) / DISSOLVE));

        const updateInk = (t) => {
            let any = false;
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const i = y * w + x;
                    nb[0] = i - 1; nb[1] = i + 1; nb[2] = i - w; nb[3] = i + w;
                    const sum = ink[nb[0]] + ink[nb[1]] + ink[nb[2]] + ink[nb[3]];
                    if (ink[i] === 0 && sum === 0) { nextInk[i] = 0; disp[i] = 0; continue; }
                    let q = ink[i] > 0 ? phase(i, t) : 0, oldest = born[i];
                    for (const j of nb) if (ink[j] > 0) { q = Math.max(q, phase(j, t)); if (ink[i] === 0 || born[j] < oldest) oldest = born[j]; }
                    let v = ink[i] + 0.2 * q * (sum / 4 - ink[i]);
                    if (ink[i] === 0 && v > 0) born[i] = oldest;
                    if (t - born[i] >= HOLD + DISSOLVE || v < 0.01) v = 0;
                    nextInk[i] = v;
                    disp[i] = v * (1 - phase(i, t));
                    if (v > 0) any = true;
                }
            }
            const s = ink; ink = nextInk; nextInk = s;
            inked = any;
        };

        const bilinear = (buf, j, ax, ay, s) => {
            const c00 = (buf[j] >> s) & 255, c10 = (buf[j + 1] >> s) & 255, c01 = (buf[j + w] >> s) & 255, c11 = (buf[j + w + 1] >> s) & 255;
            const top = c00 + (c10 - c00) * ax, bot = c01 + (c11 - c01) * ax;
            return top + (bot - top) * ay;
        };

        const render = (now) => {
            const t = now / 1000, [ir, ig, ib] = INK[apiRef.current.theme];
            const fade = oldTex ? Math.min(1, (now - fadeFrom) / NAME_FADE) : 1;
            if (fade >= 1) oldTex = null;
            if (!still) for (let x = 0; x < w; x++) wobY[x] = Math.cos(x * 0.07 + t * 1.3) * WOBBLE * 0.7;
            for (let y = 1; y < h - 1; y++) {
                const wx = still ? 0 : Math.sin(y * 0.09 + t * 1.6) * WOBBLE;
                for (let x = 1; x < w - 1; x++) {
                    const i = y * w + x;
                    const dx = cur[i - 1] - cur[i + 1], dy = cur[i - w] - cur[i + w];
                    const fx = Math.min(w - 1.001, Math.max(0, x + dx * 0.06 + wx));
                    const fy = Math.min(h - 1.001, Math.max(0, y + dy * 0.06 + wobY[x]));
                    const x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0, j = y0 * w + x0;
                    let r = bilinear(texBuf, j, ax, ay, 0), g = bilinear(texBuf, j, ax, ay, 8), b = bilinear(texBuf, j, ax, ay, 16);
                    if (oldTex) {
                        r = bilinear(oldTex, j, ax, ay, 0) + (r - bilinear(oldTex, j, ax, ay, 0)) * fade;
                        g = bilinear(oldTex, j, ax, ay, 8) + (g - bilinear(oldTex, j, ax, ay, 8)) * fade;
                        b = bilinear(oldTex, j, ax, ay, 16) + (b - bilinear(oldTex, j, ax, ay, 16)) * fade;
                    }
                    if (inked) {
                        const a = ((disp[j] * (1 - ax) + disp[j + 1] * ax) * (1 - ay) + (disp[j + w] * (1 - ax) + disp[j + w + 1] * ax) * ay) * 0.95;
                        r += (ir - r) * a; g += (ig - g) * a; b += (ib - b) * a;
                    }
                    const light = dx * 0.12 * RIPPLE;
                    r = Math.min(255, Math.max(0, r + light));
                    g = Math.min(255, Math.max(0, g + light));
                    b = Math.min(255, Math.max(0, b + light));
                    out[i] = (255 << 24) | (b << 16) | (g << 8) | r;
                }
            }
            ctx.putImageData(img, 0, 0);
        };

        const stamp = (cx, cy, mx, my, t, dry) => {
            const r = width / 2 / SCALE, x0 = cx / SCALE, y0 = cy / SCALE;
            const len = Math.hypot(mx, my) || 1, nx = -my / len, ny = mx / len;
            for (let y = Math.max(1, Math.floor(y0 - r)); y <= Math.min(h - 2, Math.ceil(y0 + r)); y++) {
                for (let x = Math.max(1, Math.floor(x0 - r)); x <= Math.min(w - 2, Math.ceil(x0 + r)); x++) {
                    const d = Math.hypot(x + 0.5 - x0, y + 0.5 - y0) / Math.max(r, 0.75);
                    if (d >= 1) continue;
                    const bi = Math.min(BRISTLES - 1, Math.floor((((x + 0.5 - x0) * nx + (y + 0.5 - y0) * ny) / Math.max(r, 0.75) + 1) / 2 * BRISTLES));
                    const k = Math.sin((bi + 1) * 12.9898 + seed * 78.233) * 43758.5453;
                    if (k - Math.floor(k) < dry * 0.5) continue;
                    const i = y * w + x, v = Math.min(1, (1 - d) * 3);
                    ink[i] = Math.max(ink[i], v); born[i] = t;
                }
            }
            inked = true;
        };

        const sweep = (cx, cy, mx, my) => {
            const x0 = cx / SCALE, y0 = cy / SCALE, rIn = ERASE / SCALE, rOut = RIM / SCALE;
            const xa = Math.max(1, Math.floor(x0 - rOut)), xb = Math.min(w - 2, Math.ceil(x0 + rOut));
            const ya = Math.max(1, Math.floor(y0 - rOut)), yb = Math.min(h - 2, Math.ceil(y0 + rOut));
            if (xa > xb || ya > yb) return;
            const bw = xb - xa + 1, newInk = new Float32Array(bw * (yb - ya + 1)), newBorn = new Float32Array(newInk.length);
            for (let y = ya; y <= yb; y++) {
                for (let x = xa; x <= xb; x++) {
                    const i = y * w + x, k = (y - ya) * bw + (x - xa), d = Math.hypot(x + 0.5 - x0, y + 0.5 - y0);
                    newInk[k] = ink[i]; newBorn[k] = born[i];
                    if (d >= rOut) continue;
                    if (d < rIn) { newInk[k] = 0; continue; }
                    const f = (rOut - d) / (rOut - rIn);
                    const sx = Math.round(x - mx / SCALE * f), sy = Math.round(y - my / SCALE * f);
                    if (sx < 0 || sy < 0 || sx >= w || sy >= h) { newInk[k] = 0; continue; }
                    const j = sy * w + sx;
                    newInk[k] = ink[j] * CARRY; newBorn[k] = born[j];
                }
            }
            for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
                const k = (y - ya) * bw + (x - xa);
                ink[y * w + x] = newInk[k]; born[y * w + x] = newBorn[k];
            }
        };

        const checkName = () => {
            let covered = 0;
            for (const i of nameMask) if (disp[i] > 0.5) covered++;
            const c = nameMask.length ? covered / nameMask.length : 0;
            if (armed && c >= COVER) { armed = false; setNameIdx((i) => (i + 1) % NAMES.length); }
            else if (!armed && c < UNCOVER) armed = true;
        };

        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            if (!visible) return;
            if (!still && now > nextDrop) {
                drop(Math.random() * wrap.clientWidth, Math.random() * wrap.clientHeight, 2, 120);
                nextDrop = now + 1200 + Math.random() * 1500;
            }
            step();
            if (inked) updateInk(now / 1000);
            render(now);
            if (now > nextCheck) { checkName(); nextCheck = now + 250; }
        };

        const pos = (e) => { const r = wrap.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        const onDown = (e) => {
            if (e.button !== 0 && e.button !== 2) return;
            const [x, y] = pos(e);
            last = { x, y, time: e.timeStamp };
            tool = e.button === 0 ? 'brush' : 'broom';
            if (tool === 'brush') { width = WIDTH_MAX; seed = Math.random(); stamp(x, y, 1, 0, performance.now() / 1000, 0); }
            else drop(x, y, 3, 300);
        };
        const onMove = (e) => {
            if (!tool) return;
            if (!(e.buttons & 3)) { tool = null; return; }
            const [x, y] = pos(e);
            if (last) {
                const mx = x - last.x, my = y - last.y, dist = Math.hypot(mx, my), t = performance.now() / 1000;
                if (tool === 'brush') {
                    const speed = dist / Math.max(1, e.timeStamp - last.time);
                    const dry = Math.min(1, Math.max(0, (speed - SLOW) / (FAST - SLOW)));
                    width += (WIDTH_MAX + (WIDTH_MIN - WIDTH_MAX) * dry - width) * FOLLOW;
                    const steps = Math.ceil(dist / Math.max(1, width / 3));
                    for (let s = 1; s <= steps; s++) stamp(last.x + mx * s / steps, last.y + my * s / steps, mx, my, t, dry);
                } else if (dist > 0) {
                    const steps = Math.ceil(dist / (ERASE / 2));
                    for (let s = 1; s <= steps; s++) sweep(last.x + mx * s / steps, last.y + my * s / steps, mx / steps, my / steps);
                    drop(x, y, 3, 60);
                }
            }
            last = { x, y, time: e.timeStamp };
        };
        const onUp = () => { tool = null; };
        const onLeave = () => { last = null; };
        const onMenu = (e) => e.preventDefault();
        const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
        const ro = new ResizeObserver(() => { if (Math.ceil(wrap.clientWidth / SCALE) !== w || Math.ceil(wrap.clientHeight / SCALE) !== h) init(); });

        const nameRipple = () => drop(wrap.clientWidth / 2, wrap.clientHeight / 2, 3, 300);
        apiRef.current.rebuild = (newName) => {
            if (newName) { oldTex = texBuf; fadeFrom = performance.now(); }
            buildTexture();
            if (newName) nameRipple();
        };
        init();
        nameRipple();
        raf = requestAnimationFrame(frame);
        io.observe(wrap); ro.observe(wrap);
        wrap.addEventListener('pointerdown', onDown);
        wrap.addEventListener('pointermove', onMove);
        wrap.addEventListener('pointerleave', onLeave);
        wrap.addEventListener('contextmenu', onMenu);
        window.addEventListener('pointerup', onUp);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect(); ro.disconnect();
            wrap.removeEventListener('pointerdown', onDown);
            wrap.removeEventListener('pointermove', onMove);
            wrap.removeEventListener('pointerleave', onLeave);
            wrap.removeEventListener('contextmenu', onMenu);
            window.removeEventListener('pointerup', onUp);
        };
    }, []);

    const shown = useRef({ theme, nameIdx });
    useEffect(() => {
        const changedName = shown.current.nameIdx !== nameIdx;
        shown.current = { theme, nameIdx };
        apiRef.current.rebuild?.(changedName);
    }, [theme, nameIdx]);

    return (
        <div className="sand" ref={wrapRef}>
            <canvas ref={canvasRef} className="sand-canvas" aria-hidden="true" />
            <h1 className="sand-name">{NAMES[nameIdx]}</h1>
        </div>
    );
};

export default Calligraphy;
