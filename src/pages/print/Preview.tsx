export default function Preview(): void {
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      @page {
        size: A4;
        margin: 20mm;
      }

      body {
        margin: 0;
      }
    }

    .page-preview {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      box-sizing: border-box;
      background: #fff;
    }
  `;
  document.head.appendChild(style);

  const preview = document.createElement('div');
  preview.className = 'page-preview';
  document.body.appendChild(preview);
}
