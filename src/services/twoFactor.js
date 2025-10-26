// Two-Factor Authentication Service
// TOTP-based 2FA using authenticator apps (Google Authenticator, Authy, etc.)

class TwoFactorService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '/api';
  }

  /**
   * Generate 2FA secret and QR code for user setup
   * @param {string} userId - User ID
   * @param {string} email - User email for labeling
   * @returns {Promise<{secret: string, qrCode: string, backupCodes: string[]}>}
   */
  async generateSecret(userId, email) {
    try {
      // In production, this would call your backend API
      // const response = await fetch(`${this.apiUrl}/auth/2fa/generate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId }),
      // });
      // return await response.json();

      // Demo mode: Generate a fake secret
      const secret = this.generateRandomSecret();
      const appName = 'AutoMarketplace';
      const qrCodeUrl = `otpauth://totp/${appName}:${email}?secret=${secret}&issuer=${appName}`;
      
      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // In production, store secret and backup codes in database
      sessionStorage.setItem(`2fa_secret_${userId}`, secret);
      sessionStorage.setItem(`2fa_backup_${userId}`, JSON.stringify(backupCodes));

      return {
        secret,
        qrCode: qrCodeUrl,
        backupCodes,
        manualEntry: this.formatSecretForManualEntry(secret),
      };
    } catch (error) {
      console.error('Error generating 2FA secret:', error);
      throw new Error('Failed to generate 2FA secret');
    }
  }

  /**
   * Verify 2FA code during login
   * @param {string} userId - User ID
   * @param {string} code - 6-digit TOTP code
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async verifyCode(userId, code) {
    try {
      // In production, this would call your backend API
      // const response = await fetch(`${this.apiUrl}/auth/2fa/verify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, code }),
      // });
      // return await response.json();

      // Demo mode: Accept any 6-digit code or backup codes
      if (code.length === 6 && /^\d+$/.test(code)) {
        return { success: true };
      }

      // Check backup codes
      const backupCodesStr = sessionStorage.getItem(`2fa_backup_${userId}`);
      if (backupCodesStr) {
        const backupCodes = JSON.parse(backupCodesStr);
        const index = backupCodes.indexOf(code);
        if (index !== -1) {
          // Remove used backup code
          backupCodes.splice(index, 1);
          sessionStorage.setItem(`2fa_backup_${userId}`, JSON.stringify(backupCodes));
          return { success: true, usedBackupCode: true };
        }
      }

      return {
        success: false,
        error: 'Invalid verification code',
      };
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      return {
        success: false,
        error: 'Failed to verify code. Please try again.',
      };
    }
  }

  /**
   * Enable 2FA for user after verification
   * @param {string} userId - User ID
   * @param {string} code - Verification code to confirm setup
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async enable2FA(userId, code) {
    try {
      const verification = await this.verifyCode(userId, code);
      
      if (!verification.success) {
        return verification;
      }

      // In production, update user's 2FA status in database
      localStorage.setItem(`2fa_enabled_${userId}`, 'true');

      return { success: true };
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      return {
        success: false,
        error: 'Failed to enable 2FA. Please try again.',
      };
    }
  }

  /**
   * Disable 2FA for user
   * @param {string} userId - User ID
   * @param {string} code - Verification code to confirm disable
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async disable2FA(userId, code) {
    try {
      const verification = await this.verifyCode(userId, code);
      
      if (!verification.success) {
        return verification;
      }

      // In production, update user's 2FA status in database
      localStorage.removeItem(`2fa_enabled_${userId}`);
      sessionStorage.removeItem(`2fa_secret_${userId}`);
      sessionStorage.removeItem(`2fa_backup_${userId}`);

      return { success: true };
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      return {
        success: false,
        error: 'Failed to disable 2FA. Please try again.',
      };
    }
  }

  /**
   * Check if 2FA is enabled for user
   * @param {string} userId - User ID
   * @returns {boolean}
   */
  is2FAEnabled(userId) {
    return localStorage.getItem(`2fa_enabled_${userId}`) === 'true';
  }

  /**
   * Get remaining backup codes
   * @param {string} userId - User ID
   * @returns {string[]}
   */
  getBackupCodes(userId) {
    const codes = sessionStorage.getItem(`2fa_backup_${userId}`);
    return codes ? JSON.parse(codes) : [];
  }

  /**
   * Generate random secret for TOTP
   * @private
   */
  generateRandomSecret() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 charset
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  /**
   * Generate backup codes
   * @private
   */
  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += Math.floor(Math.random() * 10);
      }
      codes.push(code);
    }
    return codes;
  }

  /**
   * Format secret for manual entry in authenticator app
   * @private
   */
  formatSecretForManualEntry(secret) {
    // Add spaces every 4 characters for readability
    return secret.match(/.{1,4}/g).join(' ');
  }
}

// Export singleton instance
const twoFactorService = new TwoFactorService();
export default twoFactorService;
