export interface Contact {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export interface MergeSuggestion {
  primary: Contact;
  duplicates: Contact[];
  merged: Contact;
}

export default class ContactDedupe {
  static findDuplicates(contacts: Contact[]): Contact[][] {
    const map: { [key: string]: Contact[] } = {};
    contacts.forEach((contact) => {
      const key = (contact.email || contact.phone || contact.name || '').toLowerCase();
      if (!key) {
        return;
      }
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(contact);
    });
    return Object.values(map).filter((group) => group.length > 1);
  }

  static suggestMerge(group: Contact[]): MergeSuggestion {
    const primary = group[0];
    const merged: Contact = { ...primary };
    for (let i = 1; i < group.length; i += 1) {
      const c = group[i];
      Object.keys(c).forEach((k) => {
        if (merged[k] === undefined && c[k] !== undefined) {
          merged[k] = c[k];
        }
      });
    }
    return { primary, duplicates: group.slice(1), merged };
  }

  static dedupe(contacts: Contact[]): MergeSuggestion[] {
    return ContactDedupe.findDuplicates(contacts).map((group) => ContactDedupe.suggestMerge(group));
  }
}
