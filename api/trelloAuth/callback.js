// /api/callback.js

const OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken';
const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

export default async function handler(req, res) {
  const OAuth = require('oauth-1.0a');
  const crypto = require('crypto');
  const fetch = require('node-fetch');

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const { oauth_token, oauth_verifier } = req.query;

  if (!oauth_token || !oauth_verifier) {
    return res.status(400).send('Brak oauth_token lub oauth_verifier');
  }

  // Zamiana request tokena na access token
  const request_data = {
    url: OAUTH_ACCESS_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_token,
      oauth_verifier,
    },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));
  const params = new URLSearchParams();
  params.append('oauth_token', oauth_token);
  params.append('oauth_verifier', oauth_verifier);

  try {
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const text = await response.text();
    const accessParams = new URLSearchParams(text);

    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');
    // W tym miejscu masz oba potrzebne tokeny!

    // --- PRZEKAZANIE DO FRONTU ---
    // Najprościej: przekieruj z tokenami do ścieżki frontendowej z query params (np. /?accessToken=...&accessTokenSecret=...)
const redirectUrl = `https://kaman-oferty-trello.vercel.app/?accessToken=${accessToken}&accessTokenSecret=${accessTokenSecret}`;
    res.writeHead(302, { Location: redirectUrl });
    res.end();

  } catch (e) {
    res.status(500).send('Błąd przy pozyskiwaniu access tokena: ' + e.message);
  }
}
