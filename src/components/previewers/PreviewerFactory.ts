import BasePreviewer from './BasePreviewer';
import ImagePreviewer from './ImagePreviewer';
import VideoPreviewer from './VideoPreviewer';
import TextPreviewer from './TextPreviewer';
import JsonPreviewer from './JsonPreviewer';
import UnsafePreviewer from './UnsafePreviewer';
import { isSafeType } from './SecurityGuard';

export default function createPreviewer(type: string, container?: HTMLElement): BasePreviewer {
  if (!isSafeType(type)) {
    return new UnsafePreviewer(container);
  }
  if (type.startsWith('image/')) {
    return new ImagePreviewer(container);
  }
  if (type.startsWith('video/')) {
    return new VideoPreviewer(container);
  }
  if (type === 'application/json') {
    return new JsonPreviewer(container);
  }
  return new TextPreviewer(container);
}
