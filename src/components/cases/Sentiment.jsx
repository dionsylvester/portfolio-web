import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChapterNav from './ChapterNav';
import { Reveal, Pipeline, Challenges } from './parts';
import './cases.css';
import './Sentiment.css';
import heroLight1 from '../../assets/cases/hero-sentiment-light-1.webp';
import heroLight2 from '../../assets/cases/hero-sentiment-light-2.webp';
import heroDark1 from '../../assets/cases/hero-sentiment-dark-1.webp';
import heroDark2 from '../../assets/cases/hero-sentiment-dark-2.webp';

const DEMO_URL = '/sentiment/preview';
const GITHUB_URL = 'https://github.com/dionsylvester/sentiment-analysis';

const STACK = ['Python', 'scikit-learn', 'PyTorch', 'Hugging Face', 'Ollama', 'Groq', 'Pydantic', 'Streamlit'];
const CHAPTERS = [
  ['overview', 'Overview'],
  ['method', 'Method'],
  ['results', 'Results'],
  ['challenges', 'Challenges'],
];

const MODELS = [
  { name: 'LinearSVC', f1: 0.604, acc: 0.611, ms: 0.7, hw: 'CPU', data: '45k tweets', kind: 'classic', lab: [10, 4, 'start'] },
  { name: 'LinearSVC + rules', f1: 0.598, acc: 0.607, ms: 0.7, hw: 'CPU', data: '45k tweets', kind: 'classic', lab: [10, 12, 'start'] },
  { name: 'qwen2.5:7b zero-shot', f1: 0.639, acc: 0.654, ms: 400, hw: 'local GPU', data: 'none', kind: 'llm', lab: [-10, 4, 'end'] },
  { name: 'qwen2.5:7b few-shot', f1: 0.627, acc: 0.647, ms: 463, hw: 'local GPU', data: '6 examples', kind: 'llm', lab: [0, 20, 'middle'] },
  { name: 'gpt-oss-20b zero-shot', f1: 0.675, acc: 0.682, ms: 746, hw: 'free API', data: 'none', kind: 'llm', lab: [0, 20, 'middle'] },
  { name: 'gpt-oss-20b few-shot', f1: 0.684, acc: 0.691, ms: 1056, hw: 'free API', data: '6 examples', kind: 'llm', lab: [0, -12, 'middle'] },
  { name: 'DistilRoBERTa, fine-tuned', f1: 0.692, acc: 0.689, ms: 33, hw: 'CPU, 2 threads', data: '45k tweets', kind: 'ft', lab: [0, -14, 'middle'] },
];

function HeroSlides({ srcs, alt, href }) {
  const [shown, setShown] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setShown((n) => (n + 1) % srcs.length), 3000);
    return () => clearInterval(t);
  }, [paused, srcs.length]);
  return (
    <Link className="cs-hero-link" to={href}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="sa-slides" role="img" aria-label={alt}>
        {srcs.map((s, n) => <img key={n} className={`cs-shot ${n === shown ? 'on' : ''}`} src={s} alt="" width="1960" height="1225" />)}
      </div>
    </Link>
  );
}

function DemoButton() {
  return <Link className="cs-cta" to={DEMO_URL}>Preview Demo</Link>;
}

function AbsaExample() {
  return (
    <div className="sa-absa" aria-label="Sentence-level gives one label; aspect-level gives food positive and service negative">
      <p className="sa-absa-text">“The <mark className="pos">food</mark> was great but the <mark className="neg">service</mark> was slow.”</p>
      <div className="sa-absa-row">
        <small>Sentence-level</small>
        <span className="sa-chip">one label for both?</span>
      </div>
      <div className="sa-absa-row">
        <small>Aspect-level</small>
        <span className="sa-chip pos"><b>food</b> + positive</span>
        <span className="sa-chip neg"><b>service</b> − negative</span>
      </div>
      <code className="sa-json">{'{"aspects": [{"aspect": "food", "sentiment": "positive"}, {"aspect": "service", "sentiment": "negative"}]}'}</code>
    </div>
  );
}

const FEATURES = [
  ['Sentence-by-sentence analysis', 'Paste text or upload TXT, DOCX or PDF. Each sentence gets a label, as in the original app.'],
  ['Model choice', 'LinearSVC, LinearSVC + rules, fine-tuned DistilRoBERTa, or an LLM, on the same input.'],
  ['Evaluation table', 'Every model’s F1, latency and token cost on the same test set, in plain view.'],
  ['Quota-aware LLM', 'LLM input is capped per request and cached. When the shared daily quota runs out, the other models keep working.'],
];

