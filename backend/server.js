const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

const COINGECKO_API_KEY = 'CG-S2BGdw8oDgFHZ6dvD4Szkjii';

app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend API is running on port ' + PORT);
});

app.get('/api/price', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum',
      {
        headers: {
          'X-CoinAPI-Key': COINGECKO_API_KEY
        }
      }
    );
    res.json(data);
  } catch (err) {
    console.error('Error fetching current crypto prices from CoinGecko:', err.message);
    res.status(err.response ? err.response.status : 500).json({ error: 'Failed to fetch current crypto prices from CoinGecko' });
  }
});

app.get('/api/v3/coins/:id/history', async (req, res) => {
  const coinId = req.params.id;
  const date = req.query.date;

  if (!coinId || !date) {
    return res.status(400).json({ error: 'Coin ID and date are required for historical data.' });
  }

  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${date}`,
      {
        headers: {
          'X-CoinAPI-Key': COINGECKO_API_KEY
        }
      }
    );
    res.json(data);
  } catch (err) {
    console.error(`Error fetching historical data for ${coinId} on ${date} from CoinGecko:`, err.message);
    res.status(err.response ? err.response.status : 500).json({ error: `Failed to fetch historical data for ${coinId} from CoinGecko.` });
  }
});


app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
