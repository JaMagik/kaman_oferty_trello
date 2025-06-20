import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_REQUEST_TOKEN_URL = 'https://trello.com/1/OAuthGetRequestToken';
const OAUTH_AUTHORIZE_URL = 'https://trello.com/1/OAuthAuthorizeToken';

const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

// === OSTATECZNA POPRAWKA: Ustawiamy URL na stałe ===
const APP_BASE_URL = 'https://kaman-oferty-trello.vercel.app';

export default async function handler(req, res) {
  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    console.error("Brak klucza API Trello lub sekretu w zmiennych środowiskowych.");
    return res.status(500).json({ error: 'Brak danych uwierzytelniających Trello API.' });
  }

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const oauth_callback_url = `${APP_BASE_URL}/api/trelloAuth/callback`;

  const request_data = {
    url: OAUTH_REQUEST_TOKEN_URL,
    method: 'POST',
    data: { oauth_callback: oauth_callback_url },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));
  const params = new URLSearchParams();
  params.append('oauth_callback', oauth_callback_url);

  try {
    const response = await fetch(OAUTH_REQUEST_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const text = await response.text();

    if (!response.ok) {
      console.error(`Błąd Trello przy pobieraniu request token: ${text}`);
      return res.status(500).json({ error: 'Błąd Trello', details: text });
    }

    const requestParams = new URLSearchParams(text);
    const oauth_token = requestParams.get('oauth_token');
    const oauth_token_secret = requestParams.get('oauth_token_secret');

    if (!oauth_token || !oauth_token_secret) {
      console.error("Brak oauth_token lub oauth_token_secret w odpowiedzi Trello:", text);
      return res.status(500).json({ error: 'Niekompletna odpowiedź z Trello.', details: text });
    }

    res.setHeader('Set-Cookie', `trello_oauth_secret=${oauth_token_secret}; HttpOnly; Path=/; Secure; SameSite=Lax; Max-Age=300`);

    const redirectUrl = `${OAUTH_AUTHORIZE_URL}?oauth_token=${oauth_token}&name=KamanOferty&scope=read,write&expiration=never`;
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (e) {
    console.error('Błąd procesu OAuth:', e);
    res.status(500).json({ error: 'Błąd procesu OAuth', details: e.message });
  }
}