function Stack({ parts }) {
  const total = parts.reduce((s, [, n]) => s + n, 0);
  return (
    <div className="sa-stack">
      {parts.map(([label, n]) => (
        <span key={label} style={{ flex: n }} title={`${label}: ${n.toLocaleString('en')}`}>
          <b>{n.toLocaleString('en')}</b>{label}
        </span>
      ))}
      <small>{total.toLocaleString('en')} total</small>
    </div>
  );
}

const PIPELINE = [
  {
    tab: 'Replace',
    title: 'Start from natural text so the comparison is fair.',
    body: <>The stopword-stripped dataset was replaced with <b>tweet_eval/sentiment</b><sup>1</sup>: English tweets,
      three classes, official splits. Train fits LinearSVC and DistilRoBERTa; validation picks the epoch and the
      few-shot examples; test is the source of the fixed test set.</>,
    visual: <Stack parts={[['train', 45615], ['val', 2000], ['test', 12284]]} />,
  },
  {
    tab: 'Fix the test set',
    title: '1,000 tweets, chosen once, used by every model.',
    body: <>A stratified sample of the official test split (random_state 42). Small enough for rate-limited LLM
      APIs, zero overlap with training, and every <code>id</code> points back to the official row. LinearSVC scores
      0.591 on all 12,284 test tweets and 0.604 on the subset: ~1.3 points high, within sampling noise.</>,
    visual: <Stack parts={[['neutral', 483], ['negative', 324], ['positive', 193]]} />,
  },
  {
    tab: 'Add aspect data',
    title: 'A benchmark where one sentence has several answers.',
    body: <>SemEval-2014 Task 4, Restaurants<sup>2</sup>: 1,120 labelled aspects in 600 test sentences. 65% are
      positive, so “always positive” scores 0.65 accuracy but only 0.263 F1 macro. <b>F1 macro is the headline
      metric throughout.</b></>,
    visual: (
      <div className="cs-bigpair">
        <span><b>228</b>aspects in 80 mixed-polarity sentences</span>
        <span className="cs-arrow" aria-hidden>→</span>
        <span><b>63.6%</b>max accuracy for any sentence-level model</span>
      </div>
    ),
  },
  {
    tab: 'Score fairly',
    title: 'Same metrics, same rows, and a significance test.',
    body: <>One <code>summarize()</code> computes accuracy, precision, recall and F1 macro for every model, plus
      recall macro, the official tweet_eval metric. Pairs of models are compared with McNemar’s test on the same
      1,000 tweets, so a 0.01 F1 gap isn’t mistaken for a win.</>,
    visual: (
      <div className="sa-mcnemar">
        <code>summarize(y_true, y_pred)</code>
        <code>mcnemar(model_a, model_b)</code>
        <span>p &lt; 0.05 → a real difference</span>
      </div>
    ),
  },
];

const W = 620, H = 360, L = 48, R = 24, T = 20, B = 40;
const X0 = -0.5, X1 = 3.5, Y0 = 0.58, Y1 = 0.70;
const sx = (ms) => L + ((Math.log10(ms) - X0) / (X1 - X0)) * (W - L - R);
const sy = (f) => T + ((Y1 - f) / (Y1 - Y0)) * (H - T - B);
const X_TICKS = [[1, '1 ms'], [10, '10 ms'], [100, '100 ms'], [1000, '1 s']];

function Mark({ m }) {
  const x = sx(m.ms), y = sy(m.f1);
  if (m.kind === 'classic') return <rect x={x - 5} y={y - 5} width="10" height="10" rx="1.5" />;
  if (m.kind === 'ft') return <rect x={x - 6} y={y - 6} width="12" height="12" rx="1.5" transform={`rotate(45 ${x} ${y})`} />;
  return <circle cx={x} cy={y} r="6" className={m.data === 'none' ? '' : 'ring'} />;
}

