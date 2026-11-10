import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChapterNav from './ChapterNav';
import { Reveal, Pipeline } from './parts';
import { correlation, importance, scatter, models } from './batteryData';
import './cases.css';
import heroLight from '../../assets/cases/hero-battery-light.webp';
import heroDark from '../../assets/cases/hero-battery-dark.webp';

const DEMO_URL = '/battery/preview';
const GITHUB_URL = 'https://github.com/dionsylvester/batteryRUL-app';
const PAPER_URL = 'https://doi.org/10.1109/ICIMCIS68501.2025.11327063';

const STACK = ['Python', 'Scikit-learn', 'Pandas', 'FastAPI', 'Docker', 'Streamlit'];
const CHAPTERS = [
  ['overview', 'Overview'],
  ['method', 'Method'],
  ['results', 'Results'],
  ['limitations', 'Limitations'],
  ['links', 'Links'],
];
const INPUTS = importance.map(([name]) => name);

function BarList({ rows, min = 0, highlight, format = (v) => v.toFixed(2) }) {
  const pct = (v) => (Math.abs(v) / (min < 0 ? 2 : 1)) * 100;
  const zero = min < 0 ? 50 : 0;
  return (
    <ul className="cs-bars">
      {rows.map(([name, v]) => (
        <li key={name} className={name === highlight ? 'is-hl' : ''} title={`${name}: ${format(v)}`}>
          <span className="cs-bars-label">{name}</span>
          <span className="cs-bars-track">
            {min < 0 && <span className="cs-bars-zero" style={{ left: '50%' }} />}
            <span
              className={`cs-bars-fill ${v < 0 ? 'neg' : 'pos'}`}
              style={{ left: `${v < 0 ? zero - pct(v) : zero}%`, width: `${pct(v)}%` }}
            />
          </span>
          <span className="cs-bars-value">{format(v)}</span>
        </li>
      ))}
    </ul>
  );
}

const W = 560, H = 400, PAD = 44, MAX = 1200;
const sx = (v) => PAD + (v / MAX) * (W - PAD - 12);
const sy = (v) => H - PAD - (v / MAX) * (H - PAD - 12);
const TICKS = [0, 300, 600, 900, 1200];

const DOTS = [];
for (let i = 0; i < scatter.length; i += 2) {
  DOTS.push(<circle key={i} cx={sx(scatter[i])} cy={sy(scatter[i + 1])} r="2" />);
}
const DOT_LAYER = <g className="cs-dots">{DOTS}</g>;

