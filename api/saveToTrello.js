// ŚCIEŻKA: /api/saveToTrello.js

// Upewnij się, że w ustawieniach projektu na Vercel masz dodaną zmienną środowiskową:
// TRELLO_PUBLIC_API_KEY = 0f932c28c8d97d03741c8863c2ff4afb

import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Tylko metoda POST jest dozwolona' });
  }

  const { cardId, token, fileDataUrl, fileName } = req.body;

  // Pobierz klucz API Trello z Vercel ENV
  const trelloPublicKey = process.env.TRELLO_PUBLIC_API_KEY;

  if (!cardId || !token || !fileDataUrl || !fileName || !trelloPublicKey) {
    console.error('Brakujące dane:', { cardId, token, fileDataUrl, fileName, trelloPublicKey });
    return res.status(400).json({ message: 'Brak wszystkich wymaganych danych (cardId, token, fileDataUrl, fileName lub publiczny klucz API Trello).' });
  }

  try {
    // Rozbij Data URL na base64
    const parts = fileDataUrl.split(',');
    if (parts.length < 2) {
      console.error('Nieprawidłowy format fileDataUrl');
      return res.status(400).json({ message: 'Nieprawidłowy format fileDataUrl.' });
    }
    const base64Data = parts[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Przygotuj FormData
    const form = new FormData();
    form.append('key', trelloPublicKey); // Klucz API
    form.append('token', token);         // Token użytkownika
    form.append('file', buffer, {
      filename: fileName,
      contentType: 'application/pdf',
    });

    const trelloApiUrl = `https://api.trello.com/1/cards/${cardId}/attachments`;
    console.log(`Wysyłanie żądania do Trello API: ${trelloApiUrl}`);

    const trelloApiResponse = await fetch(trelloApiUrl, {
      method: 'POST',
      body: form,
      // Nagłówki Content-Type ustawi FormData automatycznie
    });

    if (trelloApiResponse.ok) {
      const trelloData = await trelloApiResponse.json();
      console.log('Plik pomyślnie dodany do Trello:', trelloData);
      res.status(200).json({ message: 'Plik pomyślnie dodany do Trello', data: trelloData });
    } else {
      const errorText = await trelloApiResponse.text();
      console.error(`Błąd Trello API (status: ${trelloApiResponse.status}):`, errorText);
      res.status(trelloApiResponse.status).json({ message: `Błąd Trello API: ${errorText}` });
    }
  } catch (error) {
    console.error('Wewnętrzny błąd serwera przy zapisie do Trello:', error);
    res.status(500).json({ message: `Wewnętrzny błąd serwera: ${error.message || error.toString()}` });
  }
}
