import CapabilitiesDetector from '../lib/capabilities';
import Telemetry from '../lib/telemetry';

export type ProfileVariant = 'simplified' | 'advanced';

export default class AdaptiveProfile {
  static resolve(): ProfileVariant {
    const capabilities = CapabilitiesDetector.detect();
    Telemetry.sendCapabilities(capabilities);

    const isLow = !(
      capabilities.webgl &&
      capabilities.wasm &&
      capabilities.clipboard &&
      capabilities.notifications &&
      capabilities.pointer === 'fine'
    );

    return isLow ? 'simplified' : 'advanced';
  }
}
