import { Previewer } from './index';

/**
 * Reads a JSON blob and returns a formatted string representation.
 */
export const jsonPreviewer: Previewer = async (blob: Blob): Promise<string> => {
  const text = await blob.text();
  const data = JSON.parse(text);
  return JSON.stringify(data, null, 2);
};

export default jsonPreviewer;
