const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/price', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
      {
        params: {
          vs_currency: 'usd',
          days: '1',
          interval: 'hourly'
        }
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crypto prices' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));