import React from 'react';
import { registry, formatShortcut } from '../shortcuts/registry';
import { getLayout, Layout } from '../utils/metaKey';

const layout: Layout = getLayout();

const ShortcutHelp: React.FC = () => (
  <div>
    {Object.entries(registry).map(([id, shortcut]) => (
      <div key={id}>
        <span>{shortcut.description}</span>
        <kbd>{formatShortcut(id, layout)}</kbd>
      </div>
    ))}
  </div>
);

export default ShortcutHelp;
