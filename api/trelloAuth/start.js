// /api/start.js

const OAUTH_REQUEST_TOKEN_URL = 'https://trello.com/1/OAuthGetRequestToken';
const OAUTH_AUTHORIZE_URL = 'https://trello.com/1/OAuthAuthorizeToken';
const OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken';

const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

export default async function handler(req, res) {
  const OAuth = require('oauth-1.0a');
  const crypto = require('crypto');
  const fetch = require('node-fetch');

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  // 1. Pobierz request token
  const request_data = {
    url: OAUTH_REQUEST_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_callback: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL}/api/callback`,
    },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));
  const params = new URLSearchParams();
  params.append('oauth_callback', `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL}/api/callback`);

  try {
    const response = await fetch(OAUTH_REQUEST_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const text = await response.text();
    const requestParams = new URLSearchParams(text);

    const oauth_token = requestParams.get('oauth_token');
    // 2. Przekieruj do autoryzacji w Trello
    const redirectUrl = `${OAUTH_AUTHORIZE_URL}?oauth_token=${oauth_token}&name=KamanOferty&scope=read,write&expiration=never`;
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (e) {
    res.status(500).json({ error: 'OAuth error', details: e.message });
  }
}
