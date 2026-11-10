import { useState } from 'react';
import { motion } from 'motion/react';

export function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function Pipeline({ steps }) {
  const [i, setI] = useState(0);
  return (
    <div className="cs-tabs">
      <div className="cs-tablist" role="tablist">
        {steps.map((s, n) => (
          <button key={s.tab} role="tab" aria-selected={n === i} onClick={() => setI(n)}>
            <span>{n + 1}</span>{s.tab}
          </button>
        ))}
      </div>
      <div className="cs-stack">
        {steps.map((s, n) => (
          <div key={s.tab} className={`cs-tabpanel ${n === i ? 'on' : ''}`} role="tabpanel" aria-hidden={n !== i}>
            <div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
            <div className="cs-tabvisual">{s.visual}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Challenges({ items }) {
  const [i, setI] = useState(0);
  return (
    <div className="cl-ld">
      <div className="cl-ld-list" role="tablist" aria-orientation="vertical">
        {items.map((c, n) => (
          <button key={c.title} role="tab" aria-selected={n === i} onClick={() => setI(n)}>
            <span>{String(n + 1).padStart(2, '0')}</span>{c.title}
          </button>
        ))}
      </div>
      <div className="cs-stack">
        {items.map((c, n) => (
          <div key={c.title} className={`cl-ld-panel ${n === i ? 'on' : ''}`} role="tabpanel" aria-hidden={n !== i}>
            <h4>{c.title}</h4>
            {c.body}
          </div>
        ))}
      </div>
    </div>
  );
}
