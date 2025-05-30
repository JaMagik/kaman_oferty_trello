import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;
  const { TRELLO_PUBLIC_API_KEY, TRELLO_SECRET } = process.env;

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const request_data = {
    url: 'https://trello.com/1/OAuthGetAccessToken',
    method: 'POST',
    data: { oauth_token, oauth_verifier }
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));

  const response = await fetch(request_data.url, { method: 'POST', headers });
  const text = await response.text();

  // Ostateczny token użytkownika!
  const params = new URLSearchParams(text);
  const accessToken = params.get('oauth_token');
  const accessTokenSecret = params.get('oauth_token_secret');

  // Dla przykładu: wyślij do frontendu (ale normalnie ZAPISZ w DB)
  res.status(200).json({ accessToken, accessTokenSecret });
}
