import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

let firstLoad = true;

const readScroll = (key) => {
    try { return Number(sessionStorage.getItem(key)) || 0; } catch { return 0; }
};

const useScrollMemory = (key) => {
    const restore = useRef(null);
    const { state } = useLocation();

    useLayoutEffect(() => {
        if (restore.current === null) {
            const nav = performance.getEntriesByType('navigation')[0]?.type;
            restore.current = !state?.top && (!firstLoad || nav === 'reload' || nav === 'back_forward');
            if (state?.top) history.replaceState({ ...history.state, usr: null }, '');
            firstLoad = false;
        }
        history.scrollRestoration = 'manual';
        window.scrollTo({ top: restore.current ? readScroll(key) : 0, behavior: 'instant' });

        const save = () => { try { sessionStorage.setItem(key, String(window.scrollY)); } catch {} };
        window.addEventListener('scroll', save, { passive: true });
        return () => {
            window.removeEventListener('scroll', save);
            history.scrollRestoration = 'auto';
        };
    }, [key]);
};

export default useScrollMemory;
