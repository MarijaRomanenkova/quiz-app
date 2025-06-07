export const passwordResetTemplate = (resetUrl: string) => `
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
    <h1>Reset Your Password 🔐</h1>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    
    <a href="${resetUrl}" class="button">Reset Password</a>
    
    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${resetUrl}</p>
    
    <p><strong>Note:</strong> This reset link will expire in 1 hour.</p>
    
    <div class="footer">
      <p>If you didn't request this password reset, you can safely ignore this email.</p>
      <p>© ${new Date().getFullYear()} Quiz App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`; 
