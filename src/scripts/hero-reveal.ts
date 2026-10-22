import gsap from 'gsap';

type RevealInput = 'pointer' | 'motion';
type MotionPermission = 'granted' | 'denied';
type MotionState = 'idle' | 'waiting' | 'active' | 'unavailable';
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
  let motionListening = false;
  let requestingPermission = false;
  let disposed = false;
  let sensorTimeout: number | undefined;
  let motionState: MotionState = 'idle';
  let neutralTilt: number | undefined;
  let neutralPosition = axis;
  let previousScreenAngle: number | undefined;
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
    duration: input === 'motion' ? 0.35 : 0.45,
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
    if ((event.target as Element).closest('button, a, input, select, textarea')) return;
    touching = true;
    moveFromClientX(event.clientX, gsap.utils.clamp(20, 34, hero.clientWidth * 0.06));
  };
  const trackTouch = (event: PointerEvent) => {
    if (!touching || event.pointerType !== 'touch') return;
    moveFromClientX(event.clientX, gsap.utils.clamp(20, 34, hero.clientWidth * 0.06));
  };
  const stopTouch = () => {
    if (!touching) return;
    touching = false;
    // Resume tilt from the position chosen by the finger, without snapping back.
    neutralTilt = undefined;
    previousMotionPosition = undefined;
  };

  const controls = [...shell.querySelectorAll<HTMLButtonElement>('.gyro-control')];
  const motionControl = hero.querySelector<HTMLButtonElement>('[data-gyro-enable]');
  const OrientationEvent = window.DeviceOrientationEvent as
    PermissionedOrientationEvent | undefined;
  const supportsOrientation = window.isSecureContext && typeof OrientationEvent === 'function';
  const hints = [...shell.querySelectorAll<HTMLElement>('[data-motion-hint]')];
  const setMotionState = (state: MotionState) => {
    motionState = state;
    controls.forEach((control) => {
      const active = state === 'active';
      control.classList.toggle('is-active', active);
      control.setAttribute('aria-pressed', String(active));
      control.setAttribute('aria-busy', String(state === 'waiting'));
      const label = control.querySelector<HTMLElement>('[data-gyro-label]');
      if (label) label.textContent = control.dataset[`${state}Label`] || '';
    });
    hints.forEach((hint) => {
      const message = !window.isSecureContext
        ? hint.dataset.secureHint
        : state === 'unavailable'
          ? hint.dataset.unavailableHint
          : hint.dataset.defaultHint;
      hint.textContent = message || '';
    });
  };
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (!motionListening || disposed || document.hidden) return;
    const { beta, gamma } = event;
    if (beta === null || gamma === null || !Number.isFinite(beta) || !Number.isFinite(gamma))
      return;

    window.clearTimeout(sensorTimeout);
    if (motionState !== 'active') setMotionState('active');
    if (touching || document.documentElement.dataset.overlay || transition.progress > 0.01) {
      neutralTilt = undefined;
      previousMotionPosition = undefined;
      return;
    }

    const angle = window.screen.orientation?.angle ?? 0;
    const radians = Math.PI / 180;
    // Project gravity onto the screen's horizontal axis. Raw gamma jumps near
    // an upright phone; this projection stays continuous across that boundary.
    const horizontalGravity =
      Math.cos(beta * radians) * Math.sin(gamma * radians) * Math.cos(angle * radians) -
      Math.sin(beta * radians) * Math.sin(angle * radians);
    const tilt = Math.asin(gsap.utils.clamp(-1, 1, horizontalGravity)) / radians;
    if (neutralTilt === undefined || angle !== previousScreenAngle) {
      neutralTilt = tilt;
      neutralPosition = reveal.position;
      previousMotionPosition = reveal.position;
      previousScreenAngle = angle;
      return;
    }

    // A comfortable 25-degree lean travels half the viewport from the neutral pose.
    const clampedPosition = gsap.utils.clamp(0, 100, neutralPosition + (tilt - neutralTilt) * 2);
    if (
      previousMotionPosition !== undefined &&
      Math.abs(clampedPosition - previousMotionPosition) < 0.35
    )
      return;

    previousMotionPosition = clampedPosition;
    move(clampedPosition);
    emphasize(gsap.utils.clamp(20, 34, hero.clientWidth * 0.06));
  };
  const stopMotion = () => {
    motionListening = false;
    window.clearTimeout(sensorTimeout);
    window.removeEventListener('deviceorientation', handleOrientation);
    neutralTilt = undefined;
    previousMotionPosition = undefined;
  };
  const startMotion = () => {
    stopMotion();
    motionListening = true;
    setMotionState('waiting');
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    sensorTimeout = window.setTimeout(() => {
      if (motionState === 'waiting') setMotionState('unavailable');
      // Keep listening: a late sensor reading can still recover automatically.
    }, 4000);
  };
  const enableMotion = async () => {
    if (disposed || requestingPermission || !supportsOrientation || !OrientationEvent) return;
    requestingPermission = true;
    setMotionState('waiting');

    try {
      const permission =
        typeof OrientationEvent.requestPermission === 'function'
          ? await OrientationEvent.requestPermission()
          : 'granted';
      if (disposed) return;
      if (permission === 'granted') startMotion();
      else setMotionState('unavailable');
    } catch {
      if (!disposed) setMotionState('unavailable');
    } finally {
      requestingPermission = false;
    }
  };
  const toggleMotion = (event: Event) => {
    event.stopPropagation();
    if (motionState === 'active') {
      stopMotion();
      setMotionState('idle');
    } else if (motionState !== 'waiting') {
      void enableMotion();
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
    hints.forEach((hint) => (hint.hidden = false));
    setMotionState(supportsOrientation ? 'idle' : 'unavailable');
    motionControl?.addEventListener('click', toggleMotion);
    // Chrome on Android can start immediately; permission-based browsers must
    // call requestPermission synchronously from the button's click handler.
    if (supportsOrientation && typeof OrientationEvent?.requestPermission !== 'function') {
      void enableMotion();
    }
  }

  return () => {
    disposed = true;
    stopMotion();
    setMotionState('idle');
    controls.forEach((control) => (control.hidden = true));
    hints.forEach((hint) => (hint.hidden = true));
    trackedElements.forEach((element) => {
      element.removeEventListener('pointermove', trackPointer);
      element.removeEventListener('pointerdown', startTouch);
      element.removeEventListener('pointermove', trackTouch);
    });
    window.removeEventListener('pointerup', stopTouch);
    window.removeEventListener('pointercancel', stopTouch);
    motionControl?.removeEventListener('click', toggleMotion);
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
