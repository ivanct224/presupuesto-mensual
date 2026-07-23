# Presupuesto Mensual

App personal de presupuesto: sueldo inicial editable, gastos fijos, "sacar plata", gastos variados y cuotas del teléfono. Se puede instalar en el celular como una app (PWA) y los datos quedan guardados en el propio dispositivo (localStorage), sin depender de internet una vez instalada.

## Publicarla en GitHub Pages (gratis)

1. **Crea un repositorio en GitHub**
   - Entra a https://github.com/new
   - Nombre sugerido: `presupuesto-mensual`
   - Puede ser público o privado (Pages funciona igual, aunque en repos privados gratuitos a veces Pages no está disponible — si es tu caso, hazlo público).
   - Crea el repo vacío (sin README, sin .gitignore).

2. **Sube estos archivos al repositorio**
   Desde tu computador, en una terminal, dentro de esta carpeta (`presupuesto-app`):
   ```bash
   git init
   git add .
   git commit -m "Primera version de la app de presupuesto"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/presupuesto-mensual.git
   git push -u origin main
   ```
   (Reemplaza `TU-USUARIO` por tu usuario de GitHub.)

   Si prefieres no usar terminal: en la página del repo, botón **"Add file" → "Upload files"**, arrastra todos los archivos y carpetas, y confirma el commit.

3. **Activa GitHub Pages**
   - En el repo, ve a **Settings → Pages**.
   - En "Build and deployment" → **Source**, elige **GitHub Actions**.
   - Eso es todo: el archivo `.github/workflows/deploy.yml` ya incluido se encarga de compilar y publicar la app automáticamente cada vez que hagas `push` a `main`.

4. **Espera el despliegue**
   - Ve a la pestaña **Actions** del repo y espera a que el workflow termine (ícono verde ✔).
   - Vuelve a **Settings → Pages**: ahí aparecerá la URL pública, algo como:
     `https://TU-USUARIO.github.io/presupuesto-mensual/`

## Instalarla en el celular

1. Abre esa URL en Chrome (Android) o Safari (iPhone).
2. **Android/Chrome**: toca el menú (⋮) → "Agregar a pantalla de inicio" o "Instalar app".
3. **iPhone/Safari**: toca el botón compartir (□↑) → "Agregar a pantalla de inicio".
4. Te quedará un ícono como cualquier otra app. Al abrirla, funciona a pantalla completa, sin barra del navegador.

Los datos (montos, checkboxes, sueldo) se guardan en el almacenamiento local del navegador/app en ese celular. Si cambias de celular o borras datos del navegador, no se transfieren solos — es un presupuesto local a ese dispositivo.

## Desarrollo local (opcional)

Si quieres probarla o modificarla antes de subirla:
```bash
npm install
npm run dev
```
Abre la URL que te indique la terminal (normalmente `http://localhost:5173`).

Para generar la versión de producción manualmente:
```bash
npm run build
npm run preview
```

## Estructura

- `src/App.jsx` — toda la lógica y la interfaz de la app.
- `public/manifest.json` y `public/sw.js` — lo que permite instalarla como app (PWA).
- `.github/workflows/deploy.yml` — publica automáticamente en GitHub Pages con cada `push` a `main`.
