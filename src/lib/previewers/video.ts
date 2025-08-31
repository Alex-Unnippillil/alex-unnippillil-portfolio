import { Previewer } from './index';

/**
 * Generates an object URL that can be used as the src attribute for a video
 * element.
 */
export const videoPreviewer: Previewer = async (blob: Blob): Promise<string> => {
  return URL.createObjectURL(blob);
};

export default videoPreviewer;
