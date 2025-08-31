import React, { useCallback, useState } from 'react';

export interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string[];
}

/**
 * Drag and drop area that validates file types and exposes hover state.
 */
const DropZone: React.FC<DropZoneProps> = ({ onFiles, accept = [] }) => {
  const [hover, setHover] = useState(false);

  const validate = useCallback(
    (files: FileList): File[] => {
      const arr = Array.from(files);
      if (!accept.length) return arr;
      return arr.filter((file) => accept.includes(file.type));
    },
    [accept],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setHover(false);
      const files = validate(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles, validate],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list) return;
      const files = validate(list);
      if (files.length) onFiles(files);
    },
    [onFiles, validate],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={handleDrop}
      className={`dropzone${hover ? ' dropzone--hover' : ''}`}
    >
      <input
        className="dropzone__input"
        type="file"
        multiple
        accept={accept.join(',')}
        onChange={handleChange}
      />
      <p>{hover ? 'Release to upload files' : 'Drag files here or click to browse'}</p>
    </div>
  );
};

export default DropZone;
