// api/trelloAuth/callback.js
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query; //
  const { TRELLO_PUBLIC_API_KEY, TRELLO_SECRET, NEXT_PUBLIC_APP_URL } = process.env;
  // Upewnij się, że KAMAN_APP_URL jest poprawnie ustawiony, najlepiej przez zmienną środowiskową
  const KAMAN_APP_URL = NEXT_PUBLIC_APP_URL || 'https://kaman-oferty-trello.vercel.app';

  if (!oauth_token || !oauth_verifier) {
    return res.status(400).send('Brak oauth_token lub oauth_verifier w zapytaniu.'); //
  }

  const oauth = OAuth({ //
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET }, //
    signature_method: 'HMAC-SHA1', //
    hash_function(base_string, key) { //
      return crypto.createHmac('sha1', key).update(base_string).digest('base64'); //
    }
  });

  const request_data = { //
    url: 'https://trello.com/1/OAuthGetAccessToken', //
    method: 'POST', //
    data: { oauth_token, oauth_verifier } //
  };
  const headers = oauth.toHeader(oauth.authorize(request_data, { key: oauth_token, secret: '' })); //

  try {
    const response = await fetch(request_data.url, { method: 'POST', headers }); //
    const text = await response.text(); //

    if (!response.ok) {
      console.error('Trello OAuthGetAccessToken error:', text); //
      return res.status(response.status).send(`Błąd podczas uzyskiwania tokenu dostępu: ${text}`); //
    }

    const params = new URLSearchParams(text); //
    const accessToken = params.get('oauth_token'); //
    const accessTokenSecret = params.get('oauth_token_secret'); //

    if (accessToken && accessTokenSecret) {
      const successPayload = {
        type: 'TRELLO_AUTH_SUCCESS',
        accessToken,
        accessTokenSecret
      };

      res.setHeader('Content-Type', 'text/html'); //
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Trello Authorization Complete</title>
          <script src="https://p.trellocdn.com/power-up.min.js"></script>
        </head>
        <body>
          <p>Autoryzacja zakończona pomyślnie. Zamykanie okna...</p>
          <script>
            try {
              if (window.opener && window.opener.postMessage) {
                // Wyślij tokeny do okna, które otworzyło popup autoryzacyjny (main.js)
                window.opener.postMessage(${JSON.stringify(successPayload)}, '${new URL(KAMAN_APP_URL).origin}');
              } else {
                console.warn('Nie znaleziono window.opener lub window.opener.postMessage do wysłania tokenów.');
              }

              if (window.TrelloPowerUp && typeof window.TrelloPowerUp.closeAuthorize === 'function') {
                window.TrelloPowerUp.closeAuthorize();
              } else {
                console.warn('TrelloPowerUp.closeAuthorize nie jest dostępne, zamykanie przez window.close()');
                window.close();
              }
            } catch (e) {
              console.error("Błąd w postMessage lub closeAuthorize:", e);
              window.close(); // Spróbuj zamknąć w każdym przypadku
            }
          </script>
        </body>
        </html>
      `); //
    } else {
      console.error('Nie udało się sparsować accessToken lub accessTokenSecret z odpowiedzi Trello:', text); //
      res.status(500).send('Nie udało się uzyskać tokenów dostępu z odpowiedzi Trello.'); //
    }
  } catch (error) {
    console.error('Błąd serwera w /api/trelloAuth/callback:', error); //
    res.status(500).send(`Błąd serwera: ${error.message || error.toString()}`); //
  }
}