
import { google } from "googleapis";

import { env } from "@/config/env";

type PasswordResetEmailInput = {
  email: string;
  resetUrl: string;
};

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value).toString("base64")}?=`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildRawMessage(input: PasswordResetEmailInput) {
  const text = [
    "Reset your FamilyScript password",
    "",
    "We received a request to reset your FamilyScript password.",
    "Use the link below to choose a new password.",
    "This link expires in 1 hour and can only be used once.",
    "",
    input.resetUrl,
    "",
    "If you did not request a password reset, you can safely ignore this email.",
  ].join("\n");

  // Generate absolute logo URL for email clients
  const logoUrl = new URL("/favicon/favicon.svg", input.resetUrl).toString();

  const safeResetUrl = escapeHtml(input.resetUrl);
  const safeLogoUrl = escapeHtml(logoUrl);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FamilyScript | Password Reset</title>
</head>

<body style="margin:0; padding:0; background-color:#F7F4ED;">

  <div style="
    width:100%;
    background-color:#F7F4ED;
    padding:55px 20px;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
    color:#30271F;
  ">

    <div style="
      max-width:560px;
      margin:0 auto;
      text-align:center;
    ">

      <!-- FAMILYSCRIPT LOGO -->
      <div style="margin-bottom:32px; text-align:center;">
        <img
          src="${safeLogoUrl}"
          alt="FamilyScript"
          width="110"
          height="110"
          style="
            display:block;
            width:110px;
            height:110px;
            object-fit:contain;
            margin:0 auto;
            border:0;
          "
        />
      </div>

      <!-- EMAIL CARD -->
      <div style="
        background:#FFFEFA;
        border:1px solid #DED3BC;
        padding:48px 42px;
        border-radius:4px;
        text-align:center;
      ">

        <!-- GOLD ACCENT -->
        <div style="
          width:42px;
          height:2px;
          background:#AE9562;
          margin:0 auto 30px;
        "></div>

        <p style="
          margin:0 0 14px;
          color:#AE9562;
          font-size:11px;
          letter-spacing:3px;
          text-transform:uppercase;
        ">
          ACCOUNT SECURITY
        </p>

        <h1 style="
          margin:0 0 22px;
          font-family:Georgia, 'Times New Roman', serif;
          font-size:32px;
          font-weight:400;
          line-height:1.3;
          color:#30271F;
        ">
          A fresh start,<br />
          just one step away.
        </h1>

        <p style="
          margin:0 auto 32px;
          max-width:390px;
          font-size:15px;
          line-height:1.9;
          color:#746B60;
        ">
          We received a request to reset your FamilyScript password.
          Click below to choose a new password and continue preserving
          the stories that matter.
        </p>

        <!-- RESET BUTTON -->
        <a
          href="${safeResetUrl}"
          style="
            display:inline-block;
            padding:15px 38px;
            background:#8F7547;
            color:#FFFFFF;
            font-size:13px;
            letter-spacing:1.5px;
            text-transform:uppercase;
            text-decoration:none;
            font-weight:600;
          "
        >
          Reset Password
        </a>

        <p style="
          margin:30px 0 0;
          font-size:13px;
          line-height:1.8;
          color:#8B8174;
        ">
          This link expires in
          <strong style="color:#66543A;">1 hour</strong>
          and can only be used once.
        </p>

        <!-- DIVIDER -->
        <div style="
          width:100%;
          height:1px;
          background:#EAE2D3;
          margin:34px 0 24px;
        "></div>

        <p style="
          margin:0;
          font-size:13px;
          line-height:1.8;
          color:#8B8174;
        ">
          Didn't request a password reset?<br />
          You can safely ignore this email.
          Your password will remain unchanged.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="padding:28px 10px 0;">

        <p style="
          margin:0 0 8px;
          font-family:Georgia, 'Times New Roman', serif;
          font-size:17px;
          color:#8F7547;
        ">
          Every story deserves to be remembered.
        </p>

        <p style="
          margin:0;
          font-size:11px;
          letter-spacing:1px;
          color:#A69B8B;
        ">
          &copy; FamilyScript. All rights reserved.
        </p>

      </div>

    </div>
  </div>

</body>
</html>
  `;

  const message = [
    `From: ${env.GMAIL_SENDER}`,
    `To: ${input.email}`,
    `Subject: ${encodeHeader("Reset your FamilyScript password")}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="reset-boundary"',
    "",
    "--reset-boundary",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text,
    "--reset-boundary",
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
    "--reset-boundary--",
  ].join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendPasswordResetEmail(
  input: PasswordResetEmailInput
) {
  if (
    !env.GMAIL_CLIENT_ID ||
    !env.GMAIL_CLIENT_SECRET ||
    !env.GMAIL_REFRESH_TOKEN ||
    !env.GMAIL_SENDER
  ) {
    throw new Error(
      "Password reset email is unavailable: configure the Gmail email environment variables."
    );
  }

  const oauth2 = new google.auth.OAuth2(
    env.GMAIL_CLIENT_ID,
    env.GMAIL_CLIENT_SECRET
  );

  oauth2.setCredentials({
    refresh_token: env.GMAIL_REFRESH_TOKEN,
  });

  await google.gmail({
    version: "v1",
    auth: oauth2,
  }).users.messages.send({
    userId: "me",
    requestBody: {
      raw: buildRawMessage(input),
    },
  });
}
