import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChapterNav from './ChapterNav';
import { Reveal, Challenges } from './parts';
import './cases.css';
import './Climate.css';
import { TREND_START, TEST_FROM, trend, co2 } from './climateData';
import heroMap from '../../assets/cases/hero-climate.webp';
import timelineLight from '../../assets/cases/card-timeline-light.webp';
import timelineDark from '../../assets/cases/card-timeline-dark.webp';
import rainfallLight from '../../assets/cases/card-rainfall-light.webp';
import rainfallDark from '../../assets/cases/card-rainfall-dark.webp';
import scenarioLight from '../../assets/cases/card-scenario-light.webp';
import scenarioDark from '../../assets/cases/card-scenario-dark.webp';
import modelLight from '../../assets/cases/card-model-light.webp';
import modelDark from '../../assets/cases/card-model-dark.webp';
import emissionLight from '../../assets/cases/card-emission-light.webp';
import emissionDark from '../../assets/cases/card-emission-dark.webp';
import chartLight from '../../assets/cases/card-chart-light.webp';
import chartDark from '../../assets/cases/card-chart-dark.webp';

const DEMO_URL = '/climate/preview';
const GITHUB_URL = 'https://github.com/dionsylvester/climate-map';

const STACK = ['Python', 'PyTorch', 'PyTorch Geometric', 'xarray', 'React', 'D3', 'Vercel'];
const CHAPTERS = [
  ['overview', 'Overview'],
  ['method', 'Method'],
  ['challenges', 'Challenges'],
  ['results', 'Results'],
  ['limitations', 'Limitations'],
];

function DemoLink() {
  return <Link className="cs-cta" to={DEMO_URL}>Open the interactive map</Link>;
}

const FEATURES = [
  ['Year timeline', [timelineLight, timelineDark], '1860–2090. Every year shows a 20-year average (2090 = 2081–2100), because a single model run is too noisy year to year.'],
  ['Rainfall change map', [rainfallLight, rainfallDark], '% change against 1851–1900 per grid cell. Brown is drier, blue-green is wetter. Hover a cell for mm/day and % change.'],
  ['Scenario compare', [scenarioLight, scenarioDark], 'Pick any of four SSP scenarios, or show two side by side for the same year.'],
  ['Source toggle', [modelLight, modelDark], 'Switch between the climate model (CMIP6, INM-CM4-8) and the ST-GNN. With the ST-GNN, the timeline marks which years the model trained on, validated on, or never saw.'],
  ['Emission layers', [emissionLight, emissionDark], 'CO₂, CH₄, SO₂ and black carbon per cell, in t/km² per year, on a log colour scale.'],
  ['Trend chart', [chartLight, chartDark], 'Indonesia-wide average for all four scenarios, with a marker that follows the timeline.'],
];

function Carousel({ theme }) {
  const track = useRef(null);
  const [idx, setIdx] = useState(0);
  const step = () => track.current.firstElementChild.offsetWidth + 16;
  const go = (d) => track.current.scrollBy({ left: d * step(), behavior: 'smooth' });
  return (
    <div className="cl-carousel">
      <ul className="cl-track" ref={track} onScroll={() => setIdx(Math.round(track.current.scrollLeft / step()))}>
        {FEATURES.map(([title, [light, dark], body], n) => (
          <li key={title}>
            <img className="cs-shot" src={theme === 'dark' ? dark : light} alt={title} width="640" height="480" loading="lazy" />
            <p><b>{title}.</b> {body}</p>
            <span className="cl-count">{n + 1} / {FEATURES.length}</span>
          </li>
        ))}
      </ul>
      <div className="cl-carousel-ctl">
        <div className="cl-dots" aria-hidden>
          {FEATURES.map((f, n) => <span key={f[0]} className={n === idx ? 'on' : ''} />)}
        </div>
        <button onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous feature">‹</button>
        <button onClick={() => go(1)} disabled={idx >= FEATURES.length - 3} aria-label="Next feature">›</button>
      </div>
    </div>
  );
}

function SizeBars() {
  return (
    <div className="cl-sizes">
      {[['Inputs · Input4MIPs, 7 emission variables', 3.31], ['Target · CMIP6 INM-CM4-8 precipitation', 0.89]].map(([l, gb]) => (
        <div key={l}>
          <span>{l}</span>
          <i style={{ width: `${(gb / 3.31) * 100}%` }} />
          <b>{gb >= 1 ? `${gb} GB` : `${gb * 1000} MB`}</b>
        </div>
      ))}
      <p>Same 96 × 144 global grid · historical 1850–2014 · SSPs 2015–2100</p>
    </div>
  );
}

