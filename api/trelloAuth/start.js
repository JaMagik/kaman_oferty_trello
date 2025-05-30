// api/trelloAuth/start.js
import crypto from 'crypto'; //
import OAuth from 'oauth-1.0a'; //
import fetch from 'node-fetch'; //

export default async function handler(req, res) {
  const { TRELLO_PUBLIC_API_KEY, TRELLO_SECRET, NEXT_PUBLIC_APP_URL } = process.env;
  const KAMAN_APP_URL = NEXT_PUBLIC_APP_URL || 'https://kaman-oferty-trello.vercel.app'; // Użyj zmiennej środowiskowej
  const callbackUrl = `${KAMAN_APP_URL}/api/trelloAuth/callback`; //
  const appName = 'KamanOfertyPowerUp'; //

  const oauth = OAuth({ //
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET }, //
    signature_method: 'HMAC-SHA1', //
    hash_function(base_string, key) { //
      return crypto.createHmac('sha1', key).update(base_string).digest('base64'); //
    }
  });

  const request_data = { //
    url: 'https://trello.com/1/OAuthGetRequestToken', //
    method: 'POST', //
    data: { oauth_callback: callbackUrl } //
  };

  const headers = oauth.toHeader(oauth.authorize(request_data)); //

  try {
    const response = await fetch(request_data.url, { method: 'POST', headers }); //
    const text = await response.text(); //

    if (!response.ok) {
      console.error('Trello OAuthGetRequestToken error:', text); //
      return res.status(response.status).send(`Error getting request token: ${text}`); //
    }

    const params = new URLSearchParams(text); //
    const oauthToken = params.get('oauth_token'); //

    if (!oauthToken) {
      console.error('oauth_token not found in response:', text); //
      return res.status(500).send('Failed to retrieve oauth_token.'); //
    }
    // Poprawiony URL autoryzacyjny, usunięto encje HTML
    const trelloAuthUrl = `https://trello.com/1/OAuthAuthorizeToken?oauth_token=${oauthToken}&name=${encodeURIComponent(appName)}&expiration=never&scope=read,write`;
    res.redirect(trelloAuthUrl); //

  } catch (error) {
    console.error('Error in /api/trelloAuth/start:', error); //
    res.status(500).send(`Server error: ${error.message}`); //
  }
}