/**
 * Email verification template
 *
 * Generates an HTML email template for account verification.
 * This template is sent when a user registers and needs to verify their email address.
 *
 * @param verificationUrl - The URL where the user can verify their email
 * @returns HTML string for the verification email
 *
 * @example
 * ```typescript
 * const verifyLink = 'https://yourapp.com/verify-email?token=abc123';
 * const emailHtml = verificationEmailTemplate(verifyLink);
 * // Send emailHtml via email service
 * ```
 */
export const verificationEmailTemplate = (verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background-color: #4313E2;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Quiz App! 🎉</h1>
    <p>Thank you for registering! Please verify your email address to complete your account setup.</p>
    
    <a href="${verificationUrl}" class="button">Verify Email</a>
    
    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${verificationUrl}</p>
    
    <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
    
    <div class="footer">
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>© ${new Date().getFullYear()} Quiz App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`; 
