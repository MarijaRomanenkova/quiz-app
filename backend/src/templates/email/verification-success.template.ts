export const verificationSuccessTemplate = (mobileUrl: string) => `
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
      text-align: center;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      margin-top: 50px;
    }
    .success-icon {
      color: #4CAF50;
      font-size: 48px;
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
    <div class="success-icon">✓</div>
    <h1>Email Verified Successfully! 🎉</h1>
    <p>Your email has been verified. You can now log in to the Quiz App and start learning!</p>
    
    <a href="${mobileUrl}/login" class="button">Go to Login</a>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Quiz App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`; 
