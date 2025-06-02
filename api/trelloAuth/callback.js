import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_ACCESS_TOKEN_URL = '[https://trello.com/1/OAuthGetAccessToken](https://trello.com/1/OAuthGetAccessToken)'; // Poprawiono: Usunięto formatowanie Markdown

const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default async function handler(req, res) {
  console.log('[API Callback] Rozpoczęcie przetwarzania callbacku OAuth Trello.');
  console.log(`[API Callback] Używany APP_BASE_URL (dla postMessage targetOrigin): ${APP_BASE_URL}`);


  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    console.error("[API Callback] Brak klucza API Trello lub sekretu w zmiennych środowiskowych.");
    return res.status(500).send(`
      <!DOCTYPE html><html><head><title>Błąd Konfiguracji</title></head>
      <body><p>Błąd konfiguracji serwera. Skontaktuj się z administratorem.</p>
      <script>console.error('Błąd konfiguracji serwera w callback.js'); window.close();</script></body></html>
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
  console.log(`[API Callback] Otrzymano z Trello: oauth_token: ${oauth_token}, oauth_verifier: ${oauth_verifier}`);


  if (!oauth_token || !oauth_verifier) {
    console.error('[API Callback] Brak oauth_token lub oauth_verifier w zapytaniu od Trello.');
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`
      <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
      <body><p>Brak wymaganych parametrów autoryzacji od Trello.</p>
      <script>
        if (window.opener) {
          console.log('[API Callback] Wysyłanie TRELLO_OAUTH_ERROR - brak token/verifier do:', '${APP_BASE_URL}');
          window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Brak oauth_token lub oauth_verifier od Trello.' }, '${APP_BASE_URL}');
        } else {
          console.error('[API Callback] Brak window.opener do wysłania błędu.');
        }
        window.close();
      </script></body></html>
    `);
  }

  const request_data_for_access_token = { // Zmieniono nazwę dla jasności
    url: OAUTH_ACCESS_TOKEN_URL,
    method: 'POST',
    data: { // Te dane są używane do podpisu OAuth
      oauth_token: oauth_token, // Użyj tokena otrzymanego od Trello
      oauth_verifier: oauth_verifier, // Użyj verifiera otrzymanego od Trello
    },
  };
  
  // Tworzenie ciała żądania POST
  const params = new URLSearchParams();
  params.append('oauth_token', oauth_token);
  params.append('oauth_verifier', oauth_verifier);
  
  // Generowanie nagłówków OAuth. Ważne: token secret dla request tokena nie jest tutaj używany (jest pusty dla Trello na tym etapie)
  const token_for_access_request = { key: oauth_token, secret: '' }; // Sekret request tokena nie jest potrzebny do wymiany na access token
  const auth_headers_for_access_token = oauth.toHeader(oauth.authorize(request_data_for_access_token, token_for_access_request)); 
  console.log('[API Callback] Nagłówki autoryzacyjne dla żądania access token:', JSON.stringify(auth_headers_for_access_token));

  try {
    console.log(`[API Callback] Wysyłanie żądania o access token do: ${OAUTH_ACCESS_TOKEN_URL}`);
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...auth_headers_for_access_token, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params, 
    });

    const responseText = await response.text(); // Zmieniono nazwę z 'text' na 'responseText'
    if (!response.ok) {
      console.error(`[API Callback] Błąd API Trello (${response.status}) przy pobieraniu access token: ${responseText}`);
      res.setHeader('Content-Type', 'text/html');
      return res.status(response.status).send(`
        <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
        <body><p>Nie udało się uzyskać access token od Trello: ${responseText}</p>
        <script>
          if (window.opener) {
            console.log('[API Callback] Wysyłanie TRELLO_OAUTH_ERROR - błąd API Trello do:', '${APP_BASE_URL}');
            window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Nie udało się uzyskać access token od Trello: ${responseText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}' }, '${APP_BASE_URL}');
          } else {
            console.error('[API Callback] Brak window.opener do wysłania błędu API Trello.');
          }
          window.close();
        </script></body></html>
      `);
    }
    console.log('[API Callback] Otrzymano odpowiedź od Trello dla access token:', responseText);

    const accessParams = new URLSearchParams(responseText);
    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');

    if (accessToken && accessTokenSecret) {
      console.log(`[API Callback] Uzyskano accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret.substring(0, 5)}... (skrócony)`);
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html><html><head><title>Autoryzacja Powiodła Się</title></head>
        <body><p>Autoryzacja zakończona pomyślnie. Zamykanie okna...</p>
        <script>
          if (window.opener) {
            console.log('[API Callback] Wysyłanie TRELLO_OAUTH_SUCCESS do:', '${APP_BASE_URL}');
            window.opener.postMessage({
              type: 'TRELLO_OAUTH_SUCCESS',
              accessToken: '${accessToken}',
              accessTokenSecret: '${accessTokenSecret}'
            }, '${APP_BASE_URL}'); // Użyj APP_BASE_URL jako targetOrigin
          } else {
            console.error('[API Callback] Brak window.opener do wysłania sukcesu.');
          }
          window.close();
        </script></body></html>
      `);
    } else {
      console.error('[API Callback] Nie znaleziono accessToken lub accessTokenSecret w odpowiedzi Trello:', responseText);
      res.setHeader('Content-Type', 'text/html');
      res.status(400).send(`
        <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
        <body><p>Niekompletne dane autoryzacji otrzymane od Trello.</p>
        <script>
          if (window.opener) {
            console.log('[API Callback] Wysyłanie TRELLO_OAUTH_ERROR - niekompletne dane do:', '${APP_BASE_URL}');
            window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Niekompletne dane autoryzacji od Trello.' }, '${APP_BASE_URL}');
          } else {
            console.error('[API Callback] Brak window.opener do wysłania błędu niekompletnych danych.');
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
          console.log('[API Callback] Wysyłanie TRELLO_OAUTH_ERROR - błąd wewnętrzny serwera do:', '${APP_BASE_URL}');
          window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Wewnętrzny błąd serwera: ${e.message.replace(/'/g, "\\'").replace(/\n/g, "\\n")}' }, '${APP_BASE_URL}');
        } else {
          console.error('[API Callback] Brak window.opener do wysłania błędu wewnętrznego serwera.');
        }
        window.close();
      </script></body></html>
    `);
  }
}