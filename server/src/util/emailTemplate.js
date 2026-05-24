export function emailTemplate ({ title, body, buttonText, buttonUrl }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:24px;font-weight:bold;color:#60a5fa;letter-spacing:1px;">BetterTour</span>
            </td>
          </tr>

          <tr>
            <td style="background-color:#1e293b;border-radius:12px;border:1px solid #3b82f6;padding:40px;">

              <!-- Title -->
              <h1 style="margin:0 0 16px;font-size:22px;color:#f1f5f9;">${title}</h1>

              <!-- Body content -->
              <div style="font-size:16px;line-height:1.6;color:#94a3b8;">
                ${body}
              </div>

              ${buttonText && buttonUrl
? `
              <table cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td style="border-radius:8px;background-color:#3b82f6;">
                    <a href="${buttonUrl}"
                       style="display:inline-block;padding:12px 28px;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>`
: ''}

            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:24px;font-size:12px;color:#475569;">
              &copy; ${new Date().getFullYear()} BetterTour. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
