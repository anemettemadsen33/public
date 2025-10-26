// OAuth2 Configuration for Social Authentication
// This file contains configuration for Google, Facebook, and Apple OAuth providers

export const oauthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid profile email',
    redirectUri: `${window.location.origin}/auth/google/callback`,
  },
  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    scope: 'public_profile,email',
    redirectUri: `${window.location.origin}/auth/facebook/callback`,
  },
  apple: {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    scope: 'name email',
    redirectUri: `${window.location.origin}/auth/apple/callback`,
  },
};

// Generate OAuth URL for provider
export const getOAuthUrl = (provider) => {
  const config = oauthConfig[provider];
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: generateState(),
  });

  return `${config.authUrl}?${params.toString()}`;
};

// Generate random state for CSRF protection
const generateState = () => {
  const state = Math.random().toString(36).substring(7);
  sessionStorage.setItem('oauth_state', state);
  return state;
};

// Verify state from OAuth callback
export const verifyState = (state) => {
  const savedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state');
  return state === savedState;
};
