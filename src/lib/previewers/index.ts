import imagePreviewer from './image';
import videoPreviewer from './video';
import textPreviewer from './text';
import jsonPreviewer from './json';
import { isSafeMimeType, blockedMessage } from '../previewSecurity';

export type Previewer = (
  blob: Blob,
  onChunk?: (text: string) => void,
) => Promise<any>;

interface PreviewerEntry {
  test: RegExp;
  handler: Previewer;
}

const previewers: PreviewerEntry[] = [
  { test: /^image\//, handler: imagePreviewer },
  { test: /^video\//, handler: videoPreviewer },
  { test: /^text\//, handler: textPreviewer },
  { test: /^(application|text)\/json$/, handler: jsonPreviewer },
];

/**
 * Returns an appropriate previewer for the given MIME type.
 * If the MIME type is considered unsafe, a previewer returning a safe message
 * is returned instead.
 */
export function getPreviewer(mime: string): Previewer | null {
  if (!isSafeMimeType(mime)) {
    return async () => blockedMessage(mime);
  }

  const entry = previewers.find((p) => p.test.test(mime));
  return entry ? entry.handler : null;
}

export { imagePreviewer, videoPreviewer, textPreviewer, jsonPreviewer };
