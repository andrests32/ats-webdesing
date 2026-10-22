import gsap from 'gsap';

function getRevealElements(section: HTMLElement) {
  const label = section.querySelector<HTMLElement>('.section-label');
  return [
    ...(label ? [label] : []),
    ...section.querySelectorAll<HTMLElement>('[data-scroll-reveal]'),
  ];
}

// Created inside matchMedia; changing viewport or motion preference reverts the styles.
export function initSectionReveals(compact: boolean) {
  document.querySelectorAll<HTMLElement>('[data-scroll-scene]').forEach((section) => {
    const elements = getRevealElements(section);
    const mirror =
      section.id === 'proyectos'
        ? document.querySelector<HTMLElement>('.work-chapter-reveal')
        : null;
    const mirrorElements = mirror ? getRevealElements(mirror) : [];

    elements.forEach((element, index) => {
      const direction = element.dataset.scrollReveal || 'left';
      const distance = compact ? 28 : 72;
      const horizontal = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
      const vertical = direction === 'up' ? (compact ? 36 : 68) : compact ? 18 : 32;
      const targets = mirrorElements[index] ? [element, mirrorElements[index]] : [element];

      // Both project layers share one tween and one trigger so text stays aligned.
      gsap.fromTo(
        targets,
        { x: horizontal, y: vertical, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'clamp(top 96%)',
            end: compact ? 'clamp(top 78%)' : 'clamp(top 68%)',
            scrub: compact ? 0.3 : 0.55,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  });
}
