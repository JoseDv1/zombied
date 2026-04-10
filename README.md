# 🧟‍♂️ Zombied

Un juego de supervivencia de zombis estilo top-down shooter renderizado completamente en un `<canvas>` de HTML5. Sobrevive a oleadas interminables de enemigos, suma puntos con tus kills y utiliza poderosos poderes de área (Explosión y Barricada) para defenderte.

El proyecto ha sido rediseñado utilizando **TypeScript** y **Vite**, lo cual permite estructurarlo de manera totalmente modular (Entity component system).

## 🎮 Controles

- **Movimiento**: Teclas `W`, `A`, `S`, `D` o las Flechas del teclado.
- **Apuntar**: Mueve el Ratón (cursor estilo mirilla).
- **Disparar**: Click Izquierdo del Ratón.
- **Poderes**:
  - `E` - **Explosión**: Daño masivo de área para alejar/destruir a los zombis cercanos. (Tiene *cooldown*).
  - `Q` - **Barricada**: Crea un anillo defensivo con cierta vida que absorbe ataques y detiene momentáneamente a los enemigos. (Tiene *cooldown*).

## 🛠️ Tecnologías

- **Vanilla TypeScript**: Lógica, entidades (clases), herencia y manejo del Game Loop y físicas orientadas a objetos.
- **HTML5 Canvas**: Para todo el renderizado y animaciones nativas sin frameworks intermedios.
- **Vite**: Para la construcción ultra-rápida, Hot Module Replacement (HMR) local y minimizado en producción.
- **Bun**: Como environment para manejo de paquetes y scripts dev ultrarápidos.

## 🚀 Cómo Jugar Localmente

### Instalación

Asegúrate de tener [Bun](https://bun.sh/) instalado y ejecuta:

```bash
# 1. Instalar dependencias
bun install
```

### Entorno de Desarrollo (Dev Server)

```bash
# 2. Iniciar el servidor local (se abrirá en http://localhost:5173/)
bun run dev
```

### Build de Producción

Empaqueta, compila y compite los estáticos:

```bash
bun run build
```
Esto creará una carpeta `./dist` lista para ser servida.

## 📦 Despliegue en Vercel

Este proyecto está diseñado para funcionar _out-of-the-box_ con Vercel. Sigue estos pasos para subir tu juego al mundo:
1. Sube este repositorio a tu cuenta de GitHub/GitLab.
2. Inicia un nuevo proyecto en Vercel y escoge tu repositorio.
3. Vercel detectará el bundle configurado con Vite automáticamente.
   - **Build Command**: `bun run build` u homólogo (`tsc && vite build`).
   - **Output Directory**: `dist`
4. Deploy y ¡Listo a jugar!

---
*Hecho para sobrevivir, hasta el final.*
