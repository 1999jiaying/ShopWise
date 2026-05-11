const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.render('index');
});

app.get('/sample/:section?', (req, res) => {
  const section = req.params.section || 'overview';

  const name     = req.query.name     || 'Golden Bowl Noodles';
  const category = req.query.category || 'Restaurant';
  const address  = req.query.address  || 'Financial District, San Francisco';
  const rating   = parseFloat(req.query.rating)  || 4.1;
  const reviews  = parseInt(req.query.reviews)   || 89;

  const shopData = {
    name, category, address, rating, reviews,

    // ── Reality Check top-line ───────────────────────────────────
    marketPressure:        'High',
    fixabilityScore:       58,
    competitionSaturation: 'High',
    localDemandTrend:      'Declining',
    onlineVisibility:      'Weak',
    footTrafficLevel:      'Below average',
    consumerSpending:      'Pressured',
    costPressure:          'High',
    nearbyCompetitorCount: 14,

    // ── Controllable factors (scored 0–100) ──────────────────────
    controllableScore: 38,
    controllable: [
      { label: 'Google Visibility',  score: 30, detail: '3 photos on Maps profile · incomplete business info',            priority: true },
      { label: 'Review Health',      score: 55, detail: '4.1 stars · 89 reviews (area average is 240)',                   priority: false },
      { label: 'Menu Clarity',       score: 40, detail: '38 items with no hierarchy, sections, or photos',                priority: true },
      { label: 'Website Quality',    score: 35, detail: 'Missing opening hours, address, and order button above the fold', priority: true },
      { label: 'Opening Hours Fit',  score: 60, detail: 'Closed Sundays — misses growing brunch demand in the area',      priority: false },
      { label: 'Differentiation',    score: 45, detail: 'No clear positioning vs 14 similar nearby competitors',          priority: true },
      { label: 'Social Presence',    score: 20, detail: 'No Instagram or active social accounts found',                   priority: false },
    ],

    // ── External factors ─────────────────────────────────────────
    externalPressureScore: 72,
    external: [
      { label: 'Competition Density',   level: 'High',         chip: 'high', detail: '14 similar restaurants within 500m of your location' },
      { label: 'Local Demand',          level: 'Declining',    chip: 'high', detail: 'Office vacancy ~28% in Financial District post-2020' },
      { label: 'Consumer Spending',     level: 'Pressured',    chip: 'med',  detail: 'SF cost-of-living reducing dining-out frequency' },
      { label: 'Foot Traffic',          level: 'Below average',chip: 'med',  detail: 'Incomplete post-pandemic office return in the area' },
      { label: 'Cost Environment',      level: 'High',         chip: 'high', detail: 'SF rent and ingredient costs well above national average' },
    ],

    // ── Diagnosis ────────────────────────────────────────────────
    diagnosis: 'Your business may not be struggling only because of poor marketing. The Financial District area shows declining lunch foot traffic and high restaurant saturation — these are structural pressures outside your control. However, your Google visibility, review count, and menu clarity are all meaningfully below the area average and are fixable within weeks.',

    // ── Strategy ─────────────────────────────────────────────────
    strategyLabel: 'Fix basics + Differentiate',
    strategyDesc:  'Your execution has clear, fixable gaps — but the market is also working against you. Improving visibility and menu basics could meaningfully help. Long-term, plan for loyal customer retention and a distinct positioning to survive the area\'s high saturation.',

    // ── Competitor benchmark ─────────────────────────────────────
    benchmark: {
      reviewCountPercentile: 22,
      ratingPercentile:      64,
      photoPercentile:       12,
      nearbyCount:           14,
      areaAvgRating:         4.3,
      areaAvgReviews:        240,
      areaAvgPhotos:         22,
    },

    // ── Prioritised actions ──────────────────────────────────────
    actions: [
      {
        icon: '📸',
        title: 'Add 10+ photos to your Google Maps profile',
        detail: 'Your profile has 3 photos. Nearby competitors average 22. This is the fastest, lowest-cost visibility improvement available to you.',
        effort: 'Low', impact: 'High',
      },
      {
        icon: '⭐',
        title: 'Respond to your 6 unanswered Google reviews',
        detail: 'You have 6 unanswered reviews, including 2 critical ones. Responding improves trust signals and local search ranking.',
        effort: 'Low', impact: 'High',
      },
      {
        icon: '🍽️',
        title: 'Restructure your menu with a Signatures section',
        detail: 'Create a "Signature Dishes" section with 5–7 items and photos. Reduces decision fatigue and increases average order value.',
        effort: 'Medium', impact: 'Medium',
      },
      {
        icon: '🌐',
        title: 'Fix your website: add hours, address, order button',
        detail: 'Your homepage is missing three critical items above the fold. These fixes take under 2 hours and directly reduce bounce rate.',
        effort: 'Low', impact: 'Medium',
      },
      {
        icon: '🎯',
        title: 'Define and communicate one clear differentiator',
        detail: 'With 14 similar restaurants nearby, pick one thing you do better than anyone and make it visible on your Google profile, menu, and website.',
        effort: 'Medium', impact: 'High',
      },
    ],

    currentSection: section,
  };

  res.render('dashboard', { shopData });
});

app.post('/analyze', (req, res) => {
  const { shopName, category, address, rating, reviews, website } = req.body;
  const params = new URLSearchParams();
  if (shopName) params.set('name', shopName);
  if (category) params.set('category', category);
  if (address)  params.set('address', address);
  if (rating)   params.set('rating', rating);
  if (reviews)  params.set('reviews', reviews);
  if (website)  params.set('website', website);
  res.redirect(`/sample/overview?${params.toString()}`);
});

app.get('/pricing', (_req, res) => {
  res.render('pricing');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ShopWise running on http://localhost:${PORT}`);
  });
}

module.exports = app;
