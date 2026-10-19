import billonchok from '@/assets/projects/billonchok.png';
import glamping from '@/assets/projects/glamping-look.png';
import decorteja from '@/assets/projects/decorteja.png';
import vital from '@/assets/projects/vital-health.png';
import vallicoffee from '@/assets/projects/vallicoffee.webp';
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
    id: 'decorteja',
    name: 'Decorteja',
    image: decorteja,
    url: null,
    es: {
      category: 'ARQUITECTURA / PRODUCTO',
      scope: 'Diseño web · Catálogo',
      description:
        'Una propuesta digital para explorar tejas, pisos y acabados. El producto y sus aplicaciones, al centro de la experiencia.',
    },
    en: {
      category: 'ARCHITECTURE / PRODUCT',
      scope: 'Web design · Catalog',
      description:
        'A digital design for exploring roof tiles, flooring and finishes. Products and their applications at the center of the experience.',
    },
  },
  {
    id: 'vital-health',
    name: 'Vital Health MC',
    image: vital,
    url: null,
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
    id: 'vallicoffee',
    name: 'Vallicoffee',
    image: vallicoffee,
    url: null,
    es: {
      category: 'CAFÉ / EXPERIENCIA DE MARCA',
      scope: 'Diseño · Landing page',
      description:
        'El carácter de una marca de café, llevado a la web. Una landing centrada en el producto y su identidad.',
    },
    en: {
      category: 'COFFEE / BRAND EXPERIENCE',
      scope: 'Design · Landing page',
      description:
        'The character of a coffee brand, translated to the web. A landing page centered on the product and its identity.',
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
