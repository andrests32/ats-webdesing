export const languages = ['es', 'en'] as const;
export type Language = (typeof languages)[number];

export const ui = {
  es: {
    title: 'Diseño web en Zamora, Ecuador | ATS Web Studio',
    description:
      'Estudio de diseño y desarrollo web en Zamora, Ecuador. Creamos sitios a medida, catálogos digitales, rediseño y SEO técnico para negocios de Ecuador.',
    skip: 'Saltar al contenido',
    menu: 'Menú',
    close: 'Cerrar',
    navigation: 'Navegación principal',
    switchLanguage: 'Switch to English',
    languageName: 'Idioma',
    sections: ['Visión', 'Proyectos', 'Servicios', 'Estudio', 'Contacto'],
    cues: [
      'El punto de partida',
      'Trabajo seleccionado',
      'Lo que hacemos',
      'Cómo pensamos',
      'Tu próximo paso',
    ],
    hero: {
      label: 'Visión',
      lines: ['Diseño y desarrollo', 'web — de tu idea', 'a tu próximo', 'gran paso.'],
      description:
        'Un estudio independiente en Zamora, Ecuador, que conecta diseño, tecnología y estrategia para construir la web que tu negocio necesita.',
      location: 'DESDE ZAMORA, ECUADOR, PARA EL MUNDO',
      cta: 'Hablemos',
      scroll: 'Explorar el trabajo',
      motion: 'Activar movimiento',
      motionActive: 'Movimiento activo · pausar',
      motionWaiting: 'Conectando movimiento…',
      motionRetry: 'Reintentar movimiento',
      motionHint: 'Inclina el celular de lado a lado o desliza sobre la línea.',
      motionUnavailable:
        'No recibimos movimiento. Revisa el permiso de sensores en tu navegador o desliza sobre la línea.',
      motionSecure: 'Abre la web con HTTPS para activar el movimiento o desliza sobre la línea.',
    },
    work: {
      label: 'Trabajo seleccionado',
      lines: ['Proyectos reales.', 'Ideas en movimiento.'],
      description:
        'Marcas, experiencias y negocios. Cada proyecto, una forma distinta de hacer que la web trabaje a tu favor.',
      active: 'EN FOCO',
      open: 'Explorar proyecto',
      visit: 'Visitar sitio',
      category: 'TIPO DE PROYECTO',
      scope: 'ENFOQUE',
      featured: 'PRIMER PLANO',
      collection: 'Selección de proyectos',
    },
    services: {
      label: 'Servicios / Proceso',
      lines: ['Lo que se ve importa.', 'Cómo funciona, también.'],
      description:
        'Pensamos la experiencia completa: desde la primera impresión hasta el siguiente clic.',
      items: [
        {
          title: 'Diseño web',
          tag: 'DIRECCIÓN / IDENTIDAD',
          description:
            'Una presencia propia. Jerarquía, tipografía y detalle para que tu marca se entienda y se recuerde.',
        },
        {
          title: 'Desarrollo a medida',
          tag: 'CÓDIGO / EXPERIENCIA',
          description:
            'Sitios rápidos y adaptables, construidos alrededor de lo que tu negocio necesita. Sin plantillas que limiten tu idea.',
        },
        {
          title: 'SEO y rendimiento',
          tag: 'ESTRUCTURA / VELOCIDAD',
          description:
            'Una base técnica preparada para buscadores: contenido claro, carga eficiente y una experiencia cuidada en cada pantalla.',
        },
        {
          title: 'Rediseño y evolución',
          tag: 'MEJORA / CONTINUIDAD',
          description:
            'Convertimos una web que se quedó atrás en una herramienta actual. Mejor diseño, mejor navegación y espacio para crecer.',
        },
      ],
      surface: 'DISEÑO CON INTENCIÓN',
      surfaceText:
        'La parte visible: claridad, personalidad y una experiencia que invita a seguir.',
      system: 'DESARROLLO CON CRITERIO',
      systemText: 'La parte que lo sostiene: estructura, rendimiento y código fácil de mantener.',
    },
    about: {
      label: 'El estudio',
      lines: ['Una buena web', 'empieza por', 'entenderte.'],
      intro:
        'Somos ATS Web Studio. Diseñamos y desarrollamos experiencias digitales para negocios con algo propio que contar.',
      description:
        'Trabajamos contigo desde la primera conversación hasta la puesta en marcha. Preguntamos, proponemos y cuidamos los detalles para que el resultado tenga sentido para tu marca y para quienes la visitan.',
      values: [
        { title: 'Primero, escuchar.', text: 'Tu negocio, tus clientes y el objetivo de la web.' },
        {
          title: 'Después, dar forma.',
          text: 'Estructura, diseño y contenido con una dirección clara.',
        },
        {
          title: 'Por último, construir.',
          text: 'Desarrollo, revisión y lanzamiento. Todo conectado.',
        },
      ],
      signature: 'DISEÑO CUIDADO. CÓDIGO CON PROPÓSITO.',
    },
    contact: {
      label: 'Tu próximo proyecto',
      lines: ['Tienes una idea.', 'Hagamos que', 'funcione.'],
      description:
        'Cuéntanos qué estás construyendo y adónde quieres llegar. Empezamos con una conversación.',
      email: 'Escríbenos',
      whatsapp: 'Hablemos por WhatsApp',
      start: 'Cuéntanos tu idea',
      formTitle: 'Empecemos por tu idea.',
      formIntro: 'Completa estos datos y prepara un mensaje para enviárnoslo por WhatsApp.',
      name: 'Tu nombre',
      emailLabel: 'Tu correo',
      service: '¿Qué necesitas?',
      serviceOptions: [
        'Una nueva web',
        'Rediseñar mi sitio',
        'Un catálogo digital',
        'Mejorar SEO y rendimiento',
        'Quiero orientación',
      ],
      message: 'Cuéntanos un poco del proyecto',
      messagePlaceholder: 'Tu negocio, la idea y qué te gustaría conseguir…',
      submit: 'Continuar en WhatsApp',
      note: 'El mensaje se abrirá en WhatsApp para que puedas revisarlo y enviarlo.',
      fallback: 'También puedes escribirnos por correo.',
      privacyPrefix: 'Al continuar, confirmas que has leído la',
      privacyLink: 'Política de privacidad',
      subject: 'Un nuevo proyecto para ATS',
    },
    footer: {
      top: 'Volver arriba',
      rights: 'Diseño y desarrollo web.',
      location: 'ZAMORA, ECUADOR · DISPONIBLES PARA PROYECTOS',
      sectionsLabel: 'Secciones del sitio',
      legalLabel: 'Información legal',
      privacy: 'Privacidad',
      terms: 'Términos',
      refunds: 'Cancelaciones y reembolsos',
    },
    notFound: {
      kicker: 'Error 404 / Página no encontrada',
      title: 'Esta página tomó otro camino.',
      description:
        'La dirección que buscas ya no existe o cambió de lugar. Puedes volver al inicio o seguir explorando nuestro trabajo.',
      home: 'Volver al inicio',
      projects: 'Ver proyectos',
      contact: 'Cuéntanos tu idea',
    },
  },
  en: {
    title: 'Web Design in Zamora, Ecuador | ATS Web Studio',
    description:
      'Web design and development studio in Zamora, Ecuador. Custom websites, digital catalogs, redesign and technical SEO for businesses in Ecuador.',
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    navigation: 'Main navigation',
    switchLanguage: 'Cambiar a español',
    languageName: 'Language',
    sections: ['Vision', 'Work', 'Services', 'Studio', 'Contact'],
    cues: ['The starting point', 'Selected work', 'What we do', 'How we think', 'Your next move'],
    hero: {
      label: 'Vision',
      lines: ['Design and code —', 'from your first idea', 'to your next', 'big move.'],
      description:
        'An independent studio in Zamora, Ecuador, connecting design, technology and strategy to build the website your business needs.',
      location: 'FROM ZAMORA, ECUADOR, TO THE WORLD',
      cta: 'Let’s talk',
      scroll: 'Explore the work',
      motion: 'Enable motion',
      motionActive: 'Motion active · pause',
      motionWaiting: 'Connecting motion…',
      motionRetry: 'Retry motion',
      motionHint: 'Tilt your phone from side to side or swipe across the line.',
      motionUnavailable:
        'No motion received. Check your browser’s sensor permission or swipe across the line.',
      motionSecure: 'Open the site over HTTPS to enable motion or swipe across the line.',
    },
    work: {
      label: 'Selected work',
      lines: ['Real projects.', 'Ideas in motion.'],
      description:
        'Brands, experiences and businesses. Each project, a different way to put the web to work for you.',
      active: 'IN FOCUS',
      open: 'Explore project',
      visit: 'Visit website',
      category: 'PROJECT TYPE',
      scope: 'SCOPE',
      featured: 'IN THE SPOTLIGHT',
      collection: 'Selected projects',
    },
    services: {
      label: 'Services / Process',
      lines: ['How it looks matters.', 'How it works does, too.'],
      description:
        'We consider the entire experience: from the first impression to the next click.',
      items: [
        {
          title: 'Web design',
          tag: 'DIRECTION / IDENTITY',
          description:
            'A presence of your own. Hierarchy, typography and detail that make your brand clear and memorable.',
        },
        {
          title: 'Custom development',
          tag: 'CODE / EXPERIENCE',
          description:
            'Fast, responsive websites built around your business. Without templates that limit your ideas.',
        },
        {
          title: 'SEO & performance',
          tag: 'STRUCTURE / SPEED',
          description:
            'A technical foundation built for search: clear content, efficient loading and a considered experience on every screen.',
        },
        {
          title: 'Redesign & evolution',
          tag: 'IMPROVEMENT / CONTINUITY',
          description:
            'We turn an outdated website into a useful tool. Better design, clearer navigation and room to grow.',
        },
      ],
      surface: 'INTENTIONAL DESIGN',
      surfaceText:
        'What people see: clarity, character and an experience that invites exploration.',
      system: 'THOUGHTFUL DEVELOPMENT',
      systemText: 'What supports it: structure, performance and code that is easy to maintain.',
    },
    about: {
      label: 'The studio',
      lines: ['A better website', 'starts with', 'understanding you.'],
      intro:
        'We’re ATS Web Studio. We design and develop digital experiences for businesses with their own story to tell.',
      description:
        'We work with you from the first conversation to launch. We ask questions, share ideas and care for the details so the result makes sense for your brand and the people who visit it.',
      values: [
        {
          title: 'First, listen.',
          text: 'Your business, your customers and what the website needs to do.',
        },
        {
          title: 'Then, give it shape.',
          text: 'Structure, design and content with a clear direction.',
        },
        { title: 'Finally, build.', text: 'Development, review and launch. Everything connected.' },
      ],
      signature: 'CONSIDERED DESIGN. PURPOSEFUL CODE.',
    },
    contact: {
      label: 'Your next project',
      lines: ['You have an idea.', 'Let’s make', 'it work.'],
      description:
        'Tell us what you’re building and where you want to go. It starts with a conversation.',
      email: 'Write to us',
      whatsapp: 'Let’s talk on WhatsApp',
      start: 'Tell us your idea',
      formTitle: 'Start with your idea.',
      formIntro: 'Fill in these details to prepare a message you can send to us on WhatsApp.',
      name: 'Your name',
      emailLabel: 'Your email',
      service: 'What do you need?',
      serviceOptions: [
        'A new website',
        'A website redesign',
        'A digital catalog',
        'Better SEO and performance',
        'Some guidance',
      ],
      message: 'Tell us about the project',
      messagePlaceholder: 'Your business, your idea and what you want to achieve…',
      submit: 'Continue on WhatsApp',
      note: 'Your message will open in WhatsApp for you to review and send.',
      fallback: 'You can also reach us by email.',
      privacyPrefix: 'By continuing, you confirm that you have read the',
      privacyLink: 'Privacy Policy',
      subject: 'A new project for ATS',
    },
    footer: {
      top: 'Back to top',
      rights: 'Web design & development.',
      location: 'ZAMORA, ECUADOR · OPEN FOR PROJECTS',
      sectionsLabel: 'Site sections',
      legalLabel: 'Legal information',
      privacy: 'Privacy',
      terms: 'Terms',
      refunds: 'Cancellations & refunds',
    },
    notFound: {
      kicker: 'Error 404 / Page not found',
      title: 'This page took another route.',
      description:
        'The address you are looking for no longer exists or has moved. You can return home or keep exploring our work.',
      home: 'Back to the homepage',
      projects: 'View projects',
      contact: 'Tell us your idea',
    },
  },
} as const;

export function getUI(lang: Language) {
  return ui[lang];
}
