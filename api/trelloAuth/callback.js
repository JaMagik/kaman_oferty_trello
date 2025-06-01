// /api/callback.js

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export default async function handler(req, res) {
  const trelloApiKey = process.env.TRELLO_PUBLIC_API_KEY;
  const trelloApiSecret = process.env.TRELLO_SECRET;

  const { oauth_token, oauth_verifier } = req.query;

  if (!oauth_token || !oauth_verifier) {
    return res.status(400).send('Brak oauth_token lub oauth_verifier!');
  }

  const oauth = OAuth({
    consumer: { key: trelloApiKey, secret: trelloApiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const requestData = {
    url: 'https://trello.com/1/OAuthGetAccessToken',
    method: 'POST',
    data: {
      oauth_token,
      oauth_verifier
    }
  };

  try {
    const response = await fetch(requestData.url, {
      method: 'POST',
      headers: oauth.toHeader(oauth.authorize(requestData))
    });

    const text = await response.text();
    const params = Object.fromEntries(new URLSearchParams(text));

    // Na tym etapie masz accessToken oraz accessTokenSecret
    // Wyświetl je użytkownikowi lub przekaż do aplikacji frontendowej
    // Najprościej: przekieruj na frontend z tokenami w URL
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/?accessToken=${params.oauth_token}&accessTokenSecret=${params.oauth_token_secret}`;
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (e) {
    res.status(500).json({ message: 'Błąd pobierania tokena dostępu', error: e.message });
  }
}
