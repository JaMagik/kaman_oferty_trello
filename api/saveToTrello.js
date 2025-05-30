// ścieżka: /api/saveToTrello.js

import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Tylko metoda POST jest dozwolona' });
  }

  const { cardId, accessToken, accessTokenSecret, fileDataUrl, fileName } = req.body;

  const trelloApiKey = process.env.TRELLO_PUBLIC_API_KEY;
  const trelloApiSecret = process.env.TRELLO_SECRET;

  if (!cardId || !accessToken || !accessTokenSecret || !fileDataUrl || !fileName) {
    console.error('Brakujące dane:', { cardId, accessToken, accessTokenSecret, fileDataUrl, fileName });
    return res.status(400).json({ message: 'Brak wymaganych danych' });
  }

  try {
    // Konwersja base64 do Buffer
    const base64Data = fileDataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Przygotuj FormData
    const form = new FormData();
    form.append('file', buffer, { filename: fileName, contentType: 'application/pdf' });

    // Konfiguracja OAuth
    const oauth = OAuth({
      consumer: { key: trelloApiKey, secret: trelloApiSecret },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      }
    });

    const request_data = {
      url: `https://api.trello.com/1/cards/${cardId}/attachments`,
      method: 'POST'
    };

    const token = { key: accessToken, secret: accessTokenSecret };
    const headers = {
      ...oauth.toHeader(oauth.authorize(request_data, token)),
      ...form.getHeaders()
    };

    const response = await fetch(request_data.url, {
      method: 'POST',
      headers,
      body: form
    });

    if (response.ok) {
      const trelloData = await response.json();
      console.log('Plik został dodany do Trello:', trelloData);
      res.status(200).json({ message: 'Plik dodany do Trello', data: trelloData });
    } else {
      const errorText = await response.text();
      console.error(`Błąd Trello API (status: ${response.status}):`, errorText);
      res.status(response.status).json({ message: `Błąd Trello API: ${errorText}` });
    }
  } catch (error) {
    console.error('Błąd serwera przy zapisie do Trello:', error);
    res.status(500).json({ message: `Błąd serwera: ${error.message || error.toString()}` });
  }
}