function F1Latency() {
  const [hover, setHover] = useState(null);
  const m = hover === null ? null : MODELS[hover];
  return (
    <figure className="sa-scatter">
      <div className="sa-legend">
        <span><i className="sq" />Classic</span><span><i className="dia" />Fine-tuned</span>
        <span><i className="dot" />LLM zero-shot</span><span><i className="dot ring" />LLM few-shot</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="F1 macro against median latency on a log scale. DistilRoBERTa is highest at 0.692 and 33 ms; gpt-oss-20b reaches 0.684 at about one second; LinearSVC is 0.604 at under a millisecond.">
        {[0.58, 0.62, 0.66, 0.70].map((f) => (
          <g key={f} className="cs-grid">
            <line x1={L} x2={W - R} y1={sy(f)} y2={sy(f)} />
            <text x={L - 8} y={sy(f) + 4} textAnchor="end">{f.toFixed(2)}</text>
          </g>
        ))}
        {X_TICKS.map(([ms, t]) => (
          <g key={ms} className="cs-grid">
            <line x1={sx(ms)} x2={sx(ms)} y1={T} y2={H - B} />
            <text x={sx(ms)} y={H - B + 18} textAnchor="middle">{t}</text>
          </g>
        ))}
        <text className="cs-axis" x={(W + L) / 2} y={H - 4} textAnchor="middle">Median latency per sentence (log scale)</text>
        <text className="cs-axis" transform={`translate(12 ${(H - B) / 2}) rotate(-90)`} textAnchor="middle">F1 macro</text>
        {MODELS.map((mm, n) => (
          <g key={mm.name} className={`sa-pt ${mm.kind} ${hover === n ? 'on' : ''}`}
            onPointerEnter={() => setHover(n)} onPointerLeave={() => setHover(null)}>
            <circle className="hit" cx={sx(mm.ms)} cy={sy(mm.f1)} r="16" />
            <Mark m={mm} />
            <text x={sx(mm.ms) + mm.lab[0]} y={sy(mm.f1) + mm.lab[1]} textAnchor={mm.lab[2]}>{mm.name}</text>
          </g>
        ))}
      </svg>
      <figcaption>
        {m
          ? <><b>{m.name}</b> · F1 {m.f1.toFixed(3)} · {m.ms < 1 ? `~${m.ms} ms` : `${m.ms.toLocaleString('en')} ms`} on {m.hw} · training data: {m.data}</>
          : 'Tweet sentiment, 1,000 tweets. Latencies come from different hardware.³ Hover a point.'}
      </figcaption>
    </figure>
  );
}

function RulesTally() {
  const cells = [...Array(2).fill('fix'), ...Array(6).fill('broke'), 'other'];
  return (
    <div className="sa-tally" aria-label="Rules changed 9 predictions: 2 fixed, 6 broken, 1 changed but still wrong">
      <div>{cells.map((c, i) => <span key={i} className={c}>{c === 'fix' ? '✓' : c === 'broke' ? '✕' : '·'}</span>)}</div>
      <small><b>2 fixed</b> · <b>6 broken</b> · 1 still wrong, of 9 predictions changed (rules fired 13×)</small>
    </div>
  );
}

