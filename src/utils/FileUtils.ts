export default class FileUtils {
  /**
   * Validate file size & type then return SHA-256 hash.
   * @throws Error when validation fails.
   */
  static async validateAndHash(
    file: File,
    allowedTypes: string[],
    maxSize: number,
  ): Promise<string> {
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type');
    }
    if (file.size > maxSize) {
      throw new Error('File too large');
    }
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
