(() => {
  const checkbox = document.querySelector<HTMLInputElement>('#plainTextPaste');
  if (!checkbox) {
    return;
  }

  const stored = localStorage.getItem('plainTextPaste');
  if (stored === null) {
    checkbox.checked = true;
    localStorage.setItem('plainTextPaste', 'true');
  } else {
    checkbox.checked = stored === 'true';
  }

  checkbox.addEventListener('change', () => {
    localStorage.setItem('plainTextPaste', String(checkbox.checked));
  });
})();
