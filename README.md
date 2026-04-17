# Neon Tetris Pro

Un juego de Tetris moderno y profesional construido con React (Vite) y Node.js (Express), listo para ser desplegado en Google Cloud Run.

## Características
- **Mecánicas Clásicas**: Caída, rotación, movimiento lateral y "hard drop".
- **Dificultad Dinámica**: 4 niveles (Fácil, Medio, Difícil, Extremo) que afectan la velocidad y el multiplicador de puntos.
- **Sistema de Ranking**: Top 10 persistente (almacenado en `ranking.json`).
- **Interfaz Moderna**: Estética "Neon Tech" con animaciones fluidas usando `motion`.
- **Arquitectura Full-Stack**: Frontend rápido con Vite y Backend ligero con Express.
- **Contenedorizado**: Listo para Docker y Google Cloud Run.

## Requisitos Previos
- Node.js (v18 o superior)
- Docker (opcional, para despliegue)

## Instalación y Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar en modo desarrollo (Backend + Frontend con HMR):
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

## Despliegue en Google Cloud Run

### 1. Construir la Imagen Docker
Reemplaza `PROJECT_ID` con tu ID de proyecto de Google Cloud.

```bash
docker build -t gcr.io/PROJECT_ID/neon-tetris .
```

### 2. Subir a Artifact Registry o GCR
```bash
docker push gcr.io/PROJECT_ID/neon-tetris
```

### 3. Desplegar en Cloud Run
```bash
gcloud run deploy neon-tetris \
  --image gcr.io/PROJECT_ID/neon-tetris \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Notas Técnicas y Resumen de Decisiones

### Arquitectura Full-Stack
Se eligió una arquitectura de **Express + Vite** para permitir un backend ligero que gestione la persistencia del ranking. Aunque el juego es principalmente del lado del cliente, el servidor centraliza los récords de los jugadores.

### Persistencia
Para este proyecto, se utiliza un archivo `ranking.json`. 
**Advertencia para Cloud Run**: Cloud Run utiliza un sistema de archivos efímero. Esto significa que si el contenedor se reinicia o se escala, los datos del ranking se perderán. 
**Recomendación para Producción**: Integrar con una base de datos externa como **Google Cloud Firestore** o **Cloud SQL** para una persistencia real y duradera.

### Juego y Rendimiento
Se utiliza `requestAnimationFrame` para el ciclo del juego, asegurando una fluidez de 60fps independiente de la carga de React. La lógica está aislada en un custom hook `useTetris` para mantener los componentes limpios y reactivos.

---
Construido por Neon Tetris Pro Team.
