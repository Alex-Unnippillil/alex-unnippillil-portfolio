export interface DataChannelOptions {
  /** Optional TURN server details */
  turnServer?: RTCIceServer;
}

/**
 * Utility to establish a WebRTC DataChannel connection using a simple join
 * code workflow. The host creates an offer and shares the encoded join code
 * with a peer. The peer accepts the offer, returning an answer code which the
 * host applies to finalize the connection.
 *
 * TURN servers are disabled by default. Administrators may enable TURN at
 * runtime using {@link enableTurn}.
 */
export default class DataChannel {
  private pc: RTCPeerConnection;

  private channel?: RTCDataChannel;

  private turnEnabled = false;

  private readonly options: DataChannelOptions;

  constructor(options: DataChannelOptions = {}) {
    this.options = options;
    this.pc = this.createPeerConnection();
  }

  /** Toggle usage of the configured TURN server. */
  public enableTurn(enable: boolean) {
    this.turnEnabled = enable;
    // Recreate connection so new ICE servers take effect
    const label = this.channel?.label ?? 'data';
    this.pc = this.createPeerConnection();
    if (this.channel) {
      this.channel = this.pc.createDataChannel(label);
    }
  }

  private createPeerConnection() {
    const iceServers: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];
    if (this.turnEnabled && this.options.turnServer) {
      iceServers.push(this.options.turnServer);
    }
    return new RTCPeerConnection({ iceServers });
  }

  /** Host side: create offer and return encoded join code. */
  public async createJoinCode(label = 'data'): Promise<string> {
    this.channel = this.pc.createDataChannel(label);
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return this.encode(this.pc.localDescription as RTCSessionDescriptionInit);
  }

  /**
   * Peer side: accept a join code (offer) and return answer code & DataChannel.
   */
  public acceptJoinCode(code: string): Promise<{ answer: string; channel: RTCDataChannel }> {
    const offer = this.decode(code);
    return new Promise((resolve, reject) => {
      this.pc.ondatachannel = async (ev) => {
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        resolve({
          answer: this.encode(this.pc.localDescription as RTCSessionDescriptionInit),
          channel: ev.channel,
        });
      };
      this.pc.setRemoteDescription(offer).catch(reject);
    });
  }

  /** Host side: finalize the connection using peer's answer code. */
  public async completeJoin(answerCode: string): Promise<RTCDataChannel> {
    const answer = this.decode(answerCode);
    await this.pc.setRemoteDescription(answer);
    return this.channel as RTCDataChannel;
  }

  private encode(desc: RTCSessionDescriptionInit): string {
    return Buffer.from(JSON.stringify(desc)).toString('base64');
  }

  private decode(code: string): RTCSessionDescriptionInit {
    return JSON.parse(Buffer.from(code, 'base64').toString());
  }
}