const CO2_MAX = Math.max(...co2.flat());
const co2Opacity = (v) => 0.08 + 0.92 * Math.max(0, Math.log10(1 + v) / Math.log10(1 + CO2_MAX));

function CropGrid() {
  const cells = [];
  let hot = [0, 0];
  co2.forEach((row, r) => row.forEach((v, c) => {
    if (v === CO2_MAX) hot = [r, c];
    cells.push(
      <rect key={`${r}-${c}`} x={c * 20 + 1} y={r * 20 + 1} width="18" height="18" rx="2" fillOpacity={co2Opacity(v)}>
        <title>{`${v} t CO₂/km² per year`}</title>
      </rect>,
    );
  }));
  return (
    <figure className="cl-crop">
      <svg viewBox="0 0 380 214" role="img"
        aria-label={`Indonesia crop: 9 rows by 19 columns, shaded by CO₂ emissions; the highest cell, ${CO2_MAX} t/km² per year, sits on Jakarta`}>
        <g>{cells}</g>
        <rect className="cl-crop-hot" x={hot[1] * 20} y={hot[0] * 20} width="20" height="20" rx="3" />
        <text x={hot[1] * 20 + 10} y="200" textAnchor="middle">▲ Jakarta · {CO2_MAX.toLocaleString('en')} t/km²/yr</text>
      </svg>
      <figcaption><b>9 × 19 = 171 cells</b> · 11°S–6°N × 95°E–141°E · shaded by CO₂, 1995–2014 (log scale)</figcaption>
    </figure>
  );
}

function Chain({ label, steps, struck }) {
  return (
    <div className="cl-chain">
      <small>{label}</small>
      <div>
        {steps.map((s, i) => <span key={s}>{i > 0 && <em>→</em>}<code>{s}</code></span>)}
        {struck && <span className="struck"><em>✕</em><code>{struck}</code></span>}
      </div>
    </div>
  );
}

function Channels() {
  const groups = [['local', 'Local emissions', 7], ['global', 'Global forcing', 4], ['month', 'Month sin/cos', 2]];
  return (
    <div className="cl-channels">
      {groups.map(([k, label, n]) => (
        <div key={k} className={k}>
          <div>{Array.from({ length: n }, (_, i) => <i key={i} />)}</div>
          <small>{label} · {n}</small>
        </div>
      ))}
      <b>= 13 input channels</b>
    </div>
  );
}

const SPLIT_ROWS = [
  ['Historical', [[1851, 1999, 'train'], [2000, 2014, 'val']]],
  ['SSP1-2.6', [[2015, 2085, 'train'], [2086, 2100, 'val']]],
  ['SSP2-4.5', [[2015, 2100, 'test']]],
  ['SSP3-7.0', [[2015, 2085, 'train'], [2086, 2100, 'val']]],
  ['SSP5-8.5', [[2015, 2085, 'train'], [2086, 2100, 'val']]],
];
const SPLIT_LABEL = { train: 'Train', val: 'Val', test: 'Test · never seen' };

function SplitChart() {
  const x = (y) => 80 + ((y - 1851) / (2101 - 1851)) * 300;
  return (
    <svg className="cl-gantt" viewBox="0 0 390 190" role="img"
      aria-label="Training split: historical and three SSPs train, last 15 years validate, SSP2-4.5 is the held-out test scenario">
      <defs>
        <pattern id="cl-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" />
        </pattern>
      </defs>
      {SPLIT_ROWS.map(([name, segs], r) => (
        <g key={name} transform={`translate(0 ${r * 30 + 8})`}>
          <text x="72" y="15" textAnchor="end" className="cl-gantt-row">{name}</text>
          {segs.map(([a, b, kind]) => (
            <g key={a}>
              <rect className={kind} x={x(a)} y="0" width={x(b + 1) - x(a) - 2} height="22" rx="4">
                <title>{`${name} ${a}–${b}: ${SPLIT_LABEL[kind]}`}</title>
              </rect>
              {kind !== 'val' && <text x={x(a) + 6} y="15" className={`cl-gantt-in ${kind}`}>{SPLIT_LABEL[kind]}</text>}
            </g>
          ))}
        </g>
      ))}
      <text x={x(2101)} y="168" textAnchor="end" className="cl-gantt-row">Short end bars = Val, last 15 years of each run</text>
      {[1851, 1950, 2015, 2100].map((y) => <text key={y} x={x(y)} y="185" textAnchor="middle" className="cl-gantt-tick">{y}</text>)}
    </svg>
  );
}

