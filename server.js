const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/sample/:section?', (req, res) => {
  const section = req.params.section || 'overview';
  const shopData = {
    name: req.query.name || 'Golden Bowl Noodles',
    address: req.query.address || 'San Francisco, CA',
    overallScore: 72,
    scores: {
      location: 82,
      menu: 68,
      competitors: 55,
      reviews: 89,
      online: 48
    },
    recommendations: [
      {
        icon: '📸',
        title: 'Add high-quality food photos to Google Maps',
        desc: 'Increase profile clicks by ~40% and direction requests by 35%.',
        impact: 'High Impact',
        bgColor: '#f3f4f6'
      },
      {
        icon: '🥡',
        title: 'Create a weekday lunch combo',
        desc: 'Target office workers within 400m with a $13 lunch special.',
        impact: 'High Impact',
        bgColor: '#f3f4f6'
      },
      {
        icon: '🌐',
        title: 'Optimize your website homepage',
        desc: 'Add opening hours, location, and order button above the fold.',
        impact: 'Medium Impact',
        bgColor: '#f3f4f6'
      }
    ],
    currentSection: section
  };
  res.render('dashboard', { shopData });
});

app.post('/analyze', (req, res) => {
  const { shopName, address } = req.body;
  // In a real app, this would process the data
  res.redirect(`/sample/overview?name=${encodeURIComponent(shopName)}&address=${encodeURIComponent(address)}`);
});

app.get('/pricing', (req, res) => {
  res.render('pricing');
});

// Start server locally; export for Vercel serverless
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ShopWise app running on http://localhost:${PORT}`);
  });
}

module.exports = app;