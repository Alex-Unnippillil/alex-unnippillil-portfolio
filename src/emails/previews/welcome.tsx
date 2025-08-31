import { WelcomeEmail } from '../templates/WelcomeEmail';
const data = require('../../../data/email-samples/welcome.json');

const html = WelcomeEmail(data);
if (!html.includes('prefers-color-scheme: dark')) {
  console.warn('Dark mode styles missing.');
}

export default html;
