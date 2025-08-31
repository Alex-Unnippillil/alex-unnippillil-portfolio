// @ts-nocheck
import React from 'react';

interface ResetPasswordProps {
  name: string;
  resetLink: string;
}

export default function ResetPassword({ name, resetLink }: ResetPasswordProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body { font-family: Arial, sans-serif; }
          a { color: #d73a49; }
          @media (prefers-color-scheme: dark) {
            body { background: #000; color: #fff; }
            a { color: #f85149; }
          }
        `}</style>
      </head>
      <body>
        <h1>Password Reset</h1>
        <p>Hello {name},</p>
        <p>Click the link below to reset your password:</p>
        <p>
          <a href={resetLink}>Reset Password</a>
        </p>
        <img src="https://via.placeholder.com/120" alt="Reset illustration" />
      </body>
    </html>
  );
}
