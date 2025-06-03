// Plik: api/trelloAuth/callback.js
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken';

const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

// Ta zmienna jest kluczowa dla poprawnego działania postMessage.
// Musi ona dokładnie odpowiadać originowi Twojej głównej aplikacji na Vercel.
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default async function handler(req, res) {
  console.log('[API Callback] Handler wywołany.'); // LOG 1
  console.log(`[API Callback] Metoda żądania: ${req.method}`); // LOG 2
  console.log(`[API Callback] Otrzymane query params z Trello: ${JSON.stringify(req.query)}`); // LOG 3
  console.log(`[API Callback] Używany APP_BASE_URL (dla postMessage targetOrigin): ${APP_BASE_URL}`); // LOG 4

  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    console.error("[API Callback] KRYTYCZNY BŁĄD: Brak klucza API Trello lub sekretu w zmiennych środowiskowych.");
    res.setHeader('Content-Type', 'text/html');
    return res.status(500).send(`
      <!DOCTYPE html><html><head><title>Błąd Konfiguracji</title></head>
      <body><p>Błąd konfiguracji serwera. Skontaktuj się z administratorem.</p>
      <script>console.error('[API Callback Script] Błąd konfiguracji serwera w callback.js'); try { window.opener && window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Błąd konfiguracji serwera Trello po stronie API.' }, '${APP_BASE_URL}'); window.close(); } catch(e) { console.error('Błąd przy próbie zamknięcia okna:', e); }</script></body></html>
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

  if (!oauth_token || !oauth_verifier) {
    console.error('[API Callback] BŁĄD: Brak oauth_token lub oauth_verifier w zapytaniu.'); // LOG 5
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`
      <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
      <body><p>Brak wymaganych parametrów autoryzacji od Trello (token lub verifier).</p>
      <script>
        if (window.opener && !window.opener.closed) {
          console.log('[API Callback Script] Wysyłanie TRELLO_OAUTH_ERROR - brak token/verifier do targetOrigin:', '${APP_BASE_URL}');
          window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Brak oauth_token lub oauth_verifier od Trello.' }, '${APP_BASE_URL}');
        } else {
          console.error('[API Callback Script] Brak window.opener lub jest zamknięte - nie można wysłać błędu.');
        }
        try { window.close(); } catch(e) { console.error('Błąd przy próbie zamknięcia okna:', e); }
      </script></body></html>
    `);
  }
  console.log(`[API Callback] Otrzymano oauth_token: ${oauth_token}, oauth_verifier: ${oauth_verifier}`); // LOG 6

  const request_data_for_access_token = {
    url: OAUTH_ACCESS_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_token: oauth_token,
      oauth_verifier: oauth_verifier,
    },
  };

  const params_for_body = new URLSearchParams();
  params_for_body.append('oauth_token', oauth_token);
  params_for_body.append('oauth_verifier', oauth_verifier);

  // Ważne: Do podpisania żądania o access token, Trello oczekuje, że 'oauth_token_secret' (request token secret) będzie pusty.
  // Trello nie zwraca request token secret w pierwszym etapie w sposób standardowy dla OAuth 1.0a (gdzie czasem jest on potrzebny).
  // Zamiast tego, używa się samego request tokena (oauth_token) i API secret (consumer secret) do podpisania.
  // W bibliotece 'oauth-1.0a', jeśli token secret nie jest jawnie podany w obiekcie 'token',
  // biblioteka użyje consumer secret. W tym przypadku, Trello tego wymaga.
  const token_for_access_request_signature = { key: oauth_token }; // Używamy pustego stringa dla token secret, oauth-1.0a użyje consumer secret.

  const auth_headers_for_access_token = oauth.toHeader(oauth.authorize(request_data_for_access_token, token_for_access_request_signature));
  console.log('[API Callback] Nagłówki autoryzacyjne dla żądania access token:', JSON.stringify(auth_headers_for_access_token)); // LOG 6.1

  try {
    console.log(`[API Callback] Próba wysłania żądania o access token do: ${OAUTH_ACCESS_TOKEN_URL}`); // LOG 7
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...auth_headers_for_access_token, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params_for_body,
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error(`[API Callback] BŁĄD API Trello (${response.status}) przy pobieraniu access token: ${responseText}`); // LOG 8
      res.setHeader('Content-Type', 'text/html');
      return res.status(response.status).send(`
        <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
        <body><p>Nie udało się uzyskać access token od Trello: ${responseText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        <script>
          if (window.opener && !window.opener.closed) {
            console.log('[API Callback Script] Wysyłanie TRELLO_OAUTH_ERROR - błąd API Trello do targetOrigin:', '${APP_BASE_URL}');
            window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Nie udało się uzyskać access token od Trello: ${responseText.replace(/'/g, "\\'").replace(/\n/g, "\\n")}' }, '${APP_BASE_URL}');
          } else {
            console.error('[API Callback Script] Brak window.opener lub jest zamknięte - nie można wysłać błędu API Trello.');
          }
          try { window.close(); } catch(e) { console.error('Błąd przy próbie zamknięcia okna:', e); }
        </script></body></html>
      `);
    }
    console.log('[API Callback] SUKCES: Otrzymano odpowiedź od Trello dla access token:', responseText); // LOG 9

    const accessParams = new URLSearchParams(responseText);
    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');

    if (accessToken && accessTokenSecret) {
      console.log(`[API Callback] SUKCES: Uzyskano accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret.substring(0, 5)}... (skrócony). Przygotowanie do wysłania postMessage do targetOrigin: ${APP_BASE_URL}`); // LOG 10
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html><html><head><title>Autoryzacja Powiodła Się</title></head>
        <body><p>Autoryzacja zakończona pomyślnie. Zamykanie okna...</p>
        <script>
          if (window.opener && !window.opener.closed) {
            console.log('[API Callback Script] Wysyłanie TRELLO_OAUTH_SUCCESS do targetOrigin:', '${APP_BASE_URL}');
            window.opener.postMessage({
              type: 'TRELLO_OAUTH_SUCCESS',
              accessToken: '${accessToken}',
              accessTokenSecret: '${accessTokenSecret}'
            }, '${APP_BASE_URL}');
          } else {
            console.error('[API Callback Script] Brak window.opener lub jest zamknięte - nie można wysłać sukcesu.');
          }
          try { window.close(); } catch(e) { console.error('Błąd przy próbie zamknięcia okna:', e); }
        </script></body></html>
      `);
    } else {
      console.error('[API Callback] BŁĄD: Nie znaleziono accessToken lub accessTokenSecret w odpowiedzi Trello:', responseText); // LOG 11
      res.setHeader('Content-Type', 'text/html');
      res.status(400).send(`
        <!DOCTYPE html><html><head><title>Błąd Autoryzacji</title></head>
        <body><p>Niekompletne dane autoryzacji otrzymane od Trello.</p>
        <script>
          if (window.opener && !window.opener.closed) {
            console.log('[API Callback Script] Wysyłanie TRELLO_OAUTH_ERROR - niekompletne dane do targetOrigin:', '${APP_BASE_URL}');
            window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Niekompletne dane autoryzacji od Trello.' }, '${APP_BASE_URL}');
          } else {
            console.error('[API Callback Script] Brak window.opener lub jest zamknięte - nie można wysłać błędu niekompletnych danych.');
          }
          try { window.close(); } catch(e) { console.error('Błąd przy próbie zamknięcia okna:', e); }
        </script></body></html>
      `);
    }
  } catch (e) {
    console.error('[API Callback] KRYTYCZNY BŁĄD w bloku try-catch:', e.message, e.stack); // LOG 12
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`
      <!DOCTYPE html><html><head><title>Błąd Wewnętrzny</title></head>
      <body><p>Wewnętrzny błąd serwera podczas przetwarzania autoryzacji.</p>
      <script>
        if (window.opener && !window.opener.closed) {
          console.log('[API Callback Script] Wysyłanie TRELLO_OAUTH_ERROR - błąd wewnętrzny serwera do targetOrigin:', '${APP_BASE_URL}');
          window.opener.postMessage({ type: 'TRELLO_OAUTH_ERROR', message: 'Wewnętrzny błąd serwera: ${e.message ? e.message.replace(/'/g, "\\'").replace(/\n/g, "\\n") : "Nieznany błąd serwera."}' }, '${APP_BASE_URL}');
        } else {
          console.error('[API Callback Script] Brak window.opener lub jest zamknięte - nie można wysłać błędu wewnętrznego serwera.');
        }
        try { window.close(); } catch(e) { console.error('Błąd przy próbie zamknięcia okna:', e); }
      </script></body></html>
    `);
  }
}