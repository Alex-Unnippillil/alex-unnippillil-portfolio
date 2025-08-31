import React, { useCallback } from 'react';
import prepareImage from '../utils/imagePrep';

interface ImagePasteTargetProps {
  onUpload: (file: File) => void | Promise<void>;
  children?: React.ReactNode;
  maxSize?: number;
}

/**
 * ImagePasteTarget listens for image paste events on the wrapped element and
 * triggers the provided upload callback with the processed file. The image is
 * normalised and resized using the imagePrep utility before being returned.
 */
const ImagePasteTarget: React.FC<ImagePasteTargetProps> = ({
  onUpload,
  children,
  maxSize,
}) => {
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      const { items } = e.clipboardData;
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const prepped = await prepareImage(file, maxSize);
            await onUpload(prepped);
          }
        }
      }
    },
    [onUpload, maxSize],
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div onPaste={handlePaste}>
      {children}
    </div>
  );
};

export default ImagePasteTarget;