const PIPELINE = [
  ['Source', 'Global, monthly, 1850–2100.',
    'ClimateSet (Kaltenborn et al., 2023) packages emissions and rainfall on the same 96 × 144 global grid. Historical runs cover 1850–2014 and four SSP scenarios cover 2015–2100.',
    <SizeBars key="v" />],
  ['Crop', 'Indonesia is exactly 9 × 19 cells.',
    'On the native grid, 11°S–6°N × 95°E–141°E is exactly 9 rows × 19 columns, so cropping by index needs no interpolation. The crop was checked against the data: the highest CO₂ cell sits on Jakarta (−6.6°, 107.5°E).',
    <CropGrid key="v" />],
  ['Scale', 'Make heavy-tailed emissions readable.',
    'Min–max had squashed almost every emission cell to ~0, because a few city cells set the maximum. Emissions now go through asinh and a z-score. Every scaler is fit on training months only.',
    <div key="v" className="cl-chains">
      <Chain label="Rainfall" steps={['kg m⁻² s⁻¹', 'mm/day', 'log1p', 'min–max']} />
      <Chain label="Emissions" steps={['asinh', 'z-score']} struck="min–max" />
    </div>],
  ['Enrich', 'Give the model what physics says matters.',
    'Six channels join the seven local emissions: four global forcing channels computed area-weighted on the full globe before cropping (cumulative CO₂ since 1850, global CH₄, SO₂, black carbon), and two month channels so the model knows the season.',
    <Channels key="v" />],
  ['Split', 'Test on a scenario the model never sees.',
    'The split follows the ClimateBench protocol (Watson-Parris et al., 2022). SSP2-4.5 is held out for all of 2015–2100.',
    <SplitChart key="v" />],
  ['Export', 'Precompute everything the browser needs.',
    'A Python script turns the model output into three JSON files: 20-year means, 1851–1900 baselines, emissions in t/km² per year, and every skill number on this page, reproducible without a GPU.',
    <div key="v" className="cs-bigpair cl-export">
      <span><b>4.2 GB</b>NetCDF source</span>
      <span className="cs-arrow" aria-hidden>→</span>
      <span><b>~1 MB</b>first visit (3.4 MB with every emission layer)</span>
    </div>],
];

