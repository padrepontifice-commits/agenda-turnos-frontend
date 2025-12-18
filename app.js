document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nombre: form.nombre.value,
    telefono: form.telefono.value,
    fecha: form.fecha.value,
    hora: form.hora.value,
    servicio: form.servicio.value
  };
  const resEl = document.getElementById('result');
  resEl.textContent = 'Agendando turno...';
  try {
    const resp = await fetch('https://script.google.com/macros/s/AKfycbxtZi5LnbpxUHseo6wOK_bCW9P7CIaGKlG5ibCJdEdsSroO7rz7NGbOW4vP2PXiDH18/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await resp.json();
    if (resp.ok) {
      resEl.innerHTML = `Turno agendado. <a href="${json.htmlLink}" target="_blank">Abrir en Google Calendar</a>`;
    } else {
      resEl.textContent = json.error || 'Error desconocido';
    }
  } catch (err) {
    resEl.textContent = 'Error de red';
  }
});
