import gsap from 'gsap';

// Desktop only. Called inside matchMedia so listeners and tweens share its lifecycle.
export function initHeroReveal() {
  const shell = document.querySelector<HTMLElement>('.site-shell');
  const header = shell?.querySelector<HTMLElement>(':scope > .site-header');
  const hero = shell?.querySelector<HTMLElement>(':scope > main > .hero');
  const work = shell?.querySelector<HTMLElement>('.work-chapter');
  if (!shell || !header || !hero || !work) return;

  const axis = parseFloat(getComputedStyle(shell).getPropertyValue('--axis')) || 61.2;
  const reveal = { position: axis, halfWidth: 0.5 };
  const transition = { progress: 0 };
  const trackedElements = [header, hero];
  let idleTimeout: number | undefined;

  const render = () => {
    const width = Math.max(1, shell.clientWidth);
    const halfWidthPercent = (reveal.halfWidth / width) * 100;
    const revealLeft = Math.max(0, reveal.position - halfWidthPercent);
    const revealRight = Math.max(0, 100 - reveal.position - halfWidthPercent);
    const progress = gsap.utils.clamp(0, 1, transition.progress);

    shell.style.setProperty('--hero-reveal-position', `${reveal.position}%`);
    shell.style.setProperty('--hero-reveal-half-width', `${reveal.halfWidth}px`);
    shell.style.setProperty('--hero-reveal-left', `${revealLeft * (1 - progress)}%`);
    shell.style.setProperty('--hero-reveal-right', `${revealRight * (1 - progress)}%`);
    shell.style.setProperty('--hero-reveal-progress', String(progress));
  };

  const move = gsap.quickTo(reveal, 'position', {
    duration: 0.45,
    ease: 'power3.out',
    onUpdate: render,
  });
  const widen = gsap.quickTo(reveal, 'halfWidth', {
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: render,
  });
  const trackPointer = (event: PointerEvent) => {
    if (
      event.pointerType === 'touch' ||
      document.documentElement.dataset.overlay ||
      transition.progress > 0.01
    )
      return;

    const bounds = hero.getBoundingClientRect();
    move(gsap.utils.clamp(0, 100, ((event.clientX - bounds.left) / bounds.width) * 100));
    widen(gsap.utils.clamp(34, 64, hero.clientWidth * 0.039));
    window.clearTimeout(idleTimeout);
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
  trackedElements.forEach((element) => element.addEventListener('pointermove', trackPointer));

  return () => {
    trackedElements.forEach((element) => element.removeEventListener('pointermove', trackPointer));
    move.tween.kill();
    widen.tween.kill();
    window.clearTimeout(idleTimeout);
    expansion.scrollTrigger?.kill();
    expansion.kill();
    delete shell.dataset.heroRevealEnabled;
    for (const property of ['position', 'half-width', 'left', 'right', 'progress']) {
      shell.style.removeProperty(`--hero-reveal-${property}`);
    }
  };
}
