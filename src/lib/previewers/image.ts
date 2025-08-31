import { Previewer } from './index';

/**
 * Generates an object URL that can be used as the src attribute for an image
 * element.
 */
export const imagePreviewer: Previewer = async (blob: Blob): Promise<string> => {
  return URL.createObjectURL(blob);
};

export default imagePreviewer;
