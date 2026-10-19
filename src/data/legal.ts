import type { Language } from '@/i18n/ui';

export const legalKeys = ['privacy', 'terms', 'refunds'] as const;
export type LegalKey = (typeof legalKeys)[number];

export const legalSlugs: Record<Language, Record<LegalKey, string>> = {
  es: {
    privacy: 'privacidad',
    terms: 'terminos',
    refunds: 'cancelaciones-y-reembolsos',
  },
  en: {
    privacy: 'privacy',
    terms: 'terms',
    refunds: 'cancellations-and-refunds',
  },
};

export function getLegalHref(lang: Language, key: LegalKey) {
  return `/${lang}/legal/${legalSlugs[lang][key]}/`;
}

interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalSource {
  label: string;
  href: string;
}

export interface LegalDocument {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  sources: LegalSource[];
}

export const legalDocuments: Record<Language, Record<LegalKey, LegalDocument>> = {
  es: {
    privacy: {
      eyebrow: 'Privacidad / Datos personales',
      title: 'Política de privacidad',
      description:
        'Cómo ATS Web Studio, con sede en Zamora, Ecuador, recopila, utiliza y protege los datos personales de quienes nos contactan.',
      intro:
        'Esta política explica de forma clara qué información puede tratar ATS Web Studio cuando visitas este sitio o nos escribes. Aplicamos la Ley Orgánica de Protección de Datos Personales de Ecuador y su normativa relacionada.',
      updated: 'Última actualización: 18 de octubre de 2026',
      sections: [
        {
          title: '1. Responsable del tratamiento',
          paragraphs: [
            'ATS Web Studio es responsable del tratamiento descrito en esta política. Nuestra ubicación es Zamora, Zamora Chinchipe, Ecuador. Para consultas o para ejercer tus derechos puedes escribir a atsagency@gmail.com.',
          ],
        },
        {
          title: '2. Datos que podemos tratar',
          bullets: [
            'Datos de contacto y consulta: nombre, correo electrónico, número de WhatsApp, servicio de interés y contenido de tu mensaje.',
            'Información del proyecto que decidas compartir, como objetivos, materiales, accesos o datos de facturación.',
            'Datos técnicos básicos que el proveedor de alojamiento pueda registrar para seguridad y funcionamiento, como dirección IP, fecha, navegador y solicitudes al servidor.',
          ],
          paragraphs: [
            'El formulario de este sitio no guarda ni envía información a una base de datos de ATS. Prepara un mensaje y abre WhatsApp para que puedas revisarlo; los datos solo se comunican cuando tú decides enviarlo. También puedes contactarnos mediante correo electrónico.',
          ],
        },
        {
          title: '3. Finalidades y bases de tratamiento',
          bullets: [
            'Responder consultas y preparar una propuesta o presupuesto solicitado por ti.',
            'Gestionar la relación contractual, ejecutar el proyecto, brindar soporte y mantener comunicaciones necesarias.',
            'Cumplir obligaciones contables, tributarias, contractuales y legales.',
            'Proteger el sitio, prevenir abusos y resolver incidentes técnicos.',
          ],
          paragraphs: [
            'El tratamiento se sustenta, según corresponda, en tu solicitud o consentimiento, en medidas precontractuales, en la ejecución de un contrato, en obligaciones legales o en un interés legítimo evaluado conforme a la normativa. No usamos tus datos para publicidad de terceros ni vendemos bases de datos.',
          ],
        },
        {
          title: '4. Cookies y analítica',
          paragraphs: [
            'Actualmente este sitio no instala cookies publicitarias, no utiliza herramientas de analítica y no crea perfiles de navegación. Si esto cambia, actualizaremos esta política y solicitaremos el consentimiento que corresponda antes de activar tecnologías no esenciales.',
          ],
        },
        {
          title: '5. Proveedores y transferencias',
          paragraphs: [
            'Podemos utilizar proveedores de alojamiento, correo y mensajería únicamente para operar el sitio y atender tu solicitud. Si eliges WhatsApp o correo, el servicio correspondiente tratará la información bajo sus propias condiciones y puede procesarla fuera de Ecuador. Exigiremos medidas razonables de confidencialidad y protección cuando un proveedor trate datos por nuestra cuenta.',
          ],
        },
        {
          title: '6. Conservación',
          paragraphs: [
            'Conservamos las consultas solo durante el tiempo necesario para responder y dar seguimiento razonable. Los datos de clientes y proyectos se mantienen durante la relación contractual y después durante los plazos exigidos por obligaciones legales, contables o para atender posibles reclamaciones. Cuando ya no sean necesarios, se eliminan, anonimizan o bloquean según corresponda.',
          ],
        },
        {
          title: '7. Tus derechos',
          paragraphs: [
            'Puedes solicitar acceso, rectificación y actualización, eliminación, oposición, portabilidad o suspensión del tratamiento cuando corresponda. Escribe a atsagency@gmail.com indicando tu solicitud y la información necesaria para verificar tu identidad. También puedes presentar una consulta o reclamación ante la Superintendencia de Protección de Datos Personales de Ecuador.',
          ],
        },
        {
          title: '8. Seguridad, menores y cambios',
          paragraphs: [
            'Aplicamos medidas razonables para evitar acceso, pérdida, alteración o divulgación no autorizada. Nuestros servicios se dirigen a negocios y personas con capacidad para contratar; no recopilamos intencionalmente datos de niñas, niños o adolescentes. Publicaremos cualquier cambio relevante en esta página con su fecha de actualización.',
          ],
        },
      ],
      sources: [
        {
          label: 'Superintendencia de Protección de Datos Personales — derechos de los titulares',
          href: 'https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/cuales-son-mis-derechos/',
        },
        {
          label: 'Ley Orgánica de Protección de Datos Personales',
          href: 'https://spdp.gob.ec/wp-content/uploads/2024/12/03.pdf.pdf',
        },
      ],
    },
    terms: {
      eyebrow: 'Condiciones / Servicios',
      title: 'Términos y condiciones',
      description:
        'Condiciones generales para contratar servicios de diseño y desarrollo web con ATS Web Studio en Zamora, Ecuador.',
      intro:
        'Estos términos regulan el uso del sitio y sirven como marco general para nuestros servicios. Cada proyecto se define en una propuesta o contrato aceptado por las partes; ese documento prevalece en sus condiciones específicas.',
      updated: 'Última actualización: 18 de octubre de 2026',
      sections: [
        {
          title: '1. Identificación y alcance',
          paragraphs: [
            'ATS Web Studio presta servicios de diseño, desarrollo web, rediseño, catálogos digitales, SEO técnico y soporte desde Zamora, Ecuador. El contenido del sitio es informativo y no constituye por sí solo una oferta contractual ni garantiza disponibilidad, precio o plazo.',
          ],
        },
        {
          title: '2. Propuesta y contratación',
          paragraphs: [
            'Antes de comenzar, la propuesta debe indicar alcance, entregables, exclusiones, precio, calendario, forma de pago, número de revisiones y responsabilidades. El proyecto inicia cuando la propuesta es aceptada, se entrega la información necesaria y se realiza el pago inicial acordado.',
          ],
        },
        {
          title: '3. Responsabilidades del cliente',
          bullets: [
            'Entregar a tiempo textos, imágenes, accesos, decisiones y comentarios necesarios.',
            'Confirmar que tiene derechos o permisos sobre los materiales proporcionados.',
            'Revisar entregables y comunicar correcciones dentro de los plazos acordados.',
            'Mantener copias y credenciales seguras después de la entrega.',
          ],
        },
        {
          title: '4. Cambios, revisiones y plazos',
          paragraphs: [
            'Las solicitudes fuera del alcance se cotizan y programan por separado antes de ejecutarse. Los plazos pueden ajustarse si cambian los requisitos, existen retrasos en aprobaciones o dependen de terceros. Informaremos cualquier impacto material en tiempo o costo.',
          ],
        },
        {
          title: '5. Pagos, impuestos y terceros',
          paragraphs: [
            'Los precios, anticipos, hitos e impuestos aplicables constan en la propuesta. Dominios, alojamiento, licencias, pasarelas, tipografías u otros servicios de terceros se identifican cuando correspondan y pueden tener condiciones y renovaciones propias. No realizamos cargos no informados.',
          ],
        },
        {
          title: '6. Propiedad intelectual',
          paragraphs: [
            'Tras el pago completo, el cliente recibe los derechos o licencias sobre los entregables finales en la medida indicada en la propuesta. ATS conserva la titularidad de herramientas, métodos, componentes preexistentes y conocimiento reutilizable. El software y los recursos de terceros mantienen sus licencias originales. Ninguna parte puede usar materiales de la otra fuera de lo autorizado.',
          ],
        },
        {
          title: '7. Entrega, soporte y garantía',
          paragraphs: [
            'La entrega se considera aceptada conforme al procedimiento definido en la propuesta. Corregiremos sin costo errores reproducibles que contradigan el alcance aceptado durante el periodo de garantía acordado. Nuevas funciones, cambios de contenido, fallas de servicios externos o modificaciones realizadas por terceros se cotizan por separado.',
          ],
        },
        {
          title: '8. Disponibilidad y responsabilidad',
          paragraphs: [
            'Trabajamos con cuidado profesional, pero no garantizamos posiciones concretas en buscadores, ventas, tráfico ininterrumpido ni el funcionamiento permanente de plataformas ajenas. Nada en estos términos limita derechos irrenunciables del consumidor ni responsabilidades que la ley ecuatoriana no permita excluir.',
          ],
        },
        {
          title: '9. Terminación y solución de desacuerdos',
          paragraphs: [
            'Cualquiera de las partes puede terminar el proyecto por escrito conforme a la propuesta y a la Política de cancelaciones y reembolsos. Procuraremos resolver cualquier diferencia mediante comunicación directa y, de ser útil, mediación. Se aplican las leyes de Ecuador y se respetan las autoridades y competencias previstas por la normativa de consumo.',
          ],
        },
      ],
      sources: [
        {
          label: 'Ley Orgánica de Defensa del Consumidor — Ministerio de Producción',
          href: 'https://www.produccion.gob.ec/wp-content/uploads/2025/03/LEY-ORGANICA-DE-DEFENSA-DEL-CONSUMIDOR_2022_02_11.pdf',
        },
        {
          label: 'Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos',
          href: 'https://www.gob.ec/sites/default/files/regulations/2018-10/LEY%20DE%20COMERCIO%20ELECTRONICO%2C%20FIRMAS%20Y%20MENSAJES%20DE%20DATOS.pdf',
        },
      ],
    },
    refunds: {
      eyebrow: 'Proyectos / Pagos',
      title: 'Cancelaciones y reembolsos',
      description:
        'Cómo ATS Web Studio calcula cancelaciones y reembolsos de proyectos de diseño y desarrollo web.',
      intro:
        'Buscamos que una cancelación sea clara y proporcional. El cliente paga el trabajo efectivamente realizado y los costos autorizados; cualquier saldo no devengado se devuelve conforme a esta política, la propuesta aceptada y la ley ecuatoriana.',
      updated: 'Última actualización: 18 de octubre de 2026',
      sections: [
        {
          title: '1. Cómo solicitar una cancelación',
          paragraphs: [
            'Envía una solicitud por escrito a atsagency@gmail.com o al WhatsApp oficial, identificando el proyecto. Confirmaremos la fecha efectiva, detendremos el trabajo que razonablemente pueda detenerse y prepararemos un cierre con los avances y valores aplicables.',
          ],
        },
        {
          title: '2. Antes de iniciar el trabajo',
          paragraphs: [
            'Si cancelas antes de que comience el trabajo, devolveremos el saldo pagado, descontando únicamente costos de terceros que hayas autorizado y que ya no puedan recuperarse. Cualquier derecho legal de devolución o suspensión aplicable se respeta por encima de esta política.',
          ],
        },
        {
          title: '3. Después de iniciar el trabajo',
          paragraphs: [
            'El saldo se calcula restando de los pagos recibidos: (a) las horas efectivamente trabajadas a la tarifa indicada en la propuesta; o, si el proyecto se cotizó por hitos, el valor proporcional de los hitos ejecutados; y (b) los costos de terceros previamente autorizados y no recuperables. No se descuentan horas e hitos dos veces por el mismo trabajo.',
            'No aplicamos automáticamente una penalidad fija del 35 %. Si una propuesta incluye una reserva inicial o condición especial, deberá estar explicada, ser proporcional, aceptarse antes del pago y respetar los derechos previstos en la ley.',
          ],
        },
        {
          title: '4. Cierre y soporte del cálculo',
          paragraphs: [
            'Entregaremos un resumen razonable de horas o hitos completados, entregables disponibles y costos externos. Si el valor del trabajo y los costos autorizados iguala o supera los pagos recibidos, no existe saldo para reembolsar y cualquier valor pendiente se manejará según la propuesta y la ley.',
          ],
        },
        {
          title: '5. Forma y plazo del reembolso',
          paragraphs: [
            'Una vez acordado el cierre y recibidos los datos necesarios, procesaremos el saldo por el medio disponible que acuerden las partes. El tiempo de acreditación depende del banco o proveedor de pago. Informaremos por escrito el valor y el comprobante correspondiente.',
          ],
        },
        {
          title: '6. Servicios y compras de terceros',
          paragraphs: [
            'Dominios, alojamiento, licencias, publicidad, tipografías, pasarelas u otras compras hechas para el proyecto se rigen también por las políticas del proveedor. Solo descontaremos costos previamente informados y efectivamente incurridos. Cuando sea posible transferir una cuenta o licencia al cliente, coordinaremos esa entrega.',
          ],
        },
        {
          title: '7. Derechos del consumidor y desacuerdos',
          paragraphs: [
            'Esta política no elimina derechos de devolución, suspensión, terminación o reparación reconocidos por la legislación ecuatoriana. Si existe una diferencia sobre el cálculo, revisaremos los respaldos y buscaremos una solución directa o mediante mediación, sin impedir el acceso a la autoridad competente.',
          ],
        },
      ],
      sources: [
        {
          label: 'Ley Orgánica de Defensa del Consumidor — texto oficial publicado por el MPCEIP',
          href: 'https://www.produccion.gob.ec/wp-content/uploads/2025/03/LEY-ORGANICA-DE-DEFENSA-DEL-CONSUMIDOR_2022_02_11.pdf',
        },
      ],
    },
  },
  en: {
    privacy: {
      eyebrow: 'Privacy / Personal data',
      title: 'Privacy Policy',
      description:
        'How ATS Web Studio, based in Zamora, Ecuador, collects, uses and protects the personal data of people who contact us.',
      intro:
        'This policy explains what information ATS Web Studio may process when you visit this website or contact us. We follow Ecuador’s Organic Law on Personal Data Protection and related regulations.',
      updated: 'Last updated: October 18, 2026',
      sections: [
        {
          title: '1. Data controller',
          paragraphs: [
            'ATS Web Studio is responsible for the processing described in this policy. We are located in Zamora, Zamora Chinchipe, Ecuador. To ask a question or exercise your rights, email atsagency@gmail.com.',
          ],
        },
        {
          title: '2. Data we may process',
          bullets: [
            'Contact and inquiry data: name, email address, WhatsApp number, service of interest and message content.',
            'Project information you choose to share, including goals, materials, access credentials or billing details.',
            'Basic technical data that the hosting provider may log for security and operation, such as IP address, date, browser and server requests.',
          ],
          paragraphs: [
            'The form on this website does not save or submit information to an ATS database. It prepares a message and opens WhatsApp for your review; data is communicated only when you choose to send it. You may also contact us by email.',
          ],
        },
        {
          title: '3. Purposes and legal grounds',
          bullets: [
            'Reply to inquiries and prepare a proposal or estimate you requested.',
            'Manage the contractual relationship, deliver the project, provide support and send necessary communications.',
            'Meet accounting, tax, contractual and legal obligations.',
            'Protect the website, prevent abuse and resolve technical incidents.',
          ],
          paragraphs: [
            'Depending on the context, processing is based on your request or consent, pre-contractual steps, performance of a contract, legal obligations or a legitimate interest assessed under applicable rules. We do not sell personal data or use it for third-party advertising.',
          ],
        },
        {
          title: '4. Cookies and analytics',
          paragraphs: [
            'This website currently uses no advertising cookies, analytics tools or browsing profiles. If that changes, we will update this policy and request any consent required before enabling non-essential technologies.',
          ],
        },
        {
          title: '5. Providers and transfers',
          paragraphs: [
            'We may use hosting, email and messaging providers only to operate the website and handle your request. If you choose WhatsApp or email, that provider processes information under its own terms and may process it outside Ecuador. We require reasonable confidentiality and protection measures when a provider processes data on our behalf.',
          ],
        },
        {
          title: '6. Retention',
          paragraphs: [
            'We keep inquiries only as long as needed to reply and provide reasonable follow-up. Client and project data is kept throughout the contractual relationship and then for periods required by legal or accounting duties or to address potential claims. Data is deleted, anonymized or restricted when no longer needed.',
          ],
        },
        {
          title: '7. Your rights',
          paragraphs: [
            'Where applicable, you may request access, correction and updating, deletion, objection, portability or restriction of processing. Email atsagency@gmail.com with your request and the information needed to verify your identity. You may also contact Ecuador’s Superintendence of Personal Data Protection.',
          ],
        },
        {
          title: '8. Security, children and updates',
          paragraphs: [
            'We use reasonable safeguards against unauthorized access, loss, alteration or disclosure. Our services are intended for businesses and people able to enter a contract; we do not intentionally collect children’s personal data. Material changes will be posted on this page with a new update date.',
          ],
        },
      ],
      sources: [
        {
          label: 'Ecuadorian Data Protection Authority — individual rights',
          href: 'https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/cuales-son-mis-derechos/',
        },
        {
          label: 'Organic Law on Personal Data Protection',
          href: 'https://spdp.gob.ec/wp-content/uploads/2024/12/03.pdf.pdf',
        },
      ],
    },
    terms: {
      eyebrow: 'Conditions / Services',
      title: 'Terms and Conditions',
      description:
        'General terms for web design and development services provided by ATS Web Studio in Zamora, Ecuador.',
      intro:
        'These terms govern use of this website and provide a general framework for our services. Each project is defined in a proposal or contract accepted by both parties, and that document controls its specific terms.',
      updated: 'Last updated: October 18, 2026',
      sections: [
        {
          title: '1. Identity and scope',
          paragraphs: [
            'ATS Web Studio provides web design, development, redesign, digital catalog, technical SEO and support services from Zamora, Ecuador. Website content is informational and does not by itself constitute a contractual offer or guarantee availability, pricing or timing.',
          ],
        },
        {
          title: '2. Proposal and engagement',
          paragraphs: [
            'Before work begins, the proposal should state scope, deliverables, exclusions, price, schedule, payment terms, included revisions and each party’s responsibilities. A project starts after the proposal is accepted, required information is delivered and the agreed initial payment is made.',
          ],
        },
        {
          title: '3. Client responsibilities',
          bullets: [
            'Provide content, images, access, decisions and feedback on time.',
            'Confirm ownership or permission to use all supplied materials.',
            'Review deliverables and report corrections within the agreed time.',
            'Keep backups and credentials secure after handover.',
          ],
        },
        {
          title: '4. Changes, revisions and timing',
          paragraphs: [
            'Requests outside the agreed scope are estimated and scheduled separately before work begins. Timing may change when requirements change, approvals are delayed or third parties are involved. We will explain any material impact on schedule or cost.',
          ],
        },
        {
          title: '5. Payments, taxes and third parties',
          paragraphs: [
            'The proposal states prices, deposits, milestones and applicable taxes. Domains, hosting, licenses, payment platforms, fonts and other third-party services are identified where relevant and may have separate renewal terms. We do not make undisclosed charges.',
          ],
        },
        {
          title: '6. Intellectual property',
          paragraphs: [
            'After full payment, the client receives the rights or licenses to final deliverables described in the proposal. ATS retains ownership of pre-existing tools, methods, components and reusable knowledge. Third-party software and assets remain subject to their original licenses. Neither party may use the other’s materials beyond the agreed permission.',
          ],
        },
        {
          title: '7. Delivery, support and warranty',
          paragraphs: [
            'Delivery is accepted through the process stated in the proposal. During the agreed warranty period, we will correct reproducible errors that conflict with the accepted scope at no extra cost. New features, content changes, third-party failures or changes made by others are estimated separately.',
          ],
        },
        {
          title: '8. Availability and liability',
          paragraphs: [
            'We provide services with professional care but do not guarantee search rankings, sales, uninterrupted traffic or permanent operation of third-party platforms. Nothing in these terms restricts mandatory consumer rights or liabilities that Ecuadorian law does not allow a provider to exclude.',
          ],
        },
        {
          title: '9. Termination and disputes',
          paragraphs: [
            'Either party may end a project in writing under the proposal and the Cancellations and Refunds Policy. We will first try to resolve disagreements through direct communication and, where useful, mediation. Ecuadorian law applies, while consumer authorities and legally established jurisdiction remain available.',
          ],
        },
      ],
      sources: [
        {
          label: 'Organic Consumer Protection Law — Ministry of Production',
          href: 'https://www.produccion.gob.ec/wp-content/uploads/2025/03/LEY-ORGANICA-DE-DEFENSA-DEL-CONSUMIDOR_2022_02_11.pdf',
        },
        {
          label: 'Electronic Commerce, Electronic Signatures and Data Messages Law',
          href: 'https://www.gob.ec/sites/default/files/regulations/2018-10/LEY%20DE%20COMERCIO%20ELECTRONICO%2C%20FIRMAS%20Y%20MENSAJES%20DE%20DATOS.pdf',
        },
      ],
    },
    refunds: {
      eyebrow: 'Projects / Payments',
      title: 'Cancellations and Refunds',
      description:
        'How ATS Web Studio calculates project cancellations and refunds for web design and development work.',
      intro:
        'We aim to make cancellations clear and proportionate. The client pays for work actually completed and authorized costs; any unearned balance is refunded under this policy, the accepted proposal and Ecuadorian law.',
      updated: 'Last updated: October 18, 2026',
      sections: [
        {
          title: '1. How to cancel',
          paragraphs: [
            'Send a written request to atsagency@gmail.com or the official WhatsApp number and identify the project. We will confirm the effective date, stop work that can reasonably be stopped and prepare a closeout showing progress and applicable amounts.',
          ],
        },
        {
          title: '2. Before work starts',
          paragraphs: [
            'If you cancel before work begins, we refund the paid balance after deducting only third-party costs you authorized that cannot be recovered. Any statutory right to return, suspend or cancel takes priority over this policy.',
          ],
        },
        {
          title: '3. After work starts',
          paragraphs: [
            'The balance is calculated by subtracting from payments received: (a) hours actually worked at the rate stated in the proposal, or the proportional value of completed milestones for a milestone-based project; and (b) previously authorized, non-recoverable third-party costs. We do not count both hours and milestones for the same work.',
            'We do not automatically charge a fixed 35% cancellation penalty. If a proposal includes a reservation fee or special condition, it must be clearly explained, proportionate, accepted before payment and consistent with applicable consumer rights.',
          ],
        },
        {
          title: '4. Closeout records',
          paragraphs: [
            'We provide a reasonable summary of hours or milestones completed, available deliverables and external costs. If completed work and authorized costs equal or exceed payments received, there is no refundable balance; any outstanding amount is handled under the proposal and applicable law.',
          ],
        },
        {
          title: '5. Refund method and timing',
          paragraphs: [
            'Once the closeout is agreed and we have the required payment details, we process the balance through an available method agreed by both parties. The bank or payment provider determines posting time. We confirm the amount and transaction record in writing.',
          ],
        },
        {
          title: '6. Third-party services and purchases',
          paragraphs: [
            'Domains, hosting, licenses, advertising, fonts, payment platforms and other project purchases may also be governed by the provider’s terms. We deduct only costs that were disclosed and actually incurred. Where an account or license can be transferred, we coordinate handover to the client.',
          ],
        },
        {
          title: '7. Consumer rights and disagreements',
          paragraphs: [
            'This policy does not remove any right to return, suspend, terminate or obtain a remedy under Ecuadorian law. If the calculation is disputed, we will review the records and seek a direct or mediated solution without restricting access to a competent authority.',
          ],
        },
      ],
      sources: [
        {
          label: 'Organic Consumer Protection Law — official text published by MPCEIP',
          href: 'https://www.produccion.gob.ec/wp-content/uploads/2025/03/LEY-ORGANICA-DE-DEFENSA-DEL-CONSUMIDOR_2022_02_11.pdf',
        },
      ],
    },
  },
};
