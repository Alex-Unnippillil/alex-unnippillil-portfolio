export default class QRCode {
  static render(container: HTMLElement, url: string = window.location.href, size = 150) {
    const img = document.createElement('img');
    img.alt = 'QR Code';
    img.width = size;
    img.height = size;
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    container.appendChild(img);
  }
}
