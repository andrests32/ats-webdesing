# Validación de entrega

Revisión realizada el 18 de octubre de 2026.

- Instalación final: `pnpm install --offline --frozen-lockfile` en el disco externo. 302 paquetes instalados; Node 24.14.0 y pnpm 10.33.2.
- `pnpm build`: Astro y TypeScript sin errores ni advertencias; páginas estáticas ES/EN, seis páginas legales, redirección de inicio, 404, robots e imágenes optimizadas.
- `pnpm test`: **22 pruebas aprobadas**, ejecutadas desde `/media/andrests/Linux_Data/projects/ats-web-studio` sobre la compilación final.
- `pnpm format:check`: correcto.
- Servidor de desarrollo comprobado desde la carpeta final en español e inglés, sin errores de JavaScript ni recursos fallidos.
- Revisión visual en 1440 × 960, 390 × 844 y 768 × 1024. Sin desbordamiento horizontal en estas resoluciones.
- Menú: texto blanco, foco contenido, cierre con Escape, devolución del foco y navegación a secciones. El footer ofrece acceso directo a las cinco secciones principales.
- Billonchok primero; ventanas de proyectos con imágenes cargadas y enlace externo donde corresponde.
- Formulario: validación nativa y borrador de WhatsApp correctamente codificado. No se enviaron mensajes.
- Contenido y contacto directo disponibles sin JavaScript; secuencias avanzadas desactivadas con movimiento reducido.
- Hero: franja naranja siguiendo al mouse, permanencia en su última posición, retorno a un píxel tras 900 ms sin interacción y expansión progresiva durante el scroll. Proyectos parte en crema y comparte el recorte hasta quedar completamente naranja. Texto de ambas capas alineado en ES/EN y menú operativo. Comprobados el cambio de movimiento reducido en caliente y el cambio escritorio/móvil/escritorio; sin IDs duplicados ni un segundo `h1`.
- Proyectos, servicios y procesos: separación visual comprobada entre textos y números. En escritorio, el scroll activa cada proyecto y lo ilumina en blanco dentro de la capa naranja; el listado no muestra miniaturas y el hover no cambia la selección. Los modales conservan sus imágenes, el cierre fuera del área desplazable, ocultan la barra nativa y muestran un indicador naranja temporal mientras se desplazan.
- Footer y legales: CTA “Cuéntanos tu idea” en una sola línea, navegación a Privacidad, Términos y Cancelaciones/Reembolsos, versiones ES/EN, fuentes oficiales y cálculo proporcional del saldo por horas o hitos trabajados.
- SEO local de producción probado con el dominio reservado `https://ats.example`, sin publicarlo: Zamora y Zamora Chinchipe en metadatos y JSON-LD, canonical, Open Graph, `hreflang`, robots y sitemap con ocho URLs indexables sin duplicar la redirección raíz. Ese dominio de prueba no está en la compilación local entregada.

Las capturas `previews/desktop.png` y `previews/mobile.png` muestran el inicio de la versión entregada. Para ver las animaciones, usar `pnpm dev`.

El dominio público definitivo sigue pendiente de configuración en `.env`. No se creó ningún despliegue. Las comprobaciones de navegador se hicieron en Chrome; no constituyen una certificación de accesibilidad ni una auditoría de rendimiento en todos los dispositivos.
