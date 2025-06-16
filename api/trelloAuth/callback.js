// jamagik/kaman_oferty_trello/kaman_oferty_trello-bfb2142551adeb7f98df4053f558f65743fcf124/api/trelloAuth/callback.js

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken';
const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

const parseCookies = (cookieHeader) => {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });
  return list;
};

export default async function handler(req, res) {
  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    return res.status(500).send("Brak kluczy Trello.");
  }

  const { oauth_token, oauth_verifier } = req.query;
  const cookies = parseCookies(req.headers.cookie);
  const oauth_token_secret = cookies.trello_oauth_secret;

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send("Brak wymaganych parametrów autoryzacji. Sesja mogła wygasnąć.");
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

  const headers = oauth.toHeader(
    oauth.authorize(request_data, { key: oauth_token, secret: oauth_token_secret })
  );

  try {
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const text = await response.text();
    res.setHeader('Set-Cookie', 'trello_oauth_secret=; HttpOnly; Path=/; Max-Age=0');

    if (!response.ok) {
      return res.status(response.status).send(`Błąd Trello: ${text}`);
    }

    const accessParams = new URLSearchParams(text);
    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');

    if (!accessToken || !accessTokenSecret) {
      return res.status(400).send("Niekompletne dane z Trello.");
    }

    // ### ZMIENIONA CZĘŚĆ ###
    // Zamiast postMessage, zapisujemy tokeny do localStorage i zamykamy okno.
    // Aplikacja-matka zareaguje na zdarzenie 'storage'.
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html><html><head><title>Autoryzacja Trello</title></head>
      <body>
        <p>Autoryzacja zakończona pomyślnie. To okno zostanie zamknięte za chwilę.</p>
        <script>
          localStorage.setItem('trello_access_token', '${accessToken}');
          localStorage.setItem('trello_access_token_secret', '${accessTokenSecret}');
          
          // Dajemy przeglądarce chwilę na zapisanie danych przed zamknięciem
          setTimeout(() => {
            try { window.close(); } catch(e) {
              document.body.innerHTML = "<h1>Możesz już zamknąć to okno.</h1>";
            }
          }, 100);
        </script>
      </body></html>
    `);
  } catch (e) {
    res.status(500).send("Błąd serwera: " + e.message);
  }
}