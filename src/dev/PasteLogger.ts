export default function pasteLogger(strippedElements: string[]): void {
  if (strippedElements.length) {
    // eslint-disable-next-line no-console
    console.debug('Stripped elements:', strippedElements.join(', '));
  }
}
