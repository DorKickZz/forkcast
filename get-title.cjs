
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/title', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'URL fehlt' });

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const title = $('title').text();

    if (!title) return res.status(404).json({ error: 'Kein Titel gefunden' });

    res.json({ title });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen', details: error.message });
  }
});

app.listen(3001, () => console.log('✅ Titel-Proxy läuft auf http://localhost:3001'));
