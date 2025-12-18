document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    summary: `Turno para ${form.nombre.value} - ${form.servicio.value}`,
    description: `Nombre: ${form.nombre.value}\nTeléfono: ${form.telefono.value}\nServicio: ${form.servicio.value}`,
    date: form.fecha.value,
    startTime: form.hora.value,
    durationMinutes: 60,
    calendarId: 'primary'
  };
  const resEl = document.getElementById('result');
  resEl.textContent = 'Agendando turno...';
  try {
    const resp = await fetch('/create-event', {
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
