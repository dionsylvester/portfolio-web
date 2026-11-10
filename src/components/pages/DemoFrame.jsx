import { useLayoutEffect } from 'react';
import NavBar from '../navbar/NavBar';
import Footer from '../navbar/Footer';
import './DemoFrame.css';

export default function DemoFrame({ url, title, theme, setTheme }) {
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const u = new URL(url);
  u.searchParams.set('theme', theme);
  const src = u.toString();

  return (
    <>
      <NavBar theme={theme} setTheme={setTheme} />
      <section className="bp-frame">
        <iframe key={src} className="bp-iframe" src={src} title={title} loading="lazy" />
      </section>
      <Footer />
    </>
  );
}
