# Tetris Neon

Juego en vivo: https://neon-tetris-pro-77199174767.us-west1.run.app/

## Descripcion

Tetris Neon ofrece una experiencia de bloques moderna con visual neon, modos de dificultad, ranking global y controles hibridos.

## Estandar aplicado

La implementacion mantiene el estandar de JuegoSerpiente para asegurar coherencia entre todos los juegos.

- Estructura de pantalla consistente.
- Sistema de estilos compartido.
- Convenciones de build y despliegue equivalentes.

## Arquitectura comun

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + motion/react
- Motor de juego sobre canvas
- Ranking remoto + fallback localStorage
- Dockerfile multistage + cloudbuild.yaml

## Controles

- Escritorio: izquierda/derecha mover, arriba rotar, abajo soft drop, espacio hard drop, P pausa, R reinicio.
- Movil: D-pad tactil y gestos swipe.

## Desarrollo local

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar entorno local:

```bash
npm run dev
```

3. Validar tipado:

```bash
npm run lint
```

## Build y despliegue

- Build: npm run build
- Runtime: puerto 8080
- Despliegue en Cloud Run usando Dockerfile y cloudbuild.yaml

## Creditos

Desarrollado por Galindez & IA.
