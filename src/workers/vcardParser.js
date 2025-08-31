/* eslint-env worker */
/* eslint-disable no-restricted-globals */
const FIELD_MAP = {
  FN: 'fullName',
  EMAIL: 'email',
  TEL: 'phone',
  ADR: 'address',
  ORG: 'organization',
  TITLE: 'title',
};

function parseVCard(vcard) {
  const contact = {};

  if (!vcard || typeof vcard !== 'string') {
    return contact;
  }

  vcard.split(/\r?\n/).forEach((line) => {
    const parts = line.split(':');
    if (parts.length < 2) {
      return;
    }

    const rawKey = parts.shift();
    const value = parts.join(':');

    if (!rawKey) {
      return;
    }

    const key = rawKey.split(';')[0].toUpperCase();
    const mapped = FIELD_MAP[key];

    if (mapped) {
      if (contact[mapped]) {
        if (!Array.isArray(contact[mapped])) {
          contact[mapped] = [contact[mapped]];
        }
        contact[mapped].push(value);
      } else {
        contact[mapped] = value;
      }
    }
  });

  return contact;
}

self.onmessage = (event) => {
  try {
    const result = parseVCard(event.data);
    self.postMessage({ success: true, data: result });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};

export default null;
