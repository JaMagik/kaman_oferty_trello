// /api/saveToTrello.js
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
    return res.status(400).json({ message: 'Brak wymaganych danych' });
  }

  try {
    // Konwersja base64 do Buffer
    const matches = fileDataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Niepoprawny format pliku PDF (base64)');
    }
    const pdfBuffer = Buffer.from(matches[2], 'base64');

    // OAuth 1.0a
    const oauth = OAuth({
      consumer: { key: trelloApiKey, secret: trelloApiSecret },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });

    const url = `https://api.trello.com/1/cards/${cardId}/attachments`;
    const form = new FormData();
    form.append('file', pdfBuffer, { filename: fileName, contentType: 'application/pdf' });
    form.append('name', fileName);

    // OAuth header
    const request_data = {
      url,
      method: 'POST'
    };
    const headers = oauth.toHeader(
      oauth.authorize(request_data, { key: accessToken, secret: accessTokenSecret })
    );

    // Dodaj nagłówki z form-data (np. boundary)
    const fullHeaders = {
      ...headers,
      ...form.getHeaders(),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: fullHeaders,
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Błąd zapisu w Trello: ${errorText}`);
    }

    res.status(200).json({ message: 'Plik dodany do Trello.' });
  } catch (err) {
    console.error('Błąd:', err);
    res.status(500).json({ message: err.message || 'Internal server error.' });
  }
}
