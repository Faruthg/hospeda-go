<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/48401e8c-57e8-453b-bd29-cc633172fb26

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install --legacy-peer-deps`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Acceso de demostración

El prototipo ofrece registro e inicio de sesión local. Las cuentas se guardan en el almacenamiento del navegador y las reservas se vinculan al correo de la cuenta.
El administrador puede generar una contraseña temporal para otra cuenta; el usuario debe cambiarla al iniciar sesión. La clave debe entregarse manualmente y las notificaciones se filtran por rol y destinatario dentro del mismo navegador.

- Huésped: `guest@hospedago.com` / `Guest123!`
- Anfitrión: `host@hospedago.com` / `Host123!`
- Administrador: `admin@hospedago.com` / `Admin123!`

Las credenciales listadas son las iniciales; después de un restablecimiento usa la contraseña temporal y luego la nueva contraseña guardada en ese navegador. Este flujo no valida identidades en un servidor ni envía contraseñas por correo, y no es seguro para producción. Sustituye la autenticación local por un proveedor/backend antes de publicar la aplicación.

## Publicar una vista de prueba en GitHub Pages

El workflow de GitHub Actions publica automáticamente `main` en Pages. El repositorio debe llamarse `hospeda-go` para que coincida con la ruta base de Vite. Después de subir el proyecto, habilita Pages en **Settings → Pages → Build and deployment → GitHub Actions**.

GitHub Pages solo hospeda el frontend estático: el registro, el inicio de sesión y las reservas de este prototipo se guardan localmente en cada navegador y no se comparten entre usuarios o dispositivos.
