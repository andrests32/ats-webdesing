# ATS Web Studio

Landing bilingüe de ATS, inspirada en la composición editorial y el movimiento de Specia1ne. Proyecto nuevo e independiente: el proyecto original `ats-web` no se modifica.

## Abrir y ejecutar

```sh
cd /media/andrests/Linux_Data/projects/ats-web-studio
code .
pnpm dev
```

Abrir **http://localhost:4321/es/**. La versión inglesa está en **/en/**. La raíz redirige a español. Si el puerto ya está ocupado, Astro muestra el puerto disponible en la terminal.

Requisitos: Node **22.22 o superior** (recomendado Node 24) y pnpm **10.33.2**. Dependencias instaladas con pnpm y fijadas en `pnpm-lock.yaml`. Para reinstalar: `pnpm install --frozen-lockfile`. No usar npm.

## Dónde editar

| Archivo o carpeta              | Contenido                                                 |
| ------------------------------ | --------------------------------------------------------- |
| `src/i18n/ui.ts`               | Textos completos en español e inglés                      |
| `src/data/projects.ts`         | Orden, imágenes, descripciones y enlaces del portafolio   |
| `src/data/site.ts`             | Marca, contacto y ubicación local                         |
| `src/data/legal.ts`            | Privacidad, términos y cancelaciones en ambos idiomas     |
| `src/components/`              | Secciones, menú, ventanas de proyectos y formulario       |
| `src/styles/global.css`        | Colores, tipografía, composición y responsive             |
| `src/scripts/main.ts`          | GSAP, ScrollTrigger, Lenis, diálogos y contacto           |
| `src/assets/brand/`            | Logos originales de ATS                                   |
| `src/assets/projects/`         | Imágenes con nombres reconocibles                         |
| `src/layouts/BaseLayout.astro` | Metadatos, idiomas, Open Graph y datos estructurados      |
| `docs/`                        | Decisiones de diseño, fuentes de los activos y validación |

Billonchok está primero. Después: Glamping Look, Inmobiliaria Luxen, Vital Health MC y Hostería Castillo Real. Para cambiar el orden, mover los objetos del arreglo de proyectos. Se usa una sola estructura y dos diccionarios, sin duplicar el diseño por idioma.

## Comandos

```sh
pnpm dev          # Desarrollo local
pnpm check        # Comprobación Astro + TypeScript
pnpm build        # Comprobación y compilación estática en dist/
pnpm preview      # Revisar el resultado compilado
pnpm test         # Pruebas de navegación, idiomas, formularios y móvil
pnpm format       # Formatear el código
```

Las pruebas usan Chrome instalado en `/usr/bin/google-chrome` y no envían mensajes. En otro equipo puedes definir `PLAYWRIGHT_CHROME_PATH` con la ruta del navegador, o instalar Chromium de Playwright. Se ejecutan sobre la compilación estática en el puerto 4322; ese puerto debe estar disponible.

VS Code incluye recomendaciones de extensiones y dos tareas: **ATS: iniciar** y **ATS: verificar y compilar**.

## Antes de publicar: dominio real

Copia `.env.example` a `.env` y configura:

```dotenv
PUBLIC_SITE_URL=https://tu-dominio-real.com
```

Vuelve a ejecutar `pnpm build`. El dominio configura canonical, alternativas de idioma, Open Graph, datos estructurados, robots y sitemap. Sin este valor, la vista local lleva **noindex**, robots bloquea la indexación y no se emite sitemap para evitar publicar direcciones ficticias. No hay despliegue ni cuenta de hosting creados.

El resultado de `dist/` puede servirse en cualquier hosting estático. Conserva las carpetas `/es/` y `/en/`, y configura `404.html` como página de error del hosting. No habilites un fallback de SPA a `index.html`.

## Contacto

Los datos se conservaron del proyecto original: `atsagency@gmail.com` y WhatsApp `+593 97 953 5072`. Confírmalos en `src/data/site.ts` antes de publicar.

El formulario valida nombre, correo y mensaje, y **abre un borrador de WhatsApp** para que la persona lo revise y lo envíe. No simula un envío ni guarda datos. El correo es un enlace `mailto:`. No requiere claves, base de datos ni servicio de formularios.

## Movimiento y accesibilidad

GSAP coordina entrada del titular, apertura de capítulos, menú y ventanas. ScrollTrigger mantiene el capítulo de proyectos y activa uno por uno sin depender del hover. Las imágenes se reservan para las ventanas de detalle. Lenis suaviza el scroll en equipos con ratón. En móvil el desplazamiento es nativo; con movimiento reducido se desactivan las secuencias y las secciones fijas.

En escritorio, la línea del hero se abre en una franja naranja que sigue al mouse y revela el texto en crema. Conserva la última posición del mouse, vuelve a un píxel tras 900 ms sin movimiento y, durante el scroll, se ensancha desde ese punto sobre el fondo crema hasta cubrir el viewport y proyectos. Su ancho y suavidad se ajustan en `src/scripts/hero-reveal.ts`; se desactiva en pantallas táctiles y con movimiento reducido.

Los diálogos usan `dialog` nativo, Escape, foco contenido y devolución del foco. El contenido principal y las vías directas de contacto siguen visibles sin JavaScript. Las fuentes Geist y Geist Mono se alojan con el proyecto; no se solicitan a Google Fonts.

El menú lateral usa texto blanco sobre naranja. El footer repite los enlaces a Visión, Proyectos, Servicios, Estudio y Contacto para volver a cualquier sección sin abrir el menú.

## SEO local y textos legales

El título, la descripción, el contenido visible y los datos estructurados `ProfessionalService` identifican a ATS en Zamora, Zamora Chinchipe, Ecuador, con cobertura para Ecuador. Cada ruta tiene canonical, Open Graph, `hreflang` español Ecuador/inglés y entra al sitemap cuando se configura el dominio público.

El footer enlaza a Privacidad, Términos y Cancelaciones/Reembolsos en español e inglés. La política de cancelación descuenta horas o hitos efectivamente trabajados y costos de terceros autorizados; no aplica automáticamente una penalidad fija del 35 %. Antes de publicar, confirma que el nombre del responsable, la forma de facturación y las condiciones de cada propuesta coincidan con la operación real.

## Stack

Astro 7, TypeScript 6, Tailwind CSS 4, GSAP 3, Lenis 1 y pnpm. No se añade React porque esta experiencia no lo necesita.
# ats-webdesing
