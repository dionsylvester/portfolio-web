import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE = 'https://dionsylvester.com'
const NAME = 'Dionisius Sylvester Wime'

const HOME = {
  title: `${NAME} - Portfolio`,
  description: 'Dion’s portfolio of machine learning case studies on climate projections, LLM sentiment analysis and battery life.',
  image: 'home',
}
const BATTERY = {
  title: 'Battery Health Prediction',
  description: 'How many cycles does a lithium-ion cell have left? This lightweight model estimates it from a single charge–discharge cycle.',
  image: 'battery',
}
const CLIMATE = {
  title: 'Indonesia Rainfall Map',
  description: 'How much wetter could Indonesia get by 2100? A climate model answers for four emission futures, and a graph neural network learns to reproduce it.',
  image: 'climate',
}
const SENTIMENT = {
  title: 'LLM Sentiment Analysis',
  description: 'When is an LLM worth it? A linear SVM, a fine-tuned Transformer and two LLMs label the same 1,000 tweets.',
  image: 'sentiment',
}

const PAGES = {
  '/': HOME,
  '/about': { ...HOME, title: `About - ${NAME}` },
  '/battery': BATTERY,
  '/battery/preview': BATTERY,
  '/climate': CLIMATE,
  '/climate/preview': CLIMATE,
  '/sentiment': SENTIMENT,
  '/sentiment/preview': SENTIMENT,
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export const tags = (path, { title, description, image }) => [
  `<meta name="description" content="${esc(description)}" />`,
  `<meta property="og:type" content="website" />`,
  `<meta property="og:site_name" content="${NAME}" />`,
  `<meta property="og:url" content="${SITE}${path}" />`,
  `<meta property="og:title" content="${esc(title)}" />`,
  `<meta property="og:description" content="${esc(description)}" />`,
  `<meta property="og:image" content="${SITE}/og/${image}.jpg" />`,
  `<meta property="og:image:width" content="1200" />`,
  `<meta property="og:image:height" content="630" />`,
  `<meta name="twitter:card" content="summary_large_image" />`,
].join('\n    ')

export default function linkPreviews() {
  const home = tags('/', PAGES['/'])
  return {
    name: 'link-previews',
    transformIndexHtml: (html) => html.replace('</head>', `  ${home}\n  </head>`),
    writeBundle({ dir }, bundle) {
      const html = bundle['index.html'].source
      if (!html.includes(home)) throw new Error('link-previews: home tags not found in index.html')
      for (const [path, page] of Object.entries(PAGES)) {
        if (path === '/') continue
        const file = join(dir, `${path.slice(1)}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html.replace(home, tags(path, page)))
      }
    },
  }
}
