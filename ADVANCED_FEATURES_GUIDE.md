# Advanced Features Implementation Guide

This document provides comprehensive information about the newly implemented advanced features in the Auto Marketplace platform.

## 📋 Table of Contents

1. [User Authentication (OAuth, Magic Link, 2FA)](#user-authentication)
2. [Advanced User Profiles](#advanced-user-profiles)
3. [Real AI Integration (OpenAI GPT)](#real-ai-integration)
4. [Dealer CRM with Lead Management](#dealer-crm)
5. [Email Notifications](#email-notifications)
6. [VIN Check API Integration](#vin-check-api)
7. [Environment Configuration](#environment-configuration)

---

## 1. User Authentication

### OAuth2 Social Login

**Files:**
- `src/config/oauth.js` - OAuth configuration
- `src/components/SocialLoginButtons.jsx` - Social login UI
- `src/context/AuthContext.jsx` - Authentication context

**Supported Providers:**
- Google OAuth
- Facebook Login
- Apple Sign In

**Setup:**

1. **Google OAuth:**
   ```bash
   # Get credentials from: https://console.cloud.google.com/
   VITE_GOOGLE_CLIENT_ID=your_client_id
   ```

2. **Facebook Login:**
   ```bash
   # Get credentials from: https://developers.facebook.com/
   VITE_FACEBOOK_APP_ID=your_app_id
   ```

3. **Apple Sign In:**
   ```bash
   # Get credentials from: https://developer.apple.com/
   VITE_APPLE_CLIENT_ID=your_client_id
   ```

**Usage:**
```jsx
import SocialLoginButtons from './components/SocialLoginButtons';

<SocialLoginButtons onSuccess={() => console.log('Login successful')} />
```

### Magic Link Authentication

**File:** `src/services/magicLink.js`

**Features:**
- Passwordless login via email
- 15-minute expiration
- Secure token generation
- CSRF protection

**Usage:**
```javascript
import magicLinkService from './services/magicLink';

// Request magic link
const result = await magicLinkService.requestMagicLink('user@email.com');

// Verify magic link
const verification = await magicLinkService.verifyMagicLink(token);
```

**Production Integration:**
```javascript
// In your backend API
app.post('/auth/magic-link/request', async (req, res) => {
  const { email } = req.body;
  const token = generateSecureToken();
  const magicLink = `${process.env.APP_URL}/auth/verify?token=${token}`;
  
  await emailService.sendMagicLink(email, magicLink);
  res.json({ success: true });
});
```

### Two-Factor Authentication (2FA)

**File:** `src/services/twoFactor.js`

**Features:**
- TOTP-based authentication (compatible with Google Authenticator, Authy, etc.)
- QR code generation
- Backup codes (10 codes)
- Enable/disable functionality

**Usage:**
```javascript
import twoFactorService from './services/twoFactor';

// Generate 2FA secret
const { secret, qrCode, backupCodes } = await twoFactorService.generateSecret(
  userId, 
  userEmail
);

// Verify 2FA code
const result = await twoFactorService.verifyCode(userId, '123456');

// Enable 2FA
await twoFactorService.enable2FA(userId, verificationCode);

// Check if 2FA is enabled
const isEnabled = twoFactorService.is2FAEnabled(userId);
```

**Security Best Practices:**
- Store secrets encrypted in database
- Rate limit verification attempts
- Use secure random number generation
- Require 2FA for sensitive operations

---

## 2. Advanced User Profiles

**File:** `src/pages/UserProfile.jsx`

**Features:**
- Personal information management
- Notification preferences
- Security settings (2FA)
- Saved vehicles
- Multiple tabs interface

**Sections:**

### Profile Tab
- First/Last name
- Email
- Phone number
- Address information

### Preferences Tab
- Email notifications
- Push notifications
- Marketing emails
- Price alerts
- New listings alerts
- Saved searches alerts

### Security Tab
- Two-factor authentication setup
- Password management
- Login history
- Connected accounts

### Saved Vehicles Tab
- Favorites list
- Saved searches
- Price alerts

**Usage:**
```jsx
import { Link } from 'react-router-dom';

<Link to="/profile">My Profile</Link>
```

---

## 3. Real AI Integration (OpenAI GPT)

**File:** `src/services/openai.js`

**Features:**
- Real OpenAI API integration
- Fallback to simulated responses
- Vehicle recommendations
- Vehicle comparison
- Buying advice
- Conversational AI assistant

**Setup:**

1. Get API key from [OpenAI](https://platform.openai.com/)
2. Add to environment:
   ```bash
   VITE_OPENAI_API_KEY=sk-...
   VITE_OPENAI_MODEL=gpt-4o-mini  # or gpt-4, gpt-3.5-turbo
   VITE_USE_REAL_AI=true
   ```

**Usage:**
```javascript
import openAIService from './services/openai';

// Send message
const response = await openAIService.sendMessage(
  "What's the best family SUV?",
  conversationHistory
);

// Get vehicle recommendations
const recommendations = await openAIService.getVehicleRecommendations({
  budget: 30000,
  type: 'SUV',
  fuelType: 'Hybrid',
  features: ['Safety', 'Spacious'],
  usage: 'Family'
});

// Compare vehicles
const comparison = await openAIService.compareVehicles([vehicle1, vehicle2]);

// Get buying advice
const advice = await openAIService.getBuyingAdvice({
  budget: 25000,
  experience: 'First-time buyer',
  concerns: 'Reliability and maintenance costs'
});
```

**Cost Optimization:**
- Uses GPT-4o-mini by default (cheaper)
- Limits response length (max_tokens: 500)
- Implements temperature control (0.7)
- Fallback to simulated responses on error

**System Prompt:**
The AI is configured as an auto marketplace assistant with expertise in:
- Vehicle recommendations
- Feature comparisons
- Financing guidance
- Inspection tips
- Technical specifications

---

## 4. Dealer CRM with Lead Management

**Files:**
- `src/services/dealerCRM.js` - CRM service
- `src/pages/DealerCRMDashboard.jsx` - CRM dashboard UI

**Features:**

### Lead Management
- Create, read, update leads
- Lead scoring (0-100)
- Priority levels (high, medium, low)
- Status tracking (new → converted)
- Source tracking
- Budget and preferences

### Analytics
- Total leads count
- Conversion rate
- Active leads
- Revenue pipeline
- Leads by source
- Leads by status
- Top vehicles
- Average response time

### Lead Details
- Customer information
- Vehicle interest
- Notes history
- Activity timeline
- Follow-up scheduling

**Lead Statuses:**
1. New
2. Contacted
3. Qualified
4. Test Drive Scheduled
5. Negotiating
6. Converted
7. Lost

**Usage:**
```javascript
import dealerCRMService from './services/dealerCRM';

// Get all leads
const leads = await dealerCRMService.getLeads(dealerId, {
  status: 'new',
  source: 'website'
});

// Get specific lead
const lead = await dealerCRMService.getLead(leadId);

// Create lead
const newLead = await dealerCRMService.createLead({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@email.com',
  phone: '555-1234',
  vehicle: '2023 Toyota Camry',
  budget: 28000,
  source: 'website'
});

// Update lead status
await dealerCRMService.updateLead(leadId, {
  status: 'qualified',
  priority: 'high'
});

// Add note
await dealerCRMService.addNote(
  leadId,
  'Customer interested in hybrid models',
  userId
);

// Schedule follow-up
await dealerCRMService.scheduleFollowUp(leadId, {
  type: 'call',
  scheduledFor: '2024-01-15T10:00:00Z',
  notes: 'Discuss financing options'
});

// Get analytics
const analytics = await dealerCRMService.getLeadAnalytics(dealerId);
```

**Lead Scoring Algorithm:**
- Budget > $20k: +30 points
- Down payment > $3k: +20 points
- Credit score > 700: +25 points
- Timeline within weeks: +15 points
- Test drive scheduled: +10 points

**Access:**
```
/dealer/crm - CRM Dashboard (dealer role required)
```

---

## 5. Email Notifications

**File:** `src/services/email.js`

**Features:**
- Welcome emails
- Magic link emails
- Vehicle match notifications
- Price drop alerts
- Test drive confirmations
- Message notifications
- VIN report delivery
- Saved search alerts

**Email Templates:**

### Welcome Email
```javascript
await emailService.sendWelcomeEmail('user@email.com', 'John');
```

### Magic Link
```javascript
await emailService.sendMagicLink('user@email.com', magicLink);
```

### Vehicle Match
```javascript
await emailService.sendVehicleMatch('user@email.com', vehicle);
```

### Price Drop Alert
```javascript
await emailService.sendPriceDropAlert(
  'user@email.com',
  vehicle,
  35000,  // old price
  32000   // new price
);
```

### Test Drive Confirmation
```javascript
await emailService.sendTestDriveConfirmation('user@email.com', {
  vehicle: '2023 Toyota Camry',
  date: '2024-01-15',
  time: '10:00 AM',
  location: 'Downtown Showroom',
  confirmationCode: 'TD123456'
});
```

**Production Integration:**

Choose an email service provider:
- **SendGrid** (recommended)
- **AWS SES**
- **Mailgun**
- **Postmark**
- **Resend**

Example with SendGrid:
```javascript
// Backend implementation
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/email/send', async (req, res) => {
  const { to, subject, template, templateData } = req.body;
  
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    templateId: templates[template],
    dynamicTemplateData: templateData
  };
  
  await sgMail.send(msg);
  res.json({ success: true });
});
```

---

## 6. VIN Check API Integration

**File:** `src/services/vinCheck.js`

**Features:**
- NHTSA API integration (free)
- Commercial API support (Carfax, AutoCheck)
- VIN validation
- Vehicle specifications
- Ownership history
- Accident reports
- Service records
- Recall information
- Title status
- Odometer verification
- Market value estimation

**Usage:**

### Decode VIN (NHTSA - Free)
```javascript
import vinCheckService from './services/vinCheck';

// Decode VIN to get specifications
const specs = await vinCheckService.decodeVIN('1HGBH41JXMN109186');
// Returns: make, model, year, engine, transmission, etc.
```

### Get Complete Vehicle History
```javascript
// Get comprehensive report
const report = await vinCheckService.getVehicleHistory('1HGBH41JXMN109186');

console.log(report.vehicle);        // Make, model, year
console.log(report.ownership);      // Number of owners, history
console.log(report.accidents);      // Accident history
console.log(report.serviceRecords); // Maintenance history
console.log(report.recalls);        // Open and past recalls
console.log(report.titleInfo);      // Title status
console.log(report.odometer);       // Mileage history
console.log(report.marketValue);    // Estimated value
```

### Check Recalls Only
```javascript
// Check for open recalls (NHTSA API)
const recalls = await vinCheckService.checkRecalls('1HGBH41JXMN109186');
```

### Validate VIN
```javascript
// Validate VIN format
const isValid = vinCheckService.validateVIN('1HGBH41JXMN109186');
// Returns: true/false
```

**API Integration Options:**

### Option 1: NHTSA (Free)
```bash
# No API key required
# Limited to basic specs and recalls
# URL: https://vpic.nhtsa.dot.gov/api
```

### Option 2: Commercial Services
```bash
# Carfax API
VITE_VIN_API_KEY=your_carfax_api_key
VITE_VIN_API_URL=https://api.carfax.com

# AutoCheck API
VITE_VIN_API_KEY=your_autocheck_api_key
VITE_VIN_API_URL=https://api.autocheck.com

# VINCheckPro
VITE_VIN_API_KEY=your_vincheckpro_api_key
VITE_VIN_API_URL=https://api.vincheckpro.com
```

**VIN Format:**
- Exactly 17 characters
- Alphanumeric (no I, O, or Q)
- Example: `1HGBH41JXMN109186`

---

## 7. Environment Configuration

**File:** `.env.example`

### Required Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# OpenAI (Optional - falls back to simulated)
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_USE_REAL_AI=false

# VIN Check (Optional - NHTSA is free)
VITE_VIN_API_KEY=your_api_key
VITE_VIN_API_URL=https://api.vindecoder.eu/3.2

# OAuth (Optional - works in demo mode)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_APPLE_CLIENT_ID=your_apple_client_id

# Email
VITE_EMAIL_FROM=noreply@automarketplace.com

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_MAGIC_LINK=true
VITE_ENABLE_REAL_VIN_CHECK=false
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
```

### Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys (optional for demo mode)

3. Start development server:
   ```bash
   npm run dev
   ```

### Production Setup

1. Set environment variables in your hosting platform:
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Build & deploy → Environment
   - AWS Amplify: App settings → Environment variables

2. Enable production features:
   ```bash
   VITE_USE_REAL_AI=true
   VITE_ENABLE_REAL_VIN_CHECK=true
   ```

3. Secure your API keys:
   - Never commit `.env` to git
   - Use different keys for dev/staging/production
   - Rotate keys regularly
   - Monitor API usage

---

## 📊 Feature Comparison

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| OAuth Login | ✅ Simulated | ✅ Real OAuth |
| Magic Link | ✅ Session storage | ✅ Email delivery |
| 2FA | ✅ Any 6-digit code | ✅ TOTP validation |
| AI Chatbot | ✅ Simulated responses | ✅ OpenAI GPT |
| VIN Check | ✅ Mock data | ✅ NHTSA + Commercial |
| Email | ✅ Console logs | ✅ Real emails |
| CRM | ✅ Mock leads | ✅ Database storage |

---

## 🔒 Security Considerations

1. **API Keys:**
   - Store in environment variables
   - Never commit to version control
   - Use different keys per environment
   - Implement key rotation

2. **Authentication:**
   - Use HTTPS in production
   - Implement CSRF protection
   - Validate OAuth state parameter
   - Secure session storage

3. **2FA:**
   - Encrypt secrets in database
   - Rate limit verification attempts
   - Provide backup codes
   - Log security events

4. **Email:**
   - Validate email addresses
   - Implement rate limiting
   - Use SPF/DKIM/DMARC
   - Monitor bounce rates

5. **VIN Data:**
   - Cache responses appropriately
   - Validate VIN format
   - Handle API failures gracefully
   - Respect API rate limits

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure OAuth redirect URIs
- [ ] Set up email service (SendGrid, etc.)
- [ ] Configure OpenAI API (if using)
- [ ] Set up VIN check service
- [ ] Enable HTTPS
- [ ] Test all integrations
- [ ] Monitor API usage
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [NHTSA API](https://vpic.nhtsa.dot.gov/api/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [SendGrid API](https://docs.sendgrid.com/)
- [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

---

**Last Updated:** January 2025
