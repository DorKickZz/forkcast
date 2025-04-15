// api/title.ts
export default async function handler(req, res) {
    const { url } = req.query;
  
    if (!url) {
      return res.status(400).json({ error: 'URL fehlt' });
    }
  
    try {
      const response = await fetch(url as string);
      const html = await response.text();
      const match = html.match(/<title>(.*?)<\/title>/i);
      const title = match ? match[1] : null;
  
      if (!title) return res.status(404).json({ error: 'Kein Titel gefunden' });
  
      res.status(200).json({ title });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen' });
    }
  }
  