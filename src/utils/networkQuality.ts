export default class NetworkQuality {
  static getDownlink(): number {
    if (typeof navigator === 'undefined' || !(navigator as any).connection) {
      return 0;
    }

    const { downlink = 0 } = (navigator as any).connection;
    return downlink;
  }

  static isSlow(threshold = 1.5): boolean {
    const downlink = NetworkQuality.getDownlink();
    if (downlink && downlink > 0 && downlink < threshold) {
      return true;
    }

    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      const { saveData, effectiveType } = (navigator as any).connection;
      if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
        return true;
      }
    }

    return false;
  }
}
