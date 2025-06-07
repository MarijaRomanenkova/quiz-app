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
    <p>Thank you for registering. To complete your registration and start learning, please verify your email address by clicking the button below:</p>
    
    <a href="${verificationUrl}" class="button">Verify Email Address</a>
    
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
