import ContactDedupe, { Contact } from '../../src/utils/contactDedupe';

describe('ContactDedupe', () => {
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123',
    },
    {
      id: '2',
      name: 'Alice Smith',
      email: 'alice@example.com',
    },
    {
      id: '3',
      name: 'Bob',
      email: 'bob@example.com',
    },
  ];

  it('find duplicates by email', () => {
    const groups = ContactDedupe.findDuplicates(contacts);
    expect(groups.length).toBe(1);
    expect(groups[0].length).toBe(2);
  });

  it('suggest merged contact', () => {
    const group = ContactDedupe.findDuplicates(contacts)[0];
    const suggestion = ContactDedupe.suggestMerge(group);
    expect(suggestion.merged.name).toBe('Alice');
    expect(suggestion.merged.email).toBe('alice@example.com');
    expect(suggestion.merged.phone).toBe('123');
  });

  it('dedupe produces suggestions for all groups', () => {
    const suggestions = ContactDedupe.dedupe(contacts);
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].duplicates.length).toBe(1);
  });
});
