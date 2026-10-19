# Dirección visual

Referencia: https://specia1ne.com/ — revisada en escritorio y móvil.

La composición comparte un eje vertical al 61.2% del viewport. El titular es grande, con poco interlineado; las etiquetas, contadores y metadatos usan monoespaciada. Los capítulos alternan crema, naranja y oscuro. El portafolio se presenta como una lista editorial numerada; en escritorio, el scroll activa cada proyecto sin mostrar miniaturas. Las imágenes se reservan para las ventanas de detalle.

Se recrea el lenguaje visual con componentes propios. No se copian los textos, logotipos ni el código de la referencia. La paleta procede de ATS: naranja `#ff8200`, crema `#f1eada`, oscuro `#141414`, ámbar `#ffb43e`.

## Secuencias

1. Entrada escalonada del titular y el texto de presentación.
2. La franja naranja conserva la última posición del mouse y se expande desde ese punto durante el scroll. El capítulo de proyectos parte en crema y el mismo recorte naranja lo cubre progresivamente hasta revelar el capítulo completo.
3. Proyectos fijos en escritorio amplio mientras el scroll cambia el enfoque de 01 a 05. La capa base ya utiliza texto blanco y la capa naranja ilumina el proyecto seleccionado sin mostrar miniaturas.
4. Activación de servicios al pasar por el centro del viewport.
5. Entrada del capítulo oscuro del estudio.
6. Menú lateral y ventanas de proyecto con apertura/cierre breve.
7. En escritorio, la línea del hero se abre en una franja naranja que sigue al mouse y revela el texto en crema. Conserva su última posición y vuelve a un píxel después de 900 ms sin interacción; al hacer scroll, se ensancha desde allí hasta cubrir toda la pantalla y la sección de proyectos. La capa decorativa incluye la cabecera, no recibe clics ni foco y se desactiva en pantallas táctiles o con movimiento reducido.
8. Los modales de proyecto ocultan la barra nativa y muestran un indicador naranja de un píxel únicamente mientras se desplazan. El control de cierre permanece visible.

Las secuencias no compiten por el mismo elemento: los recortes afectan al capítulo y el pin al contenedor interior. Lenis comparte el ticker de GSAP. Se recalculan los puntos de scroll cuando las fuentes están listas.

El tamaño mínimo del viewport y `prefers-reduced-motion` determinan la activación de efectos avanzados. El diseño base es visible sin depender de animaciones. Para cambiar intensidad y tiempos, editar `src/scripts/main.ts`; el seguimiento del mouse del hero está en `src/scripts/hero-reveal.ts`.
