import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_REQUEST_TOKEN_URL = 'https://trello.com/1/OAuthGetRequestToken';
const OAUTH_AUTHORIZE_URL = 'https://trello.com/1/OAuthAuthorizeToken';

const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;
// Upewnij się, że NEXT_PUBLIC_BASE_URL jest pełnym URL (np. https://twoja-domena.vercel.app)
// lub VERCEL_URL jest poprawnie ustawione przez Vercel.
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');


export default async function handler(req, res) {
  console.log('[API Start] Rozpoczęcie procesu OAuth Trello.');
  console.log(`[API Start] Używany APP_BASE_URL do konstruowania callback: ${APP_BASE_URL}`);

  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    console.error("[API Start] Brak klucza API Trello lub sekretu w zmiennych środowiskowych.");
    return res.status(500).json({ error: 'Błąd konfiguracji serwera', details: 'Brak danych uwierzytelniających Trello API.' });
  }

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const oauth_callback_url = `${APP_BASE_URL}/api/trelloAuth/callback`;
  console.log(`[API Start] URL zwrotny OAuth, który zostanie wysłany do Trello: ${oauth_callback_url}`);

  const request_data = {
    url: OAUTH_REQUEST_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_callback: oauth_callback_url,
    },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));
  const params = new URLSearchParams();
  params.append('oauth_callback', oauth_callback_url);

  try {
    console.log('[API Start] Wysyłanie żądania o request token do Trello...');
    const response = await fetch(OAUTH_REQUEST_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const text = await response.text();

    if (!response.ok) {
      console.error(`[API Start] Błąd API Trello przy pobieraniu request token: ${response.status} ${response.statusText}`, text);
      return res.status(500).json({ error: 'Błąd API Trello', details: `Nie udało się uzyskać request token: ${text}` });
    }
    console.log('[API Start] Otrzymano odpowiedź od Trello dla request token:', text);

    const requestParams = new URLSearchParams(text);
    const oauth_token = requestParams.get('oauth_token');

    if (!oauth_token) {
        console.error("[API Start] Nie znaleziono oauth_token w odpowiedzi Trello:", text);
        return res.status(500).json({ error: 'Błąd API Trello', details: 'Nie znaleziono oauth_token w odpowiedzi.' });
    }
    console.log(`[API Start] Uzyskano oauth_token: ${oauth_token}`);

    const redirectUrl = `${OAUTH_AUTHORIZE_URL}?oauth_token=${oauth_token}&name=KamanOferty&scope=read,write&expiration=never`;
    console.log(`[API Start] Przekierowywanie użytkownika do: ${redirectUrl}`);
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (e) {
    console.error('[API Start] Krytyczny błąd w procesie OAuth:', e.message, e.stack);
    res.status(500).json({ error: 'Błąd procesu OAuth', details: e.message });
  }
}

// Poniższa funkcja uploadAttachment jest tutaj niepotrzebna, znajdowała się w jednym z dostarczonych plików, ale nie jest częścią logiki start.js
// export async function uploadAttachment(cardId, file) { ... }