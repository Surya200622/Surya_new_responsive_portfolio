export function getBrandEmailTemplate(title: string, contentHtml: string, preheader?: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0a0a0f;
      color: #faf8f5;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #faf8f5;
      text-decoration: none;
    }
    .logo-dot {
      color: #f97316;
    }
    .card {
      background-color: #13131a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 24px;
      color: #faf8f5;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 16px;
    }
    .content {
      font-size: 15px;
      line-height: 1.6;
      color: #a1a1aa;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content strong {
      color: #faf8f5;
    }
    .button {
      display: inline-block;
      background: linear-gradient(to right, #f97316, #f59e0b);
      color: #ffffff !important;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      margin: 24px 0;
      text-align: center;
    }
    .data-box {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .data-row {
      margin-bottom: 12px;
    }
    .data-row:last-child {
      margin-bottom: 0;
    }
    .data-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #71717a;
      margin-bottom: 4px;
    }
    .data-value {
      font-size: 16px;
      font-weight: 500;
      color: #faf8f5;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 13px;
      color: #71717a;
    }
    .footer a {
      color: #a1a1aa;
      text-decoration: none;
    }
    /* Preheader text (hidden) */
    .preheader {
      display: none;
      max-height: 0px;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${preheader ? `<div class="preheader">${preheader}</div>` : ''}
  <div class="container">
    <div class="header" style="text-align: center; margin-bottom: 40px;">
      <a href="https://suryacs.is-a.dev" style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff !important; text-decoration: none;">Surya CS<span style="color: #f97316;">.</span></a>
    </div>
    
    <div class="card">
      <h2 class="title">${title}</h2>
      
      <div class="content">
        ${contentHtml}
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Surya CS. All rights reserved.</p>
      <p><a href="https://suryacs.is-a.dev">suryacs.is-a.dev</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
