export interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

const styles = `body { font-family: Arial, sans-serif; background: #ffffff; color: #000000; }
@media (prefers-color-scheme: dark) { body { background: #000000; color: #ffffff; } }`;

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps): string {
  return `<html>
  <head>
    <meta name="color-scheme" content="light dark" />
    <style>${styles}</style>
  </head>
  <body>
    <h1>Password reset</h1>
    <p>Hello ${name},</p>
    <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
    <img src="https://via.placeholder.com/150" alt="Company logo" />
  </body>
</html>`;
}
