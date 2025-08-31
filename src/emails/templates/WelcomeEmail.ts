export interface WelcomeEmailProps {
  name: string;
}

const styles = `body { font-family: Arial, sans-serif; background: #ffffff; color: #000000; }
@media (prefers-color-scheme: dark) { body { background: #000000; color: #ffffff; } }`;

export function WelcomeEmail({ name }: WelcomeEmailProps): string {
  return `<html>
  <head>
    <meta name="color-scheme" content="light dark" />
    <style>${styles}</style>
  </head>
  <body>
    <h1>Welcome, ${name}!</h1>
    <p>We're excited to have you on board.</p>
    <img src="https://via.placeholder.com/150" alt="Company logo" />
  </body>
</html>`;
}
