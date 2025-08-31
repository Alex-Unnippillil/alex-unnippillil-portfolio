import React, { useEffect, useState } from 'react';

export interface OfflineEditorProps {
  /**
   * Unique key used to store editor content in localStorage.
   */
  storageKey: string;
  /**
   * Placeholder text for the textarea element.
   */
  placeholder?: string;
  /**
   * Called whenever the value changes.
   */
  onChange?: (value: string) => void;
  /**
   * Disables the textarea when set to true.
   */
  disabled?: boolean;
}

/**
 * OfflineEditor is a small textarea wrapper that keeps its value in
 * `localStorage`. This allows users to continue editing content even when
 * network connectivity is lost. The latest value is restored on mount.
 */
const OfflineEditor: React.FC<OfflineEditorProps> = ({
  storageKey,
  placeholder,
  onChange,
  disabled,
}) => {
  const [value, setValue] = useState('');

  // Load value from storage on mount.
  useEffect(() => {
    try {
      const stored = globalThis.localStorage?.getItem(storageKey);
      if (stored !== null) {
        setValue(stored);
      }
    } catch {
      // ignore access errors (e.g. in non-browser environments)
    }
  }, [storageKey]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
    try {
      globalThis.localStorage?.setItem(storageKey, val);
    } catch {
      // ignore write errors
    }
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default OfflineEditor;

