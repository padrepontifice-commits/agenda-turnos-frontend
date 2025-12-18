# Agenda básica con Google Calendar

Este proyecto muestra un ejemplo mínimo para autenticar con Google y crear eventos en el calendario.

Pasos rápidos:

1. Crear credenciales en Google Cloud Console:
   - Habilitar API de Google Calendar.
   - Crear OAuth 2.0 Client ID (Tipo: Web application).
   - Añadir `http://localhost:3000/oauth2callback` como URI de redirección autorizada.
   - Descargar Client ID y Client Secret.

2. Copiar `.env.example` a `.env` y completar:

   - `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `SESSION_SECRET`.

3. Instalar dependencias e iniciar:

```bash
npm install
npm start
```

4. Abrir `http://localhost:3000`, hacer clic en "Iniciar sesión con Google" y luego crear eventos.

Uso de `calendarId`:

- En el formulario puedes indicar el `ID del calendario` (por ejemplo `primary` o el email del calendario). Si lo dejas vacío se usará el calendario `primary` del usuario autenticado.
- Asegúrate de que la cuenta autenticada tenga permisos de escritura sobre el calendario indicado.

Notas:
- Este proyecto es un ejemplo educativo. No usar en producción sin revisar seguridad (HTTPS, gestión de sesiones, renovación de tokens, validaciones).
- Para recibir actualizaciones a invitados se usa `sendUpdates: 'all'` en la inserción de evento.
