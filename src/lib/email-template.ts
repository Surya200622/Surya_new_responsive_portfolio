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
      background-color: #ffffff;
      color: #1a1a1a;
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
      color: #1a1a1a;
      text-decoration: none;
    }
    .logo-dot {
      color: #f97316; /* Brand orange */
    }
    .card {
      background-color: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 24px;
      color: #f97316; /* Brand orange */
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding-bottom: 16px;
    }
    .content {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content strong {
      color: #1a1a1a;
    }
    .button {
      display: inline-block;
      background: linear-gradient(to right, #f97316, #fb923c); /* Brand orange gradient */
      color: #ffffff !important;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      margin: 24px 0;
      text-align: center;
      box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.39);
    }
    .data-box {
      background-color: #f3f4f6;
      border: 1px solid rgba(0, 0, 0, 0.05);
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
      color: #6b7280;
      margin-bottom: 4px;
    }
    .data-value {
      font-size: 16px;
      font-weight: 500;
      color: #1a1a1a;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 13px;
      color: #6b7280;
    }
    .footer a {
      color: #f97316;
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
  <div class="container" style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div class="header" style="text-align: center; margin-bottom: 40px; background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs-websolutions.vercel.app'}" style="text-decoration: none; display: inline-block;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://suryacs-websolutions.vercel.app'}/logo-email.svg" alt="Surya CS Logo" style="height: 52px; width: auto; display: block; margin: 0 auto;" />
      </a>
    </div>
    
    <div class="card">
      <h2 class="title" style="color: #f97316;">${title}</h2>
      
      <div class="content">
        ${contentHtml}
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Surya CS. All rights reserved.</p>
      <p><a href="https://suryacs-websolutions.vercel.app" style="color: #f97316;">suryacs-websolutions.vercel.app</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
