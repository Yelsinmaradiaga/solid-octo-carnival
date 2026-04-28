# NYC Turbo Jump 🚗🗽

Juego de carros animados estilo plataformas (inspirado en la sensación arcade de Mario), ambientado en una avenida de **New York City**.

## Si no te corre, haz esto (paso a paso)

### Opción recomendada (servidor local)

1. Abre una terminal dentro de esta carpeta.
2. Ejecuta:

```bash
./launch.sh
```

3. Abre en tu navegador:

- http://localhost:8000

### Opción alternativa

Si no quieres usar el script:

```bash
python3 -m http.server 8000
```

Y luego abre http://localhost:8000.

## Abrir directo sin servidor

También puedes abrir `index.html` con doble click, pero en algunos navegadores o configuraciones puede fallar por seguridad local. Si eso pasa, usa la opción de servidor local de arriba.

## Controles

- `Espacio` o `↑`: saltar
- Click/toque en el canvas: saltar
- `R`: reiniciar cuando pierdes

## Problemas comunes

- **"python3: command not found"**
  - Instala Python 3 o usa el comando `python -m http.server 8000`.
- **No carga nada en el navegador**
  - Revisa que estés abriendo `http://localhost:8000` (no otro puerto).
- **Pantalla en blanco**
  - Recarga con `Ctrl+F5` y prueba en Chrome/Edge/Firefox actualizados.

## Objetivo

Esquivar los carros que vienen en sentido contrario y lograr la mayor puntuación.
