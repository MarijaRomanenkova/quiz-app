/**
 * Password reset success page template
 *
 * Generates an HTML page template shown after a successful password reset.
 * This template is displayed when a user completes the password reset process.
 *
 * @param mobileUrl - The URL to redirect users back to the mobile app
 * @returns HTML string for the success page
 *
 * @example
 * ```typescript
 * const appUrl = 'https://yourapp.com';
 * const successPage = resetPasswordSuccessTemplate(appUrl);
 * // Send successPage as response to user
 * ```
 */
export const resetPasswordSuccessTemplate = (mobileUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      margin-top: 50px;
    }
    .button {
      display: inline-block;
      background-color: #8BF224;
      color: #000000;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
    }
    .message {
      margin: 20px 0;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Successful! 🎉</h1>
    <p class="message">Your password has been reset successfully.</p>
    <p>You can now return to the app and log in with your new password.</p>
    <a href="${mobileUrl}" class="button">Return to App</a>
  </div>
</body>
</html>
`; 
