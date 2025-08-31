import React, { useEffect, useState } from 'react';
import shortcutManager from './index';

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i += 1) {
    if (t[i] === q[qi]) {
      qi += 1;
    }
  }
  return qi === q.length;
}

const ShortcutHelp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const unregister = shortcutManager.register('?', () => setOpen(o => !o), { description: 'Show shortcut help' });
    return unregister;
  }, []);

  const shortcuts = shortcutManager.getShortcuts();
  const filtered = shortcuts.filter(s => fuzzyMatch(query, s.description || s.keys.join(' ')));

  if (!open) return null;

  return (
    <div className="shortcut-help" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#222', padding: '1rem', borderRadius: '4px' }}>
        <input
          autoFocus
          type="text"
          placeholder="Search shortcuts"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
          {filtered.map((s, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <strong>{s.keys.join(' ')}</strong>
              {' '}- {s.description || 'No description'}
              {' '}<em>{s.scope ? `[${s.scope}]` : '[global]'}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShortcutHelp;