const CHALLENGES = [
  {
    title: 'A baseline that measured the wrong thing',
    body: (
      <>
        <div className="cl-flow3">
          <div><small>Unnatural data</small><p>98% of the training text had stopwords and negations removed, so the negation rules almost never fired.</p></div>
          <div><small>Leaky split</small><p>Rule examples could land in test, and 105 duplicate texts could sit in both train and test.</p></div>
          <div><small>Different model</small><p><code>app.py</code> trained its own copy with <code>max_features=120000</code>, which the evaluated model didn’t use.</p></div>
        </div>
        <p><b>Fix:</b> a natural-text dataset and a fixed test set built once; one training function shared by the
          app and the notebooks; rule examples go into train only. The honest baseline is <b>0.604</b>, in line with
          the SVM baseline in the TweetEval paper.</p>
        <div className="sa-subcard">
          <h5>The rules, measured for the first time</h5>
          <RulesTally />
          <p>Example: “OKAY if you haven’t seen David Blaine’s specials… watch them” turned positive into neutral
            because of “okay”. The rules stay in the app as a documented baseline, not an improvement.</p>
        </div>
      </>
    ),
  },
  {
    title: 'The free LLM API that took five minutes per answer',
    body: (
      <div className="cl-flow3">
        <div><small>Problem</small><p>Gemini’s free tier returned correct JSON, but each call took 4–6 minutes. 1,000 tweets would take about four days.</p></div>
        <div><small>Diagnosis</small><p>Debug logs showed one request and <code>200 OK</code> after 4 min 17 s, no retries. A bare request without schema took 330 s too, so the code wasn’t the cause. Next day: <code>503</code>.</p></div>
        <div><small>Fix</small><p>The client is provider-agnostic, so switching to <b>Groq</b> was one entry in <code>PROVIDERS</code>. <code>gpt-oss-20b</code> supports strict JSON schemas, so validation stayed the same.</p></div>
      </div>
    ),
  },
  {
    title: 'Quotas and latency that lie',
    body: (
      <div className="cl-fixes">
        <div><h5>Daily limits</h5><p>The real Groq free tier was 1,000 requests per day, not the 14,400 a third-party summary claimed.</p><p><b>Fix:</b> predictions are appended row by row; rerunning resumes where the quota ran out, with nothing lost or repeated.</p></div>
        <div><h5>Cold start</h5><p>Ollama’s first call took 120 s to load the model onto the GPU.</p><p><b>Fix:</b> an unrecorded warm-up call before timing starts.</p></div>
        <div><h5>Rate-limit waits and stalls</h5><p>Retries after a <code>429</code> would count as latency, and 97 of 1,000 calls took over 5 s (one took 10 minutes), pushing the mean to 2.5 s.</p><p><b>Fix:</b> a fixed pause outside the timed call; report the median (1.06 s), keep mean and p90 in the results files.</p></div>
        <div><h5>A partial result that looked like a win</h5><p>After 524 tweets, few-shot led zero-shot by +0.024 F1. After 1,000: +0.009, p = 0.42.</p><p><b>Fix:</b> conclusions wait for the full run and a significance test.</p></div>
      </div>
    ),
  },
  {
    title: 'Notebooks that worked on one platform',
    body: (
      <div className="cl-flow3 two">
        <div><small>Problem</small><p>The fine-tuning notebook was written for Colab but ran on Kaggle. It hung 30 minutes on <code>files.upload()</code>, and a later run was marked failed after training had finished, because of a placeholder Hub repo name.</p></div>
        <div><small>Fix</small><p>It detects Kaggle and copies the repo from read-only <code>/kaggle/input</code>, deletes ~1 GB of checkpoints before zipping, and skips the Hub push unless a repo is set, reading the token from a secret, so “Save Version” runs work.</p></div>
      </div>
    ),
  },
  {
    title: 'An evaluation bug caught before it counted',
    body: (
      <>
        <div className="cl-flow3 two">
          <div><small>Problem</small><p>The first aspect matcher compared characters, not words: gold “port” matched “Portuguese cheese cart”, and “bill” matched “billed”, which would have inflated recall.</p></div>
          <div><small>Fix</small><p>An offline test with a fake LLM fed the gold labels expected 100% polarity accuracy and got less, exposing the bug. The matcher now prefers an exact match, then a whole-word match.</p></div>
        </div>
        <p>Every LLM path is covered by offline tests: resume without repeated calls · invalid output counted as wrong ·
          delimiter stripping · aspect matching.</p>
      </>
    ),
  },
];