function Scrolly() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i))),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="cl-scrolly">
      <div className="cl-stage">
        <div className="cl-stage-n">{String(active + 1).padStart(2, '0')}<small>/ 06 · {PIPELINE[active][0]}</small></div>
        <div className="cl-stage-v" key={active}>{PIPELINE[active][3]}</div>
      </div>
      <ol className="cl-steps">
        {PIPELINE.map(([tab, title, body], i) => (
          <li key={tab} data-i={i} ref={(el) => (refs.current[i] = el)} className={i === active ? 'on' : ''}>
            <small>{String(i + 1).padStart(2, '0')} · {tab}</small>
            <h4>{title}</h4>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Architecture() {
  return (
    <div className="cl-arch" role="img" aria-label="ST-GNN architecture from 12-month input to 3-month output">
      <div className="io">Input · 12 months × 13 channels × 171 nodes</div>
      <div>Linear embedding 13 → 192 + 2-D sinusoidal position encoding</div>
      <div className="cl-arch-block">
        <span className="times">× 6</span>
        <div><b>Causal temporal conv</b> kernel 5</div>
        <div><b>Graph conv (GCN)</b> 8-neighbour</div>
        <div><b>Spatial self-attention</b> 4 heads</div>
        <div><b>Feed-forward</b> 192 → 576 → 192, GELU</div>
        <small>each: residual + LayerNorm</small>
      </div>
      <div>Temporal projection 12 → 3 months</div>
      <div>Output head 192 → 96 → 1, Softplus</div>
      <div className="io">Output · next 3 months × 171 nodes</div>
    </div>
  );
}

const SPEC = [
  ['Framework', 'React 19 + Vite', 'One static build, served under a path of the portfolio domain.'],
  ['Map', 'SVG + d3-geo (equirectangular)', 'The grid is 9 × 19, so zoomable web tiles add nothing. A plain projection maps the grid box exactly onto the view box.'],
  ['Raster', 'Canvas → data URL inside the SVG', 'A smooth colour field without drawing hundreds of SVG shapes.'],
  ['Coastlines', 'Natural Earth 1:50m via world-atlas + topojson-client', 'Public domain, drawn once.'],
  ['Colour', 'd3-scale-chromatic: BrBG for rainfall, viridis + symlog for emissions', 'Diverging scale centred on “no change”; log scale for emissions spanning several orders of magnitude.'],
  ['Charts', 'd3-scale + d3-shape', 'Trend chart with labels placed directly at the line ends.'],
  ['Data', 'Static JSON, precomputed in Python', 'Browser work is limited to indexing and colouring.'],
  ['Hosting', 'Vercel, rewrite from the main domain', 'The map is its own project, mounted under the portfolio’s path.'],
];

const CHALLENGES = [
  {
    title: 'The “out-of-memory” crash that wasn’t',
    body: (
      <>
        <div className="cl-flow3">
          <div><small>What happened</small><p>Training froze for an hour without finishing a single epoch, CPU at 100%. It looked like the machine had run out of memory.</p></div>
          <div><small>Root cause</small><p>The Kaggle session had a <b>TPU</b>, not a GPU. PyTorch/XLA builds a lazy graph; the loop never cut it (<code>mark_step</code>) and read <code>loss.item()</code> every batch, so XLA kept recompiling. Graph scatter/gather ops are also poorly supported on XLA.</p></div>
          <div><small>Fix</small><p>Switch to a T4 GPU. Memory was never the limit: 171 nodes per step, batch size 1, CUDA cache emptied at fixed intervals. Runs are now committed as Kaggle versions, so a browser refresh can’t wipe outputs.</p></div>
        </div>
        <p className="cl-next">Next: if TPU access is ever needed, add <code>xm.mark_step()</code> per batch and accumulate the loss on device.</p>
      </>
    ),
  },
  {
    title: 'Rendering the map smoothly',
    body: (
      <>
        <p className="cl-problem">171 coarse cells look like a blocky checkerboard. Drawing them as SVG shapes, plus thousands of interpolated sub-cells, slows down every slider step.</p>
        <ul className="cl-solutions">
          <li><b>Raster instead of shapes.</b> Values are bilinearly upsampled 12× (9 × 19 → 108 × 228) into a canvas, coloured once, and placed as one <code>&lt;image&gt;</code> in the SVG, aligned to the coastlines by the equirectangular projection.</li>
          <li><b>Precompute offline.</b> 20-year means, baselines and unit conversions happen in Python.</li>
          <li><b>Halve the data.</b> Before 2005 every scenario shares one history, stored once: rainfall 1.95 → 1.01 MB, emissions 4.4 → 2.3 MB.</li>
          <li><b>Load on demand.</b> Emission data downloads only when a layer is opened, and only once.</li>
          <li><b>Memoise.</b> The trend series is not rebuilt while the slider is dragged.</li>
        </ul>
        <div className="cs-stats cl-stats-sm">
          <div><b>1</b><span>&lt;image&gt; per map, not hundreds of SVG cells</span></div>
          <div><b>−46%</b><span>data downloaded on first load</span></div>
          <div><b>1</b><span>emission download, however often the layer is switched</span></div>
        </div>
      </>
    ),
  },
  {
    title: 'Five scenarios, one consistent timeline',
    body: (
      <div className="cl-fixes">
        <div><h5>Scalers that hid the scenarios</h5><p>The notebook refit scalers per scenario, so CO₂ in SSP1-2.6 and SSP5-8.5 both ended at 1.0; only an ID channel told them apart.</p><p><b>Fix:</b> one scaler per variable, fit on training months, ID channel removed. Scenarios now differ through their emissions, as they physically do.</p></div>
        <div><h5>Seams at 2015</h5><p>SSP runs start in January 2015, but the model needs 12 months of history before each prediction.</p><p><b>Fix:</b> each SSP is prefixed with the last 12 historical months; cumulative CO₂ continues from the historical total.</p></div>
        <div><h5>One variable, two definitions</h5><p><code>*_anthro_fires</code> is fire-only before 2015 (about 80% of cells empty) but near-total after.</p><p><b>Fix:</b> global forcing and map layers use the <code>*_no_fires</code> variants, which mean the same in both periods. The mismatch is stated on the map.</p></div>
        <div><h5>Labels that respect 20-year windows</h5><p>A window centred on 2010 mixes validation years with SSP2-4.5 years the model never saw.</p><p><b>Fix:</b> each timeline position takes the label of the least-seen year in its window.</p></div>
      </div>
    ),
  },
];

const AUDIT = [
  'A random split leaked overlapping months between train and test, and the SSP scenarios were in training.',
  'The scalers were refit per scenario.',
  'The whole globe was resized to 9 × 19 instead of cropping Indonesia.',
  'The graph convolution only connected the first graph in each batch, so it was active on 1 of 12 time steps.',
  'Min–max scaling squashed the emissions to ~0, so the model ignored its inputs.',
];

function Dumbbell({ rows, max, label, highlight }) {
  const x = (v) => (v / max) * 100;
  return (
    <figure className="cl-db">
      <div className="cl-db-legend"><span><i className="dot" />CMIP6</span><span><i className="ring" />ST-GNN</span></div>
      {rows.map(([name, a, b]) => (
        <div key={name} className={`cl-db-row ${name === highlight ? 'hl' : ''}`}
          title={`${name}: CMIP6 +${a.toFixed(1)}%, ST-GNN +${b.toFixed(1)}%`}>
          <span className="cl-db-name">{name}{name === highlight && <small>never seen</small>}</span>
          <span className="cl-db-track">
            <i className="bar" style={{ left: `${x(Math.min(a, b))}%`, width: `${Math.abs(x(a) - x(b))}%` }} />
            <i className="dot" style={{ left: `${x(a)}%` }} />
            <i className="ring" style={{ left: `${x(b)}%` }} />
          </span>
          <span className="cl-db-val">+{a.toFixed(1)} / +{b.toFixed(1)}</span>
        </div>
      ))}
      <div className="cl-db-row cl-db-axis" aria-hidden>
        <span /><span className="cl-db-track">
          {[0, 5, 10, 15, 20, 25, 30].filter((t) => t <= max).map((t) => <span key={t} style={{ left: `${x(t)}%` }}>{t}%</span>)}
        </span><span />
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

const ENDS = [['SSP1-2.6', 7.0, 6.7], ['SSP2-4.5', 13.5, 14.9], ['SSP3-7.0', 20.9, 20.5], ['SSP5-8.5', 23.9, 26.5]];
const TW = 600, TH = 300, TL = 36, TR = 96, TT = 14, TB = 28;
const TEND = TREND_START + trend.cmip6.length - 1;
const Y_MIN = -2, Y_MAX = 16;
const tx = (yr) => TL + ((yr - TREND_START) / (TEND - TREND_START)) * (TW - TL - TR);
const ty = (v) => TT + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (TH - TT - TB);
const linePath = (vals) => vals.map((v, i) => `${i ? 'L' : 'M'}${tx(TREND_START + i).toFixed(1)},${ty(v).toFixed(1)}`).join('');
const fmt = (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;

function TrendChart() {
  const [hover, setHover] = useState(null);
  const { cmip6, stgnn } = trend;
  const split = TEST_FROM - TREND_START;
  const stgnnUp = stgnn.at(-1) > cmip6.at(-1);
  const gap = `${linePath(stgnn.slice(0, split + 1))}${cmip6.slice(0, split + 1).map((v, i) =>
    `L${tx(TREND_START + split - i).toFixed(1)},${ty(cmip6[split - i]).toFixed(1)}`).join('')}Z`;

  function onMove(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const yr = Math.round(TREND_START + (((e.clientX - box.left) / box.width) * TW - TL) / (TW - TL - TR) * (TEND - TREND_START));
    setHover(yr >= TREND_START && yr <= TEND ? yr : null);
  }

  const i = hover === null ? null : hover - TREND_START;
  return (
    <figure className="cl-trend">
      <div className="cl-db-legend"><span><i className="ln" />CMIP6</span><span><i className="ln dash" />ST-GNN</span></div>
      <svg viewBox={`0 0 ${TW} ${TH}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img"
        aria-label="SSP2-4.5 rainfall change over Indonesian land since 1851–1900. ST-GNN sits above CMIP6 from the 1870s and ends above it by 2090: +14.9% against +13.5%.">
        <rect className="cl-trend-test" x={tx(TEST_FROM)} y={TT} width={tx(TEND) - tx(TEST_FROM)} height={TH - TT - TB} />
        <text className="cl-trend-note" x={tx(TEST_FROM) + 6} y={TT + 12}>never seen →</text>
        {[0, 4, 8, 12, 16].map((v) => (
          <g key={v} className={`cs-grid ${v === 0 ? 'zero' : ''}`}>
            <line x1={TL} x2={TW - TR} y1={ty(v)} y2={ty(v)} />
            <text x={TL - 6} y={ty(v) + 4} textAnchor="end">{v}%</text>
          </g>
        ))}
        {[1860, 1900, 1950, 2000, 2050, 2090].map((y) => (
          <text key={y} className="cl-trend-tick" x={tx(y)} y={TH - 8} textAnchor="middle">{y}</text>
        ))}
        <path className="cl-trend-gap" d={gap} />
        <path className="cl-trend-line" d={linePath(cmip6)} />
        <path className="cl-trend-line dash" d={linePath(stgnn)} />
        <text className="cl-trend-end" x={TW - TR + 6} y={ty(cmip6.at(-1)) + (stgnnUp ? 12 : -2)}>CMIP6 {fmt(cmip6.at(-1))}</text>
        <text className="cl-trend-end" x={TW - TR + 6} y={ty(stgnn.at(-1)) + (stgnnUp ? -2 : 12)}>ST-GNN {fmt(stgnn.at(-1))}</text>
        {i !== null && (
          <g className="cl-trend-hover">
            <line x1={tx(hover)} x2={tx(hover)} y1={TT} y2={TH - TB} />
            <circle cx={tx(hover)} cy={ty(cmip6[i])} r="4" />
            <circle className="ring" cx={tx(hover)} cy={ty(stgnn[i])} r="4" />
          </g>
        )}
      </svg>
      <figcaption>
        {i !== null
          ? <><b>{hover - 9}–{hover + 10}</b> · CMIP6 <b>{fmt(cmip6[i])}</b> · ST-GNN <b>{fmt(stgnn[i])}</b></>
          : 'SSP2-4.5, change over Indonesian land vs 1851–1900, 20-year windows. Shaded: the gap before the test years. Hover to read a window.'}
      </figcaption>
    </figure>
  );
}

const BASELINES = [
  ['CMIP6 simulation (truth)', '+0.50', '—', '—', 'truth'],
  ['ST-GNN', '+0.30', '0.50', '0.84', 'me'],
  ['Climatology (no change)', '0.00', '—', '0.80'],
  ['Average of SSP1-2.6 and SSP3-7.0', '+0.50', '0.89', '0.29', 'best'],
];

const LIMITS = [
  ['Most of the monthly skill is the seasons.', 'Month to month, the ST-GNN explains 58% of the variation. Repeating the average seasonal cycle explains 57%. The emission-driven part of its skill is small.', 'Report skill on anomalies, with the seasonal cycle removed, as the headline monthly metric.'],
  ['One model, one run.', 'The target is a single run of one climate model (INM-CM4-8). Part of every year-to-year wiggle is that run’s internal variability, which no emission-based model can predict. Another CMIP6 model could show a different pattern over Indonesia.', 'Train on several ensemble members or models, as ClimateBench recommends.'],
  ['The easy test scenario.', 'SSP2-4.5 lies between two training scenarios, so the test checks interpolation, not extrapolation.', 'Hold out SSP5-8.5 instead and train on the other three.'],
  ['Too coarse for local decisions.', 'Each cell is about 210 × 275 km, so Java is only a handful of cells. The map’s smooth colours are blended between cell centres for readability and add no real detail.', 'Statistical downscaling against observations before any local use.'],
  ['A bigger window didn’t help.', 'An annual version with a 10-year emission history overfit: 354 training samples for 3.6 M parameters. It ranked the scenarios wrongly and lost to climatology.', 'A much smaller model, or ridge regression on the global forcing channels, before going deeper.'],
  ['The dataset’s own seams.', 'Fire emissions are defined differently before and after 2015, so fire variables were left out of the map and the global forcing. 1850 serves only as model input, so the baseline starts in 1851.', null],
];

export default function ClimateRainfall({ theme }) {
  return (
    <main className="cs cl">
      <header className="cl-hero">
        <span className="cl-year" aria-hidden>2090</span>
        <Reveal className="cl-hero-text">
          <p className="cs-eyebrow">Case Study · Climate Machine Learning</p>
          <h1>Indonesia Rainfall Map</h1>
          <p className="cs-tagline">How much wetter could Indonesia get by 2100? A climate model’s answer for four
            emission futures, and a graph neural network trained to reproduce it from emissions alone.</p>
          <ul className="cs-badges">{STACK.map((s) => <li key={s}>{s}</li>)}</ul>
          <DemoLink />
        </Reveal>
        <Reveal className="cl-hero-media" delay={0.15}>
          <Link className="cs-hero-link" to={DEMO_URL}>
            <img className="cs-shot" src={heroMap} alt="Indonesia Rainfall Map" width="2940" height="1259" />
          </Link>
        </Reveal>
      </header>

      <ChapterNav title="Indonesia Rainfall Map" chapters={CHAPTERS} />

      <section id="overview" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Overview</p>
          <h2>Climate projections exist. Few people can read them.</h2>
          <p className="cs-lead">Indonesia’s rainfall drives its rice harvests, its floods and its droughts. Climate
            models already simulate how that rainfall changes under different emission futures, but the output is
            4.2 GB of global NetCDF files on a 96 × 144 grid, readable only with scientific tooling.</p>
        </Reveal>

        <Reveal className="cl-questions">
          <div><small>For readers</small><p>Can a single web page show how Indonesia’s rainfall changes from 1860 to
            2090, and how much the emission path matters?</p></div>
          <div><small>For the model</small><p>Can a spatio-temporal graph neural network (ST-GNN) learn that response
            from emissions alone, and does it hold up on a scenario it has never seen?</p></div>
        </Reveal>

        <Reveal className="cl-ribbon">
          <div><b>4.2 GB</b><span>raw NetCDF: 3.31 GB emissions, 890 MB rainfall</span></div>
          <div><b>171</b><span>grid cells over Indonesia, ~210 × 275 km each</span></div>
          <div><b>250 yrs</b><span>of monthly data per scenario, 1851–2100</span></div>
          <div><b>4</b><span>emission scenarios, SSP1-2.6 to SSP5-8.5</span></div>
          <div className="hl"><b>+24%</b><span>rainfall over Indonesian land by 2081–2100 under SSP5-8.5, vs 1851–1900</span></div>
        </Reveal>

        <Reveal>
          <h3 className="cl-h3-row">Drag a year. Watch the rain move.</h3>
          <Carousel theme={theme} />
        </Reveal>
      </section>

      <section id="method" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Method</p>
          <h2>From 4.2 GB of NetCDF to a 1 MB web page.</h2>
        </Reveal>
        <Scrolly />

        <Reveal className="cl-arch-wrap">
          <div>
            <h3>Graph convolution for space, causal convolution for time.</h3>
            <p>The 9 × 19 grid becomes a graph: <b>171 nodes</b>, each linked to its 8 neighbours (1,204 edges plus
              self-loops). Each prediction reads 12 months and forecasts the next 3.</p>
            <ul className="cs-params">
              {['3.58 M parameters', 'hidden 192', '6 blocks', 'AdamW, lr 6e-5', 'Huber loss (β 0.1)',
                '10-epoch warmup + cosine', 'early stopping, patience 15', 'Kaggle T4 GPU'].map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <Architecture />
        </Reveal>

        <Reveal>
          <h3>No server, no tiles, no map API key.</h3>
          <dl className="cl-spec">
            {SPEC.map(([k, v, why]) => (
              <div key={k}><dt>{k}</dt><dd><b>{v}</b><span>{why}</span></dd></div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section id="challenges" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Challenges</p>
          <h2>Most of the work was finding out why the numbers were too good, or too flat.</h2>
        </Reveal>
        <Reveal><Challenges items={CHALLENGES} /></Reveal>
        <Reveal className="cl-audit">
          <div>
            <small>What the audit found</small>
            <p className="cl-audit-r2"><s>R² ≈ 0.60</s></p>
            <p>The research version reported R² ≈ 0.60. Re-auditing it for this portfolio turned up five problems,
              each fixed and re-run. The honest numbers are lower, but they are on a scenario the model never saw,
              and they come with baselines.</p>
          </div>
          <ol>{AUDIT.map((a) => <li key={a}>{a}</li>)}</ol>
        </Reveal>
      </section>

      <section id="results" className="cs-section cs-dark">
        <Reveal>
          <p className="cs-eyebrow">Results</p>
          <h2>Right ranking, right destination, wrong timing.</h2>
        </Reveal>
        <Reveal className="cs-stats">
          <div><b>4 / 4</b><span>scenarios ranked correctly by end-of-century rainfall</span></div>
          <div><b>≤ 2.6 pp</b><span>gap to the climate model by 2081–2100, from 1851–1900, all four scenarios</span></div>
          <div><b>+0.30 <small>vs +0.50</small></b><span>mm/day change on SSP2-4.5, 1995–2014 → 2081–2100, model vs truth, all 171 cells<sup>3</sup></span></div>
          <div><b>0.50</b><span>pattern correlation of that change across the 171 cells<sup>3</sup></span></div>
        </Reveal>

        <Reveal className="cl-results-2">
          <div>
            <h3>Where it ends up</h3>
            <p>Measured against 1851–1900 over Indonesian land, the ST-GNN lands within 2.6 percentage points of the
              climate model in every scenario by 2081–2100, including SSP2-4.5, which it never saw.</p>
            <Dumbbell rows={ENDS} max={30} highlight="SSP2-4.5" label="Rainfall change vs 1851–1900, 2081–2100 (%)" />
          </div>
          <div>
            <h3>When it gets there</h3>
            <p>The model starts the rise too early: +3.8% by 1941–1960 where the climate model shows +1.5%, and +6.2%
              against +3.2% by 1995–2014. So the change <i>from today</i> is underestimated: +0.30 mm/day on SSP2-4.5
              against the true +0.50, across all 171 cells.</p>
            <TrendChart />
          </div>
        </Reveal>

        <Reveal>
          <h3>Against simple baselines<sup>3</sup></h3>
          <table className="cl-table">
            <thead><tr><th>Method</th><th>Change by 2081–2100<br /><small>mm/day</small></th><th>Pattern match<br /><small>higher is better</small></th><th>RMSE<br /><small>lower is better</small></th></tr></thead>
            <tbody>
              {BASELINES.map(([m, c, p, e, tag]) => (
                <tr key={m} className={tag || ''}>
                  <td>{m}{tag === 'best' && <small> best</small>}</td><td>{c}</td><td>{p}</td><td>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cl-after">A plain average of two training scenarios beats the network on this test scenario.
            That is expected: SSP2-4.5 sits between them, so interpolation is easy here. It is also why the map opens
            on the climate model, with the ST-GNN one click away.</p>
        </Reveal>
      </section>

      <section id="limitations" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Limitations</p>
          <h2>Six warnings on these results.</h2>
        </Reveal>
        <ol className="cl-limits">
          {LIMITS.map(([t, body, next], n) => (
            <Reveal key={t} className="cl-limit">
              <span>{String(n + 1).padStart(2, '0')}</span>
              <h4>{t}</h4>
              <div>
                <p>{body}</p>
                {next && <p className="cl-next">Next: {next}</p>}
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="cl-end">
        <Reveal>
          <h2>See it for yourself.</h2>
          <p>Four futures, 250 years, 171 cells, all in the browser.</p>
          <div className="cs-link-row">
            <DemoLink />
            <a className="cs-cta ghost" href={GITHUB_URL}>GitHub repository</a>
          </div>
        </Reveal>
        <ol className="cs-footnotes">
          <li>ClimateSet: Kaltenborn et al. (2023), climateset.github.io. Input4MIPs forcing and CMIP6 output from INM-CM4-8.</li>
          <li>ClimateBench: Watson-Parris et al. (2022), <i>Journal of Advances in Modeling Earth Systems</i>.</li>
          <li>Percent changes are averaged over Indonesian land (each cell weighted by its land share × cos latitude), as
            in the map’s “Indonesia overall”. The mm/day change, pattern match and RMSE are computed over all 171 cells,
            land and sea, from the exported model output by <code>scripts/export_map_data.py</code>. Pattern match is the
            correlation of predicted vs simulated change across those cells.</li>
        </ol>
      </section>
    </main>
  );
}
