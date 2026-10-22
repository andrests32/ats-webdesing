import gsap from 'gsap';

type RevealInput = 'pointer' | 'motion';
type MotionPermission = 'granted' | 'denied';
type PermissionedOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<MotionPermission>;
};

function createHeroReveal(input: RevealInput) {
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
  let touching = false;
  let motionEnabled = false;
  let previousMotionPosition: number | undefined;

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
    duration: input === 'motion' ? 0.6 : 0.45,
    ease: 'power3.out',
    onUpdate: render,
  });
  const widen = gsap.quickTo(reveal, 'halfWidth', {
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: render,
  });
  const emphasize = (halfWidth: number) => {
    widen(halfWidth);
    if (idleTimeout) window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => widen(0.5), 900);
  };
  const moveFromClientX = (clientX: number, halfWidth: number) => {
    if (document.documentElement.dataset.overlay || transition.progress > 0.01) return;
    const bounds = hero.getBoundingClientRect();
    const position = ((clientX - bounds.left) / bounds.width) * 100;
    move(gsap.utils.clamp(0, 100, position));
    emphasize(halfWidth);
  };

  const trackPointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    moveFromClientX(event.clientX, gsap.utils.clamp(34, 64, hero.clientWidth * 0.039));
  };
  const startTouch = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return;
    touching = true;
    moveFromClientX(event.clientX, gsap.utils.clamp(20, 34, hero.clientWidth * 0.06));
  };
  const trackTouch = (event: PointerEvent) => {
    if (!touching || event.pointerType !== 'touch') return;
    moveFromClientX(event.clientX, gsap.utils.clamp(20, 34, hero.clientWidth * 0.06));
  };
  const stopTouch = () => {
    touching = false;
  };

  const controls = [...shell.querySelectorAll<HTMLButtonElement>('.gyro-control')];
  const motionControl = hero.querySelector<HTMLButtonElement>('[data-gyro-enable]');
  const supportsOrientation = 'DeviceOrientationEvent' in window;
  const setMotionState = (active: boolean) => {
    controls.forEach((control) => {
      control.classList.toggle('is-active', active);
      control.setAttribute('aria-pressed', String(active));
      const label = control.querySelector<HTMLElement>('[data-gyro-label]');
      if (active && label && control.dataset.activeLabel)
        label.textContent = control.dataset.activeLabel;
    });
  };
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (!motionEnabled || document.documentElement.dataset.overlay || transition.progress > 0.01)
      return;

    const angle = window.screen.orientation?.angle || 0;
    const landscape = Math.abs(angle) % 180 === 90;
    const tilt = landscape ? event.beta : event.gamma;
    if (tilt === null) return;

    const direction = angle === 90 || angle === 180 ? -1 : 1;
    const position = gsap.utils.mapRange(-32, 32, 12, 88, tilt * direction);
    const clampedPosition = gsap.utils.clamp(12, 88, position);
    if (
      previousMotionPosition !== undefined &&
      Math.abs(clampedPosition - previousMotionPosition) < 0.35
    )
      return;

    previousMotionPosition = clampedPosition;
    move(clampedPosition);
    emphasize(gsap.utils.clamp(20, 34, hero.clientWidth * 0.06));
  };
  const enableMotion = async (event: Event) => {
    event.stopPropagation();
    if (motionEnabled || !supportsOrientation) return;

    try {
      const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent;
      const permission = OrientationEvent.requestPermission
        ? await OrientationEvent.requestPermission()
        : 'granted';
      if (permission !== 'granted') return;

      motionEnabled = true;
      setMotionState(true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    } catch {
      // Touch tracking remains available when the browser denies sensor access.
    }
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

  if (input === 'pointer') {
    trackedElements.forEach((element) => element.addEventListener('pointermove', trackPointer));
  } else {
    trackedElements.forEach((element) => {
      element.addEventListener('pointerdown', startTouch);
      element.addEventListener('pointermove', trackTouch);
    });
    window.addEventListener('pointerup', stopTouch);
    window.addEventListener('pointercancel', stopTouch);
    controls.forEach((control) => (control.hidden = !supportsOrientation));
    motionControl?.addEventListener('click', enableMotion);
  }

  return () => {
    trackedElements.forEach((element) => {
      element.removeEventListener('pointermove', trackPointer);
      element.removeEventListener('pointerdown', startTouch);
      element.removeEventListener('pointermove', trackTouch);
    });
    window.removeEventListener('pointerup', stopTouch);
    window.removeEventListener('pointercancel', stopTouch);
    window.removeEventListener('deviceorientation', handleOrientation, true);
    motionControl?.removeEventListener('click', enableMotion);
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

// Called inside matchMedia so listeners and tweens share its lifecycle.
export function initHeroReveal() {
  return createHeroReveal('pointer');
}

export function initMobileHeroReveal() {
  return createHeroReveal('motion');
}
