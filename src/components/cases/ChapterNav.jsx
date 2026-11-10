import { useEffect, useRef, useState } from 'react';

export default function ChapterNav({ title, chapters }) {
  const ref = useRef(null);
  const [active, setActive] = useState(chapters[0][0]);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    chapters.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [chapters]);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const el = ref.current;
      setStuck(el.getBoundingClientRect().top <= parseFloat(getComputedStyle(el).top) + 0.5);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <nav ref={ref} className={`cs-chapters ${stuck ? 'stuck' : ''}`} aria-label="Case study sections">
      <span className="cs-chapters-title">{title}</span>
      <div>
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={id === active ? 'on' : ''}>{label}</a>
        ))}
      </div>
    </nav>
  );
}
