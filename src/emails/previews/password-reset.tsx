import { PasswordResetEmail } from '../templates/PasswordResetEmail';
const data = require('../../../data/email-samples/reset-password.json');

const html = PasswordResetEmail(data);
if (!html.includes('prefers-color-scheme: dark')) {
  console.warn('Dark mode styles missing.');
}

export default html;
