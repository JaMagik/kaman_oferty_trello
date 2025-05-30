import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { TRELLO_PUBLIC_API_KEY, TRELLO_SECRET } = process.env;
  const callbackUrl = 'https://twoja-aplikacja.vercel.app/api/trelloAuth/callback';

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const request_data = {
    url: 'https://trello.com/1/OAuthGetRequestToken',
    method: 'POST',
    data: { oauth_callback: callbackUrl }
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));

  const response = await fetch(request_data.url, { method: 'POST', headers });
  const text = await response.text();

  const params = new URLSearchParams(text);
  const oauthToken = params.get('oauth_token');

  res.redirect(`https://trello.com/1/OAuthAuthorizeToken?oauth_token=${oauthToken}`);
}
