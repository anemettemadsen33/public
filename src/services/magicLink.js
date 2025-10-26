// Magic Link Authentication Service
// Passwordless authentication via email link

class MagicLinkService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '/api';
  }

  /**
   * Request a magic link to be sent to the user's email
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async requestMagicLink(email) {
    try {
      // In production, this would call your backend API
      // const response = await fetch(`${this.apiUrl}/auth/magic-link/request`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // return await response.json();

      // Demo mode: Simulate sending email
      console.log(`Magic link would be sent to: ${email}`);
      
      // Generate a demo token
      const token = this.generateToken(email);
      
      // Store in sessionStorage for demo
      sessionStorage.setItem('magic_link_token', token);
      sessionStorage.setItem('magic_link_email', email);
      sessionStorage.setItem('magic_link_expires', Date.now() + 15 * 60 * 1000); // 15 minutes

      return {
        success: true,
        message: 'Magic link sent! Check your email.',
        // In demo mode, we'll show the link
        demoLink: `${window.location.origin}/auth/magic-link/verify?token=${token}`,
      };
    } catch (error) {
      console.error('Error requesting magic link:', error);
      return {
        success: false,
        message: 'Failed to send magic link. Please try again.',
      };
    }
  }

  /**
   * Verify magic link token and authenticate user
   * @param {string} token - Magic link token from email
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async verifyMagicLink(token) {
    try {
      // In production, this would call your backend API
      // const response = await fetch(`${this.apiUrl}/auth/magic-link/verify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token }),
      // });
      // return await response.json();

      // Demo mode: Verify token from sessionStorage
      const savedToken = sessionStorage.getItem('magic_link_token');
      const email = sessionStorage.getItem('magic_link_email');
      const expires = sessionStorage.getItem('magic_link_expires');

      if (!savedToken || !email || !expires) {
        return {
          success: false,
          error: 'Invalid or expired magic link',
        };
      }

      if (Date.now() > parseInt(expires)) {
        sessionStorage.removeItem('magic_link_token');
        sessionStorage.removeItem('magic_link_email');
        sessionStorage.removeItem('magic_link_expires');
        return {
          success: false,
          error: 'Magic link has expired. Please request a new one.',
        };
      }

      if (token !== savedToken) {
        return {
          success: false,
          error: 'Invalid magic link token',
        };
      }

      // Clear the token after successful verification
      sessionStorage.removeItem('magic_link_token');
      sessionStorage.removeItem('magic_link_email');
      sessionStorage.removeItem('magic_link_expires');

      // Create user object
      const user = {
        id: this.generateUserId(email),
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=0284c7&color=fff`,
        loginMethod: 'magic_link',
        verified: true,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Error verifying magic link:', error);
      return {
        success: false,
        error: 'Failed to verify magic link. Please try again.',
      };
    }
  }

  /**
   * Generate a secure token for magic link
   * @private
   */
  generateToken(email) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const data = `${email}:${timestamp}:${random}`;
    // In production, use a proper signing mechanism with a secret key
    return btoa(data).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Generate user ID from email
   * @private
   */
  generateUserId(email) {
    // In production, this would come from the database
    return `user_${btoa(email).substring(0, 12)}`;
  }
}

// Export singleton instance
const magicLinkService = new MagicLinkService();
export default magicLinkService;
