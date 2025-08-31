export interface SandboxedIframeOptions {
  /** URL of the third-party content */
  src: string;
  /** Origin allowed to communicate through the bridge */
  allowedOrigin: string;
  /** Capabilities allowed through the message bridge */
  allowedCapabilities?: string[];
  /** Callback when a warning should be displayed */
  onWarning?: (message: string) => void;
}

export interface SandboxedIframeHandle {
  iframe: HTMLIFrameElement;
  /** send a message to the iframe */
  postMessage: (data: any) => void;
  /** destroy iframe and remove listeners */
  destroy: () => void;
}

/**
 * Create a sandboxed iframe for untrusted third‑party content.
 * The iframe is isolated with strict permissions and communicates
 * with the host page via a narrow, origin‑checked message bridge.
 */
export default function createSandboxedIframe(
  container: HTMLElement,
  options: SandboxedIframeOptions,
): SandboxedIframeHandle {
  const {
    src,
    allowedOrigin,
    allowedCapabilities = [],
    onWarning,
  } = options;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.src = src;
  iframe.style.border = '0';
  container.appendChild(iframe);

  const showWarning = (message: string): void => {
    if (onWarning) {
      onWarning(message);
    }
    const warning = document.createElement('div');
    warning.className = 'iframe-warning';
    warning.textContent = message;
    warning.style.position = 'absolute';
    warning.style.top = '0';
    warning.style.left = '0';
    warning.style.right = '0';
    warning.style.background = 'rgba(255,0,0,0.8)';
    warning.style.color = '#fff';
    warning.style.padding = '4px';
    container.appendChild(warning);
  };

  const handleMessage = (event: MessageEvent): void => {
    if (event.source !== iframe.contentWindow) return;
    if (event.origin !== allowedOrigin) return;
    const { type, capability } = event.data || {};
    if (type === 'request') {
      if (!allowedCapabilities.includes(capability)) {
        showWarning(`Capability "${capability}" blocked`);
        if (typeof (event.source as Window | null)?.postMessage === 'function') {
          (event.source as Window).postMessage({ type: 'blocked', capability }, event.origin);
        }
        return;
      }
      if (typeof (event.source as Window | null)?.postMessage === 'function') {
        (event.source as Window).postMessage({ type: 'ack', capability }, event.origin);
      }
    }
  };

  window.addEventListener('message', handleMessage);

  return {
    iframe,
    postMessage: (data: any) => {
      iframe.contentWindow?.postMessage(data, allowedOrigin);
    },
    destroy: () => {
      window.removeEventListener('message', handleMessage);
      iframe.remove();
    },
  };
}
