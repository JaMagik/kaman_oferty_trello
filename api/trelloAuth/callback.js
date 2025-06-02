import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_ACCESS_TOKEN_URL = '[https://trello.com/1/OAuthGetAccessToken](https://trello.com/1/OAuthGetAccessToken)'; // Poprawiono

const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default async function handler(req, res) {
  console.log('[API Callback] Rozpoczęcie przetwarzania callbacku OAuth Trello.');

  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    console.error("[API Callback] Brak klucza API Trello lub sekretu w zmiennych środowiskowych.");
    return res.status(500).send(`
      <!DOCTYPE html><html><head><title>Błąd Konfiguracji</title></head>
      <body><p>Błąd konfiguracji serwera. Skontaktuj się z administratorem.</p>
      <script>window.close();</script></body></html>
    `);
  }

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const { oauth_token, oauth_verifier } = req.query;
  console.log(`[API Callback] Otrzymano oauth_token: ${oauth_token}, oauth_verifier: ${oauth_verifier}`);


  if (!oauth_token || !oauth_verifier) {
    console.error('[API Callback] Brak oauth_token lub oauth_verifier w zapytaniu.');
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`
      <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
      <body><p>Brak wymaganych parametrów autoryzacji.</p>
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Brak oauth_token lub oauth_verifier.' }, '${APP_BASE_URL}');
        }
        window.close();
      </script></body></html>
    `);
  }

  const request_data = {
    url: OAUTH_ACCESS_TOKEN_URL,
    method: 'POST',
    data: { 
      oauth_token,
      oauth_verifier,
    },
  };

  const params = new URLSearchParams();
  params.append('oauth_token', oauth_token);
  params.append('oauth_verifier', oauth_verifier);
  
  const headers = oauth.toHeader(oauth.authorize(request_data, {key: oauth_token, secret: ''})); 

  try {
    console.log('[API Callback] Wysyłanie żądania o access token do Trello...');
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params, 
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`[API Callback] Błąd API Trello przy pobieraniu access token: ${response.status} ${response.statusText}`, text);
      res.setHeader('Content-Type', 'text/html');
      return res.status(response.status).send(`
        <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
        <body><p>Nie udało się uzyskać access token od Trello: ${text}</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Nie udało się uzyskać access token: ${text.replace(/'/g, "\\'")}' }, '${APP_BASE_URL}');
          }
          window.close();
        </script></body></html>
      `);
    }
    console.log('[API Callback] Otrzymano odpowiedź od Trello dla access token:', text);

    const accessParams = new URLSearchParams(text);
    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');

    if (accessToken && accessTokenSecret) {
      console.log(`[API Callback] Uzyskano accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret}`);
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html><html><head><title>Autoryzacja Powiodła Się</title></head>
        <body><p>Autoryzacja zakończona pomyślnie. Zamykanie okna...</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'TRELLO_OAUTH_SUCCESS',
              accessToken: '${accessToken}',
              accessTokenSecret: '${accessTokenSecret}'
            }, '${APP_BASE_URL}');
          }
          window.close();
        </script></body></html>
      `);
    } else {
      console.error('[API Callback] Nie znaleziono accessToken lub accessTokenSecret w odpowiedzi Trello:', text);
      res.setHeader('Content-Type', 'text/html');
      res.status(400).send(`
        <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
        <body><p>Niekompletne dane autoryzacji otrzymane od Trello.</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Niekompletne dane autoryzacji od Trello.' }, '${APP_BASE_URL}');
          }
          window.close();
        </script></body></html>
      `);
    }
  } catch (e) {
    console.error('[API Callback] Krytyczny błąd w procesie OAuth callback:', e);
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`
      <!DOCTYPE html><html><head><title>Błąd Wewnętrzny</title></head>
      <body><p>Wewnętrzny błąd serwera podczas przetwarzania autoryzacji.</p>
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Wewnętrzny błąd serwera: ${e.message.replace(/'/g, "\\'")}' }, '${APP_BASE_URL}');
        }
        window.close();
      </script></body></html>
    `);
  }
}