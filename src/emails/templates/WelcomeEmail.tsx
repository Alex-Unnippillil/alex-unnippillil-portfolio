// @ts-nocheck
import React from 'react';

interface WelcomeEmailProps {
  name: string;
  link: string;
}

export default function WelcomeEmail({ name, link }: WelcomeEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body { font-family: Arial, sans-serif; }
          a { color: #0366d6; }
          @media (prefers-color-scheme: dark) {
            body { background: #000; color: #fff; }
            a { color: #58a6ff; }
          }
        `}</style>
      </head>
      <body>
        <h1>Welcome, {name}!</h1>
        <p>Thanks for joining our site.</p>
        <p>
          Visit your dashboard:
          {' '}<a href={link}>Click here</a>
        </p>
        <img src="https://via.placeholder.com/100" alt="Placeholder" />
      </body>
    </html>
  );
}
