import gsap from 'gsap';

// Called inside matchMedia so pointer tracking and tweens share its lifecycle.
export function initHeroReveal() {
  const shell = document.querySelector<HTMLElement>('.site-shell');
  const header = shell?.querySelector<HTMLElement>(':scope > .site-header');
  const hero = shell?.querySelector<HTMLElement>(':scope > main > .hero');
  const work = shell?.querySelector<HTMLElement>('.work-chapter');
  if (!shell || !header || !hero || !work) return;

  const axis = parseFloat(getComputedStyle(shell).getPropertyValue('--axis'));
  const pointer = { position: axis, halfWidth: 0.5 };
  const transition = { progress: 0 };
  let idleTimeout: number | undefined;
  const render = () => {
    const width = Math.max(1, shell.clientWidth);
    const halfWidthPercent = (pointer.halfWidth / width) * 100;
    const pointerLeft = Math.max(0, pointer.position - halfWidthPercent);
    const pointerRight = Math.max(0, 100 - pointer.position - halfWidthPercent);
    const progress = gsap.utils.clamp(0, 1, transition.progress);

    // Both edges reach the viewport at the same scroll progress. This turns the
    // mouse-following line into the orange projects chapter without a visual cut.
    shell.style.setProperty('--hero-reveal-position', `${pointer.position}%`);
    shell.style.setProperty('--hero-reveal-half-width', `${pointer.halfWidth}px`);
    shell.style.setProperty('--hero-reveal-left', `${pointerLeft * (1 - progress)}%`);
    shell.style.setProperty('--hero-reveal-right', `${pointerRight * (1 - progress)}%`);
    shell.style.setProperty('--hero-reveal-progress', String(progress));
  };
  const move = gsap.quickTo(pointer, 'position', {
    duration: 0.45,
    ease: 'power3.out',
    onUpdate: render,
  });
  const widen = gsap.quickTo(pointer, 'halfWidth', {
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: render,
  });
  const track = (event: PointerEvent) => {
    if (
      event.pointerType === 'touch' ||
      document.documentElement.dataset.overlay ||
      transition.progress > 0.01
    )
      return;
    const bounds = hero.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    move(Math.max(0, Math.min(100, position)));
    widen(Math.max(34, Math.min(64, bounds.width * 0.039)));
    if (idleTimeout) window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => widen(0.5), 900);
  };
  const expansion = gsap.to(transition, {
    progress: 1,
    ease: 'none',
    onUpdate: render,
    scrollTrigger: {
      trigger: work,
      start: 'top bottom',
      end: 'top 12%',
      scrub: 0.42,
      invalidateOnRefresh: true,
    },
  });

  render();
  shell.dataset.heroRevealEnabled = 'true';
  [header, hero].forEach((element) => {
    element.addEventListener('pointermove', track);
  });

  return () => {
    [header, hero].forEach((element) => {
      element.removeEventListener('pointermove', track);
    });
    move.tween.kill();
    widen.tween.kill();
    if (idleTimeout) window.clearTimeout(idleTimeout);
    expansion.scrollTrigger?.kill();
    expansion.kill();
    delete shell.dataset.heroRevealEnabled;
    shell.style.removeProperty('--hero-reveal-position');
    shell.style.removeProperty('--hero-reveal-half-width');
    shell.style.removeProperty('--hero-reveal-left');
    shell.style.removeProperty('--hero-reveal-right');
    shell.style.removeProperty('--hero-reveal-progress');
  };
}
