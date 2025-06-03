import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken';
const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

const APP_BASE_URL =
  (process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default async function handler(req, res) {
  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    return res.status(500).send("Brak kluczy Trello.");
  }

  const { oauth_token, oauth_verifier } = req.query;
  if (!oauth_token || !oauth_verifier) {
    return res.status(400).send("Brak wymaganych parametrów autoryzacji od Trello.");
  }

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const request_data = {
    url: OAUTH_ACCESS_TOKEN_URL,
    method: 'POST',
    data: { oauth_token, oauth_verifier }
  };

  const params = new URLSearchParams();
  params.append('oauth_token', oauth_token);
  params.append('oauth_verifier', oauth_verifier);

  // MUSI być secret: ''
  const headers = oauth.toHeader(
    oauth.authorize(request_data, { key: oauth_token, secret: '' })
  );

  try {
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(`Błąd Trello: ${text}`);
    }

    const accessParams = new URLSearchParams(text);
    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');

    if (!accessToken || !accessTokenSecret) {
      return res.status(400).send("Niekompletne dane z Trello.");
    }

    // Prosta odpowiedź HTML do popupu
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html><html><head><title>Autoryzacja Trello</title></head>
      <body>
        <p>Autoryzacja zakończona. Możesz zamknąć to okno.</p>
        <script>
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'TRELLO_OAUTH_SUCCESS',
              accessToken: '${accessToken}',
              accessTokenSecret: '${accessTokenSecret}'
            }, '${APP_BASE_URL}');
          }
          try { window.close(); } catch(e) {}
        </script>
      </body></html>
    `);
  } catch (e) {
    res.status(500).send("Błąd serwera: " + e.message);
  }
}
