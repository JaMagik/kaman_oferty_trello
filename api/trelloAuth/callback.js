// ścieżka: api/trelloAuth/callback.js
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query; //
  const { TRELLO_PUBLIC_API_KEY, TRELLO_SECRET } = process.env; //

  if (!oauth_token || !oauth_verifier) {
    return res.status(400).send('Brak oauth_token lub oauth_verifier w zapytaniu.');
  }

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET }, //
    signature_method: 'HMAC-SHA1', //
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64'); //
    }
  });

  const request_data = {
    url: 'https://trello.com/1/OAuthGetAccessToken', //
    method: 'POST', //
    data: { oauth_token, oauth_verifier } //
  };

  // WAŻNE: Token przekazany do `oauth.authorize` w tym miejscu powinien być
  // tokenem tymczasowym (request token), który otrzymałeś w `oauth_token` z query.
  // Nie potrzebujesz tutaj `accessTokenSecret` z poprzedniego kroku,
  // ponieważ OAuth 1.0a używa sekretu konsumenta i sekretu tokenu tymczasowego (jeśli jest).
  // Biblioteka `oauth-1.0a` powinna sama sobie z tym poradzić, jeśli `oauth_token` jest przekazany w `data`.
  const headers = oauth.toHeader(oauth.authorize(request_data, { key: oauth_token, secret: '' })); // Sekret tokenu tymczasowego jest pusty dla tego żądania


  try {
    const response = await fetch(request_data.url, { method: 'POST', headers }); //
    const text = await response.text(); //

    if (!response.ok) {
      console.error('Trello OAuthGetAccessToken error:', text);
      return res.status(response.status).send(`Błąd podczas uzyskiwania tokenu dostępu: ${text}`);
    }

    const params = new URLSearchParams(text); //
    const accessToken = params.get('oauth_token'); //
    const accessTokenSecret = params.get('oauth_token_secret'); //

    if (accessToken && accessTokenSecret) {
      // WAŻNE: W tym miejscu powinieneś bezpiecznie przechować accessToken i accessTokenSecret
      // na swoim backendzie, powiązane z użytkownikiem Trello (np. z jego ID).
      // Poniższy skrypt tylko zamyka okno autoryzacji i sygnalizuje sukces.

      res.setHeader('Content-Type', 'text/html');
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
              // Spróbuj wysłać tokeny do głównego okna Power-Upa (main.js)
              // To może być trudne do bezpośredniego wycelowania,
              // ale t.authorize() powinno obsłużyć zamknięcie okna i rozwiązanie obietnicy.
              if (window.opener && window.opener.parent && window.opener.parent !== window.opener) {
                 // Sprawdź, czy opener istnieje i nie jest tym samym oknem (co może się zdarzyć w niektórych scenariuszach debugowania)
                 // oraz czy ma dostęp do TrelloPowerUp (co może nie być prawdą bezpośrednio stąd)
                 // Bezpieczniej jest polegać na rozwiązaniu obietnicy t.authorize() w main.js
                 // i tam obsłużyć pobranie/zapisanie tokenów.
              }

              // Najważniejsze: poinformuj bibliotekę Trello Power-Up o zakończeniu autoryzacji.
              // To spowoduje rozwiązanie obietnicy zwróconej przez t.authorize() w main.js.
              if (window.TrelloPowerUp && typeof window.TrelloPowerUp.closeAuthorize === 'function') {
                window.TrelloPowerUp.closeAuthorize();
              } else {
                // Fallback, jeśli skrypt Trello nie jest dostępny (np. podczas testowania poza Trello)
                window.close();
              }
            } catch (e) {
              console.error("Błąd w closeAuthorize lub window.close:", e);
              window.close(); // Spróbuj zamknąć w każdym przypadku
            }
          </script>
        </body>
        </html>
      `);
    } else {
      console.error('Nie udało się sparsować accessToken lub accessTokenSecret z odpowiedzi Trello:', text);
      res.status(500).send('Nie udało się uzyskać tokenów dostępu z odpowiedzi Trello.');
    }
  } catch (error) {
    console.error('Błąd serwera w /api/trelloAuth/callback:', error);
    res.status(500).send(`Błąd serwera: ${error.message || error.toString()}`);
  }
}