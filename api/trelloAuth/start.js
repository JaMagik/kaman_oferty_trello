// /api/start.js

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export default async function handler(req, res) {
  const trelloApiKey = process.env.TRELLO_PUBLIC_API_KEY;
  const trelloApiSecret = process.env.TRELLO_SECRET;

  if (!trelloApiKey || !trelloApiSecret) {
    return res.status(500).json({ message: 'Brak API KEY/SECRET!' });
  }

  const oauth = OAuth({
    consumer: { key: trelloApiKey, secret: trelloApiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const requestData = {
    url: 'https://trello.com/1/OAuthGetRequestToken',
    method: 'POST',
    data: {
      oauth_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback`
    }
  };

  try {
    const response = await fetch(requestData.url, {
      method: 'POST',
      headers: oauth.toHeader(oauth.authorize(requestData))
    });

    const text = await response.text();
    const params = Object.fromEntries(new URLSearchParams(text));

    if (params.oauth_token) {
      // Przekieruj użytkownika do Trello, aby potwierdził dostęp
      const trelloAuthUrl = `https://trello.com/1/OAuthAuthorizeToken?oauth_token=${params.oauth_token}&name=KamanOfferPowerUp&scope=read,write&expiration=never`;
      res.writeHead(302, { Location: trelloAuthUrl });
      res.end();
    } else {
      res.status(500).json({ message: 'Nie udało się uzyskać oauth_token!', details: params });
    }
  } catch (e) {
    res.status(500).json({ message: 'Błąd połączenia z Trello', error: e.message });
  }
}