function Scatter() {
  const [hover, setHover] = useState(null);

  function onMove(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    const y = ((e.clientY - box.top) / box.height) * H;
    let best = null, bestD = 144;
    for (let i = 0; i < scatter.length; i += 2) {
      const d = (sx(scatter[i]) - x) ** 2 + (sy(scatter[i + 1]) - y) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    }
    setHover(best);
  }

  return (
    <figure className="cs-scatter">
      <svg viewBox={`0 0 ${W} ${H}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}
        role="img" aria-label="Scatter plot of actual versus predicted RUL for 3,006 test cycles; points sit tightly on the diagonal.">
        {TICKS.map((t) => (
          <g key={t} className="cs-grid">
            <line x1={sx(0)} x2={sx(MAX)} y1={sy(t)} y2={sy(t)} />
            <text x={PAD - 8} y={sy(t) + 4} textAnchor="end">{t}</text>
            <text x={sx(t)} y={H - PAD + 18} textAnchor="middle">{t}</text>
          </g>
        ))}
        {DOT_LAYER}
        <line className="cs-diag" x1={sx(0)} y1={sy(0)} x2={sx(MAX)} y2={sy(MAX)} />
        <text className="cs-diag-label" x={sx(780)} y={sy(1000)} textAnchor="end">perfect prediction ↘</text>
        <text className="cs-axis" x={(W + PAD) / 2} y={H - 4} textAnchor="middle">Actual RUL (cycles)</text>
        <text className="cs-axis" transform={`translate(12 ${(H - PAD) / 2}) rotate(-90)`} textAnchor="middle">Predicted RUL</text>
        {hover !== null && (
          <g className="cs-hover">
            <circle cx={sx(scatter[hover])} cy={sy(scatter[hover + 1])} r="5" />
          </g>
        )}
      </svg>
      <figcaption>
        {hover !== null
          ? <>Actual <b>{scatter[hover]}</b> · predicted <b>{scatter[hover + 1]}</b> cycles</>
          : 'Actual vs predicted RUL, Gradient Boosting, test set (n = 3,006). Hover a point.'}
      </figcaption>
    </figure>
  );
}

const PIPELINE = [
  {
    tab: 'Clean',
    title: '15,064 → 15,030 rows.',
    body: (
      <>The last row of the source file is an aggregate total, not a measurement, so it goes.
        Another 33 rows have negative durations in <i>Decrement 3.6–3.4 V</i> or <i>Time at 4.15 V</i>,
        which is physically impossible. No nulls, no duplicates.</>
    ),
    visual: (
      <div className="cs-bigpair">
        <span><b>15,064</b>raw rows</span>
        <span className="cs-arrow" aria-hidden>→</span>
        <span><b>15,030</b>clean rows</span>
      </div>
    ),
  },
  {
    tab: 'Find the leak',
    title: 'One feature already knew the answer.',
    body: (
      <>Cycle Index counts up while RUL counts down, so the two correlate at exactly −1.00.
        A model given Cycle Index learns subtraction, not degradation, and can’t be used on a battery
        whose cycle count is unknown. It was dropped, which leaves seven signals from a single
        charge–discharge cycle.</>
    ),
    visual: <BarList rows={correlation} min={-1} highlight="Cycle Index" />,
  },
  {
    tab: 'Split & scale',
    title: '80 / 20, scaled on train only.',
    body: (
      <>12,024 rows for training, 3,006 held out (random_state 42). StandardScaler is fit on the
        training rows and only applied to the test rows. Model selection uses 5-fold cross-validation
        inside the training set.</>
    ),
    visual: (
      <div className="cs-split" aria-label="80 percent training, 20 percent test">
        <span style={{ flex: 80 }}>Train · 12,024</span>
        <span style={{ flex: 20 }}>Test · 3,006</span>
      </div>
    ),
  },
];

const ROWS = [
  ['MAE, 5-fold CV', (m) => (m.cvMae ? `${m.cvMae[0].toFixed(2)} ± ${m.cvMae[1].toFixed(2)}` : '—*')],
  ['MAE, test', (m) => m.mae.toFixed(2)],
  ['RMSE, test', (m) => m.rmse.toFixed(2)],
  ['R², test', (m) => m.r2.toFixed(4)],
];

function Compare() {
  const others = Object.keys(models).slice(1);
  const [other, setOther] = useState(others[0]);
  const best = models['Gradient Boosting'];
  return (
    <div className="cs-compare">
      <div className="cs-compare-head">
        <span>Gradient Boosting</span>
        <label>
          <span className="cs-sr">Compare with</span>
          <select value={other} onChange={(e) => setOther(e.target.value)}>
            {others.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
      </div>
      {ROWS.map(([label, f]) => (
        <div className="cs-compare-row" key={label}>
          <b>{f(best)}</b>
          <span>{label}</span>
          <b className="muted">{f(models[other])}</b>
        </div>
      ))}
      <p className="cs-note">Lower MAE/RMSE is better. Errors are in cycles.
        {!models[other].cvMae && ' *The notebook ran this CV without polynomial features, so it is left out.'}</p>
    </div>
  );
}

export default function BatteryRUL({ theme }) {
  return (
    <main className="cs">
      <header className="cs-hero">
        <Reveal>
          <p className="cs-eyebrow">Case Study · Machine Learning</p>
          <h1>Battery Remaining<br />Useful Life Prediction</h1>
          <p className="cs-tagline">How many cycles does a lithium-ion cell have left?<br />
            A lightweight model that answers from a single charge–discharge cycle.</p>
          <ul className="cs-badges">{STACK.map((s) => <li key={s}>{s}</li>)}</ul>
          <Link className="cs-cta" to={DEMO_URL}>Preview Demo</Link>
        </Reveal>
        <Reveal className="cs-hero-media" delay={0.15}>
          <Link className="cs-hero-link" to={DEMO_URL}>
            <img className="cs-shot" src={theme === 'dark' ? heroDark : heroLight} alt="Battery Health Prediction" width="1960" height="1225" />
          </Link>
        </Reveal>
      </header>

      <ChapterNav title="Battery Health Prediction" chapters={CHAPTERS} />

      <section id="overview" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Overview</p>
          <h2>Batteries don’t come with a gauge for their lifespan.</h2>
          <p className="cs-lead">Lithium-ion cells wear out with every cycle. When nobody knows how much
            life is left, packs get replaced too early, which wastes material, or too late, which risks
            failure. Estimating <b>Remaining Useful Life (RUL)</b> supports responsible use and
            recycling (SDG 7 and 12).</p>
        </Reveal>

        <Reveal className="cs-stats">
          <div><b>14</b><span>NMC-LCO 18650 cells, HNEI dataset<sup>1</sup></span></div>
          <div><b>1,000+</b><span>charge–discharge cycles per cell at 25 °C</span></div>
          <div><b>7</b><span>input features per cycle</span></div>
        </Reveal>

        <Reveal className="cs-feature">
          <div>
            <p className="cs-eyebrow small">Key feature</p>
            <h3>Enter seven numbers, get the cycles left.</h3>
            <p>The app is a single form. Enter the seven measurements from one cycle, field by field,
              and the Gradient Boosting model, the best performer below, returns the estimated
              RUL in cycles.</p>
          </div>
          <div className="cs-flow" aria-label="Seven inputs feed the model, which outputs RUL">
            <ul>{INPUTS.map((n) => <li key={n}>{n}</li>)}</ul>
            <span className="cs-flow-arrow" aria-hidden>→</span>
            <div className="cs-flow-out"><small>Predicted RUL</small><b>— cycles</b></div>
          </div>
        </Reveal>
      </section>

      <section id="method" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Method</p>
          <h2>Clean data first, then make sure the model can’t cheat.</h2>
        </Reveal>
        <Reveal><Pipeline steps={PIPELINE} /></Reveal>

        <Reveal className="cs-split-2">
          <div>
            <h3>Gradient Boosting won on every metric.</h3>
            <p>Five regressors were trained on the same split. Here is the winner against the next two
              and the weakest. Its 5-fold CV error beats Decision Tree’s significantly
              (paired t-test, p = 0.0003).</p>
            <ul className="cs-params">
              <li>200 trees</li><li>max depth 10</li><li>learning rate 0.1</li>
              <li>subsample 0.8</li><li>max features 0.5</li>
            </ul>
          </div>
          <Compare />
        </Reveal>

        <Reveal className="cs-split-2">
          <div>
            <h3>Two timing signals account for 70% of feature importance.</h3>
            <p>How long a cell takes to discharge and how long it holds at 4.15 V shift steadily as it
              ages. Voltage extremes, despite their strong raw correlation, add little once those
              timings are known.</p>
          </div>
          <figure className="cs-figure">
            <BarList rows={importance} format={(v) => `${(v * 100).toFixed(1)}%`} />
            <figcaption>Feature importance, Gradient Boosting<sup>2</sup></figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <h3 className="cs-h3-center">From notebook to app.</h3>
          <div className="cs-grid4">
            <div><b>Streamlit</b><p>The input form and result view.</p></div>
            <div><b>FastAPI</b><p>Serves the trained model as a prediction endpoint.</p></div>
            <div><b>Docker</b><p>Packages the app and its dependencies for deployment.</p></div>
            <div><b>Matplotlib</b><p>Draws the charts shown in the app.</p></div>
          </div>
        </Reveal>
      </section>

      <section id="results" className="cs-section cs-dark">
        <Reveal>
          <p className="cs-eyebrow">Results</p>
          <h2>Off by about ten cycles out of a thousand.</h2>
        </Reveal>
        <Reveal className="cs-stats">
          <div><b>10.33</b><span>MAE on the held-out test set, in cycles</span></div>
          <div><b>11.32 <small>± 0.19</small></b><span>MAE, 5-fold cross-validation</span></div>
          <div><b>0.996</b><span>R² on the test set</span></div>
        </Reveal>
        <Reveal><Scatter /></Reveal>
      </section>

      <section id="limitations" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Limitations</p>
          <h2>Three warnings behind the headline numbers.</h2>
        </Reveal>
        <div className="cs-cards">
          <Reveal className="cs-card">
            <h4>Weakest where it matters most.</h4>
            <p>Near end of life (RUL ≤ 200, n = 573), MAE rises to <b>14.80</b> and R² drops to
              <b> 0.77</b>, compared with 9.28 and 0.996 above that threshold.</p>
            <p className="cs-next">Next: weight late-life cycles, or train a dedicated end-of-life model.</p>
          </Reveal>
          <Reveal className="cs-card" delay={0.1}>
            <h4>Split by row, not by battery.</h4>
            <p>Cycles from the same cell appear in both train and test, so scores are optimistic for a
              battery the model has never seen.</p>
            <p className="cs-next">Next: leave-one-battery-out CV. The 14 cells can be recovered
              from Cycle Index resets.</p>
          </Reveal>
          <Reveal className="cs-card" delay={0.2}>
            <h4>Train fits tighter than test.</h4>
            <p>Train MAE is <b>2.42</b> against <b>10.33</b> on test. That’s why this page reports
              only CV and test figures.</p>
            <p className="cs-next">Next: tune depth and learning rate, and add early stopping.</p>
          </Reveal>
        </div>
      </section>

      <section id="links" className="cs-section cs-links">
        <Reveal>
          <h2>Dig deeper.</h2>
          <div className="cs-link-row">
            <a className="cs-cta" href={GITHUB_URL}>GitHub repository</a>
            <a className="cs-cta ghost" href={PAPER_URL}>Read the paper</a>
          </div>
        </Reveal>
        <ol className="cs-footnotes">
          <li>Hawaii Natural Energy Institute. 2.8 Ah cells cycled at C/2 charge and 1.5C discharge.</li>
          <li>Importances and the scatter plot come from the deployed model file. Headline metrics come
            from the training notebook run. The two differ slightly (test MAE 10.39 vs 10.33).</li>
        </ol>
      </section>
    </main>
  );
}
