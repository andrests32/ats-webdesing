import billonchok from '@/assets/projects/billonchok.png';
import glamping from '@/assets/projects/glamping-look.png';
import luxen from '@/assets/projects/inmobiliaria-luxen.png';
import vital from '@/assets/projects/vital-health.png';
import castilloReal from '@/assets/projects/hosteria-castillo-real.png';
import type { Language } from '@/i18n/ui';

// Display order is intentional. Change this array to reorder the portfolio.
// Archived designs have no live link; the original screenshots remain viewable.
const projects = [
  {
    id: 'billonchok',
    name: 'Billonchok',
    image: billonchok,
    url: 'https://www.billonchok.com/es/',
    enUrl: 'https://www.billonchok.com/en/',
    es: {
      category: 'MARCA / CATÁLOGO DIGITAL',
      scope: 'Diseño · Desarrollo · Multidioma',
      description:
        'El chocolate de la Amazonía ecuatoriana, en una experiencia de marca con catálogo digital y pedidos por WhatsApp.',
    },
    en: {
      category: 'BRAND / DIGITAL CATALOG',
      scope: 'Design · Development · Multilingual',
      description:
        'Ecuadorian Amazon chocolate, brought to life through a brand experience with a digital catalog and WhatsApp ordering.',
    },
  },
  {
    id: 'glamping-look',
    name: 'Glamping Look',
    image: glamping,
    url: 'https://www.glampinglook.com/',
    es: {
      category: 'TURISMO / HOSPEDAJE',
      scope: 'Diseño · Desarrollo web',
      description:
        'Una ventana a la naturaleza. Una web de alojamiento y experiencias que invita a descubrir un destino diferente.',
    },
    en: {
      category: 'TRAVEL / HOSPITALITY',
      scope: 'Design · Web development',
      description:
        'A window into nature. A website for stays and experiences that invites visitors to discover a different destination.',
    },
  },
  {
    id: 'inmobiliaria-luxen',
    name: 'Inmobiliaria Luxen',
    image: luxen,
    url: 'https://realstate-liart.vercel.app/',
    es: {
      category: 'INMOBILIARIA / CATÁLOGO',
      scope: 'Diseño · Desarrollo web',
      description:
        'Una experiencia inmobiliaria para descubrir propiedades, filtrar oportunidades y conectar con asesoría especializada en Ecuador.',
    },
    en: {
      category: 'REAL ESTATE / CATALOG',
      scope: 'Design · Web development',
      description:
        'A real estate experience for discovering properties, filtering opportunities and connecting with expert guidance in Ecuador.',
    },
  },
  {
    id: 'vital-health',
    name: 'Vital Health MC',
    image: vital,
    url: 'https://vital-health-iota.vercel.app/',
    es: {
      category: 'BIENESTAR / PRODUCTO',
      scope: 'Diseño · Desarrollo web',
      description:
        'Una presentación clara y cercana de productos de bienestar, con navegación enfocada en descubrir la marca y su oferta.',
    },
    en: {
      category: 'WELLNESS / PRODUCT',
      scope: 'Design · Web development',
      description:
        'An approachable presentation of wellness products, with navigation focused on discovering the brand and its range.',
    },
  },
  {
    id: 'hosteria-castillo-real',
    name: 'Hostería Castillo Real',
    image: castilloReal,
    url: 'https://hosteriacastilloreal.vercel.app/',
    es: {
      category: 'TURISMO / HOSPEDAJE',
      scope: 'Diseño · Desarrollo web',
      description:
        'Una experiencia digital para presentar habitaciones, gastronomía y eventos en un entorno natural, con acceso directo a reservas.',
    },
    en: {
      category: 'TRAVEL / HOSPITALITY',
      scope: 'Design · Web development',
      description:
        'A digital experience showcasing rooms, dining and events in a natural setting, with direct access to reservations.',
    },
  },
] as const;

export function getProjects(lang: Language) {
  return projects.map((p, index) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    url: lang === 'en' && 'enUrl' in p ? p.enUrl : p.url,
    number: String(index + 1).padStart(2, '0'),
    ...p[lang],
  }));
}
