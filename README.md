# BOXINGCI

BOXINGCI es una plataforma interactiva para aprender boxeo mediante visualizadores interactivos, análisis táctico, combinaciones, defensa, desplazamientos y recursos organizados para entrenar con mayor intención.

## Herramientas

- [Visualizador de líneas](https://rbvk.github.io/visualizador-de-lineas/).

El visualizador se abre desde su sitio actual. La ruta anterior
`herramientas/teoria-de-las-lineas/index.html` redirige allí para conservar
los enlaces existentes. BOXINGCI está en español y no incluye selector de idioma.

## Biblioteca

- Rangos: `biblioteca/rangos/index.html`.
- Golpes: `biblioteca/golpes/index.html`.
- Defensa: `biblioteca/defensa/index.html`.

## GitHub Pages

1. Coloca `index.html`, `assets/`, `biblioteca/`, `herramientas/` y `.nojekyll`
   en la raíz del repositorio `rbvk/boxingCI`.
2. En **Settings → Pages**, selecciona **Deploy from a branch**,
   la rama **main** y la carpeta **/ (root)**. Guarda.
3. Abre <https://rbvk.github.io/boxingCI/> cuando termine la publicación.

Los cambios preparados sustituyen el antiguo archivo sin extensión
`herramientas/teoria-de-las-lineas` por una carpeta con `index.html`.
Si subes los archivos manualmente, elimina primero ese archivo antiguo para
poder crear la carpeta.

No se necesitan dependencias ni compilación. Para probar localmente,
abre `index.html` o ejecuta desde esta carpeta:

```bash
python3 -m http.server 8000
```

Después abre <http://localhost:8000/>.

Documentación oficial:
<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>.

Hecho por Rodolfo Valle.
