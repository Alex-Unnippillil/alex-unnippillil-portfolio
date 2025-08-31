(() => {
  const mapContainer = document.getElementById('map') as HTMLElement | null;
  const useBtn = document.getElementById('use-location');
  const saveBtn = document.getElementById('save-location') as HTMLButtonElement | null;
  const addressDiv = document.getElementById('address');
  const latInput = document.getElementById('latitude') as HTMLInputElement | null;
  const lngInput = document.getElementById('longitude') as HTMLInputElement | null;

  function showStatic(): void {
    if (!mapContainer) return;
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = 'Map placeholder';
    img.src = mapContainer.dataset.staticSrc || '';
    mapContainer.appendChild(img);
  }

  async function showMap(lat: number, lng: number): Promise<void> {
    if (!mapContainer) return;
    const iframe = document.createElement('iframe');
    iframe.loading = 'lazy';
    iframe.width = '100%';
    iframe.height = '300';
    iframe.src = `https://www.openstreetmap.org/export/embed.html?marker=${lat},${lng}&zoom=14`;
    mapContainer.innerHTML = '';
    mapContainer.appendChild(iframe);

    if (addressDiv) {
      try {
        const resp = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
        if (resp.ok) {
          const data = await resp.json();
          addressDiv.textContent = data.address;
        }
      } catch (e) {
        addressDiv.textContent = 'Address unavailable';
      }
    }

    if (latInput) latInput.value = `${lat}`;
    if (lngInput) lngInput.value = `${lng}`;
    if (saveBtn) saveBtn.style.display = 'block';
  }

  showStatic();

  if (useBtn) {
    useBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          showMap(latitude, longitude);
        },
        () => {
          alert('Unable to retrieve location');
        },
      );
    });
  }
})();
