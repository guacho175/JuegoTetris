# Tetris Neón 🧩

Bienvenido al repositorio de **Tetris Neón**, una reinvención técnica y moderna del clásico juego de puzzle, desarrollado en **React**, **TypeScript** y **Vite**. Este proyecto forma parte del universo **Neon Arcade**, destacando por su estética retrowave y su arquitectura orientada al rendimiento.

🌐 **Juega ahora en:** [https://tetris.orbynexdigital.cl/](https://tetris.orbynexdigital.cl/)

## 🚀 Arquitectura y Tecnologías

El juego está diseñado como una aplicación web de alto rendimiento (SPA), garantizando fluidez en los inputs del usuario (60 FPS) y un renderizado impecable a través de React.

- **Frontend:** React 19, TypeScript (para seguridad de tipos estricta y mejor mantenibilidad).
- **Tooling:** Vite
- **Estilos:** CSS modular (animaciones fluidas por GPU, variables CSS, y efectos de brillo *glow* dinámicos).
- **Infraestructura:** Serverless nativo vía Vercel.

## 🎮 Caso de Uso y Funcionalidades (Game Design)

El caso de uso principal de la aplicación es proveer una experiencia arcade completa tanto en dispositivos de escritorio como en terminales móviles. 

### Funcionalidades Técnicas:
* **Físicas y Lógica del Tablero:** Motor de matrices en tiempo real para detección de colisiones, rotación de piezas (Tetrominós) y eliminación de líneas con efectos en cadena.
* **Responsive Design:** El tablero y los controles están programados para escalar dinámicamente y funcionar de manera nativa en navegadores móviles (Mobile-first). Cuenta con soporte para eventos táctiles (On-Screen D-Pad) para controlar las piezas.
* **Sistema de Puntaje y Ranking:** Persistencia del estado de la partida, aumento de dificultad (drop speed) por nivel, y un sistema de ranking que guarda las puntuaciones máximas (High Scores), incentivando la rejugabilidad.
* **Audio Interactivo:** Integración de sonido reactivo ante rotaciones, caídas rápidas y líneas completadas.

## 🛠️ Instalación y Ejecución Local

Si deseas correr este proyecto y modificar el código fuente:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/guacho175/JuegoTetris.git
   cd JuegoTetris
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor local:
   ```bash
   npm run dev
   ```

4. Visualiza la aplicación en `http://localhost:5173`.

## 👨‍💻 Autor

Desarrollado y mantenido por **Galindez** - 2026.