export default function SentimentLLM({ theme }) {
  return (
    <main className="cs cl">
      <header className="cs-hero">
        <Reveal>
          <p className="cs-eyebrow">Case Study · NLP · LLM Engineering</p>
          <h1>When Is an LLM<br />Worth It?</h1>
          <p className="cs-tagline">Seven model setups, one fixed test set. A linear SVM, a fine-tuned Transformer and
            two LLMs answer the same 1,000 tweets, then the LLM goes one level deeper: sentiment per aspect.</p>
          <ul className="cs-badges">{STACK.map((s) => <li key={s}>{s}</li>)}</ul>
          <DemoButton />
        </Reveal>
        <Reveal className="cs-hero-media" delay={0.15}>
          <HeroSlides href={DEMO_URL} alt="LLM Sentiment Analysis" srcs={theme === 'dark' ? [heroDark1, heroDark2] : [heroLight1, heroLight2]} />
        </Reveal>
      </header>

      <ChapterNav title="LLM Sentiment Analysis" chapters={CHAPTERS} />

      <section id="overview" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Overview</p>
          <h2>Does “just use an LLM” hold up when you measure it?</h2>
          <p className="cs-lead">It started as a final project for the Language and Technology course at Kindai
            University: a Streamlit app that labels each sentence as positive, neutral or negative with
            <b> TF-IDF + LinearSVC</b>, plus hand-written rules for cases like “not good” or “good scam”. Upgrading it
            raised two questions.</p>
        </Reveal>

        <Reveal className="sa-questions">
          <div><small>Is the jump worth it?</small><p>How much does a fine-tuned Transformer or an LLM gain over a
            classic model, and what does it cost in latency, hardware and API dependency?</p></div>
          <div><small>Is sentence-level enough?</small><p>“The food was great but the service was slow” is positive
            about the food and negative about the service.</p></div>
        </Reveal>

        <Reveal className="sa-broken">
          <div className="sa-broken-head">
            <p className="sa-strike"><s>F1 0.80</s></p>
            <p>The original score measured none of what the upgrade needed to know. A fair test had to come first.</p>
          </div>
          <ul>
            <li><b>Unnatural data.</b> ~98% of training rows had stopwords, negations and punctuation stripped:
              “not”, “no” and “but” appeared in 0% of rows.</li>
            <li><b>Leakage.</b> Rule examples and duplicate texts could land in both train and test.</li>
            <li><b>The wrong model measured.</b> The app trained its own copy with different settings than the one
              that was evaluated.</li>
          </ul>
        </Reveal>

        <Reveal className="cs-stats sa-stats5">
          <div><b>7</b><span>model setups scored on the same 1,000 tweets</span></div>
          <div><b>0.604 <small>→ 0.692</small></b><span>F1 macro, LinearSVC → fine-tuned DistilRoBERTa</span></div>
          <div><b>p = 0.72</b><span>20B LLM with zero examples vs the fine-tuned model: indistinguishable</span></div>
          <div><b>0.549 <small>→ 0.777</small></b><span>F1 on restaurant reviews, sentence- → aspect-level</span></div>
          <div><b>0 <small>/ 5,720</small></b><span>invalid JSON outputs across every LLM call</span></div>
        </Reveal>

        <Reveal className="cs-feature">
          <div>
            <p className="cs-eyebrow small">Key features</p>
            <h3>Pick a model and see what it costs.</h3>
            <p>The headline feature is <b>aspect-based sentiment</b>: the LLM lists every aspect in a review with its
              own sentiment, as validated JSON.</p>
          </div>
          <AbsaExample />
        </Reveal>
        <Reveal className="sa-features">
          {FEATURES.map(([t, d]) => (
            <div key={t}><b>{t}</b><p>{d}</p></div>
          ))}
        </Reveal>
      </section>

      <section id="method" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Method</p>
          <h2>Fix the test before you compare the models.</h2>
        </Reveal>
        <Reveal><Pipeline steps={PIPELINE} /></Reveal>
        <Reveal className="cs-stats">
          <div><b>45,615</b><span>training tweets with natural text</span></div>
          <div><b>1,000</b><span>fixed test tweets, shared by all models</span></div>
          <div><b>1,120</b><span>labelled aspects for ABSA</span></div>
          <div><b>20%</b><span>of aspects sit in mixed-polarity sentences</span></div>
        </Reveal>

        <Reveal>
          <h3 className="cs-h3-center">Three ways to read a sentence.</h3>
          <div className="sa-three">
            <div>
              <small>Classic</small><h4>TF-IDF + LinearSVC</h4>
              <p>Word 1–2 grams, <code>min_df=2</code>, sublinear TF, <code>C=0.3</code>, balanced class weights.
                Trains in ~5 s on a CPU. The original rule layer runs on top as a second variant.</p>
            </div>
            <div>
              <small>Fine-tuned Transformer</small><h4>DistilRoBERTa</h4>
              <p><code>distilroberta-base</code> (82 M), fully fine-tuned with Hugging Face <code>Trainer</code> on a
                Kaggle T4. Best epoch on validation F1 was epoch 1, so it overfits after one pass.</p>
              <p className="sa-why">Not <code>cardiffnlp/twitter-roberta-base-sentiment</code>: it was trained on
                tweet_eval and would leak the test set.</p>
            </div>
            <div>
              <small>LLMs</small><h4>qwen2.5:7b · gpt-oss-20b</h4>
              <p>Local through Ollama and through the Groq API, behind one OpenAI-compatible client, zero-shot and
                with 6 few-shot examples from the validation split.</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="cs-split-2">
          <div>
            <h3>One client for every provider, with validated JSON output.</h3>
            <ul className="sa-bullets">
              <li><b>Structured output.</b> Responses are constrained to a JSON schema (<code>strict: true</code>) and
                validated with Pydantic. Three labels only, which also limits what a prompt injection could make it say.</li>
              <li><b>Provider-agnostic.</b> Ollama, Groq and Gemini sit in one <code>PROVIDERS</code> table: base URL,
                model name and key.</li>
              <li><b>Prompts as files.</b> Versioned in <code>prompts/</code>, never in code.</li>
            </ul>
            <ul className="cs-params">
              {['DistilRoBERTa 82 M', 'lr 2e-5', '3 epochs, best = 1', 'Kaggle T4, 7.5 min', 'qwen2.5:7b via Ollama',
                'gpt-oss-20b via Groq', 'temperature 0', 'JSON schema + Pydantic'].map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="sa-client" role="img" aria-label="LLM client flow from text to validated JSON">
            <div className="sa-node">text <small>&lt;tweet&gt;…&lt;/tweet&gt; delimiters, tags stripped</small></div>
            <div className="sa-node main">call_llm(fields, schema) <small>prompts/*.txt, versioned</small></div>
            <div className="sa-fork">
              <div className="sa-node">Ollama <small>local · qwen2.5:7b</small></div>
              <div className="sa-node">Groq <small>API · gpt-oss-20b</small></div>
            </div>
            <div className="sa-node main">Pydantic validation <small>invalid → counted as wrong</small></div>
            <div className="sa-node">run_resumable() <small>one CSV row per call · resumes after crash or quota · warm-up and pause outside the timer</small></div>
          </div>
        </Reveal>

        <Reveal>
          <p className="cs-eyebrow small">Live demo</p>
          <h3>A demo that can’t run out of money.</h3>
          <p className="sa-status">The app is rebuilt with the portfolio’s palette and runs all four models on free
            tiers, behind one API.</p>
          <div className="sa-grid3">
            <div><b>Streamlit Community Cloud</b><p>The app: Python end to end, so the evaluation code is reused as-is. Embedded here in the site’s light or dark theme.</p></div>
            <div><b>FastAPI on Vercel</b><p>One API for every model, called only by the app with a shared key. The same Dockerfile runs it locally.</p></div>
            <div><b>ONNX int8</b><p>DistilRoBERTa without PyTorch at runtime: F1 0.709 against 0.692 in fp32, same label on 94.2% of tweets.</p></div>
            <div><b>Hugging Face Hub</b><p>The API downloads the ~85 MB model on first use, so the repo stays small.</p></div>
            <div><b>Groq API</b><p>gpt-oss-20b, key kept on the server. Input capped at 10 sentences, repeats cached; when the daily quota is gone, the other models keep working.</p></div>
            <div><b>Three tabs</b><p>Sentiment (model selector, paste or upload TXT, DOCX or PDF) · Aspects · Results. The comparison is the point, so it gets its own tab.</p></div>
          </div>
        </Reveal>
      </section>

      <section id="results" className="cs-section cs-dark">
        <Reveal>
          <p className="cs-eyebrow">Results</p>
          <h2>A 20B LLM ties an 82M model at 23–32× the latency.</h2>
        </Reveal>
        <Reveal><F1Latency /></Reveal>

        <Reveal>
          <table className="cl-table">
            <thead><tr><th>Model</th><th>F1 macro</th><th>Accuracy</th><th>Latency<br /><small>median, 1 sentence</small></th><th>Training data</th></tr></thead>
            <tbody>
              {MODELS.map((m) => (
                <tr key={m.name} className={m.kind === 'ft' ? 'me' : ''}>
                  <td>{m.name}</td><td>{m.f1.toFixed(3)}</td><td>{m.acc.toFixed(3)}</td>
                  <td>{m.ms < 1 ? `~${m.ms} ms` : `${m.ms.toLocaleString('en')} ms`} <small className="sa-hw">{m.hw}{m.hw === 'local GPU' && <sup>3</sup>}</small></td>
                  <td>{m.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal>
          <h3>What the significance tests say</h3>
          <div className="cs-cards">
            <div className="cs-card"><b className="sa-p">p = 0.72 <small>/ 0.95</small></b><h4>gpt-oss-20b vs DistilRoBERTa</h4>
              <p>Zero-shot / few-shot. A 20B LLM that never saw a labelled example ties a fine-tuned 82M model, at
                ~23–32× the latency plus an API dependency.</p></div>
            <div className="cs-card"><b className="sa-p">p = 0.03</b><h4>qwen2.5:7b zero-shot vs LinearSVC</h4>
              <p>Even the small local LLM beats the classic model without any training data.</p></div>
            <div className="cs-card"><b className="sa-p">p = 0.57 <small>/ 0.42</small></b><h4>Few-shot vs zero-shot</h4>
              <p>qwen / gpt-oss. Six examples cost ~1.7–2× the prompt tokens for no significant gain.</p></div>
          </div>
        </Reveal>

        <Reveal className="cs-split-2">
          <div>
            <h3>One level deeper: aspects.</h3>
            <p>On 1,120 restaurant aspects, the aspect-level LLM clears the sentence-level model by 0.23 F1. On the
              228 aspects in mixed-polarity sentences it reaches <b>0.675 accuracy</b>, above the 0.636 ceiling of
              any sentence-level model.</p>
          </div>
          <figure className="cs-figure">
            <ul className="cs-bars">
              {[['Majority (always positive)', 0.263], ['Sentence-level LinearSVC', 0.549], ['qwen2.5:7b, aspect-level', 0.777]].map(([n, v]) => (
                <li key={n} className={v > 0.7 ? 'is-best' : ''} title={`${n}: F1 ${v}`}>
                  <span className="cs-bars-label">{n}</span>
                  <span className="cs-bars-track"><span className="cs-bars-fill pos" style={{ left: 0, width: `${v * 100}%` }} /></span>
                  <span className="cs-bars-value">{v.toFixed(3)}</span>
                </li>
              ))}
            </ul>
            <figcaption>ABSA polarity, F1 macro, SemEval-2014 Restaurants<sup>2</sup></figcaption>
          </figure>
        </Reveal>
        <Reveal className="cs-stats">
          <div><b>0%</b><span>invalid JSON in aspect extraction</span></div>
          <div><b>83.8%</b><span>of gold aspects found</span></div>
          <div><b>90.9%</b><span>of those with the right polarity (76.2% end to end)</span></div>
          <div><b>0.95 s</b><span>median per sentence</span></div>
        </Reveal>
      </section>

      <section id="challenges" className="cs-section">
        <Reveal>
          <p className="cs-eyebrow">Challenges</p>
          <h2>What broke on the way to trustworthy numbers.</h2>
        </Reveal>
        <Reveal><Challenges items={CHALLENGES} /></Reveal>
        <Reveal className="sa-neutral">
          <div>
            <small>What the errors have in common</small>
            <h3>Annotators decide where neutral ends.</h3>
            <p>Every model’s weakest class is neutral. On reviews, “The food was mediocre and the service was severely
              slow” has <i>food</i> annotated as neutral. The fine-tuned model learned where the annotators draw the
              line; a zero-shot LLM applies its own reading, and without more context both are defensible.</p>
            <p className="cl-next">Next: tune the prompt on the validation split (never the test set) with the
              annotation guidelines spelled out, and measure whether it closes the gap.</p>
          </div>
          <div className="sa-neutral-n"><b>177 <small>/ 483</small></b><span>neutral tweets labelled negative by qwen,
            mostly political or news tweets on charged topics</span></div>
        </Reveal>
      </section>

      <section className="cs-section cs-links">
        <Reveal>
          <h2>Dig deeper.</h2>
          <div className="cs-link-row">
            <DemoButton />
            <a className="cs-cta ghost" href={GITHUB_URL}>GitHub repository</a>
          </div>
        </Reveal>
        <ol className="cs-footnotes">
          <li>tweet_eval: Barbieri et al. (2020), <i>TweetEval: Unified Benchmark and Comparative Evaluation for Tweet
            Classification</i>; data from SemEval-2017 Task 4 (Rosenthal et al., 2017).</li>
          <li>SemEval-2014 Task 4: Pontiki et al. (2014), Restaurants domain, via <code>yqzheng/semeval2014_restaurants</code> on the Hugging Face Hub.</li>
          <li>Latencies come from different hardware and are not like-for-like: LinearSVC and DistilRoBERTa on CPU
            (DistilRoBERTa at 2 threads, approximating a free cloud CPU), qwen on a local GPU (NVIDIA GeForce RTX 2060, 6 GB), gpt-oss through Groq’s free
            API. Each is a median over one sentence per call.</li>
          <li>All metrics are recomputed from the saved prediction files in <code>results/</code>. The full revision
            history, including every failure above, is in <code>CHANGELOG.md</code>.</li>
        </ol>
      </section>
    </main>
  );
}
