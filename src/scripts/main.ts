import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroReveal, initMobileHeroReveal } from './hero-reveal';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cleanups: Array<() => void> = [];
let lenis: Lenis | undefined;

// A single ticker owns smooth scrolling; native touch scrolling stays native.
const smoothMedia = gsap.matchMedia();
smoothMedia.add(
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  () => {
    const scroller = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    lenis = scroller;
    const tick = (seconds: number) => scroller.raf(seconds * 1000);
    scroller.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      scroller.destroy();
      lenis = undefined;
    };
  },
);
cleanups.push(() => smoothMedia.revert());

function scrollToSection(hash: string) {
  const target = document.getElementById(hash.replace(/^#/, ''));
  if (!target) return;
  history.replaceState(null, '', hash);
  if (lenis) lenis.scrollTo(target, { duration: 1.15, offset: 0 });
  else target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  // Keyboard users arrive at the actual section, not behind the closed drawer.
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

const dialogTriggers = new Map<HTMLDialogElement, HTMLElement>();
const closing = new Set<HTMLDialogElement>();
const scrollbarTimeouts = new WeakMap<HTMLDialogElement, number>();

function updateProjectScrollbar(dialog: HTMLDialogElement, show = false) {
  const viewport = dialog.querySelector<HTMLElement>('[data-project-dialog-scroll]');
  const track = dialog.querySelector<HTMLElement>('[data-dialog-scroll-indicator]');
  const thumb = track?.firstElementChild;
  if (!viewport || !track || !(thumb instanceof HTMLElement)) return;

  const overflow = viewport.scrollHeight - viewport.clientHeight;
  dialog.classList.toggle('has-overflow', overflow > 1);
  if (overflow <= 1) return;

  const trackHeight = track.clientHeight;
  const thumbHeight = Math.max(36, trackHeight * (viewport.clientHeight / viewport.scrollHeight));
  const offset = (viewport.scrollTop / overflow) * (trackHeight - thumbHeight);
  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translateY(${offset}px)`;

  if (!show) return;
  dialog.classList.add('is-scrolling');
  const previous = scrollbarTimeouts.get(dialog);
  if (previous) window.clearTimeout(previous);
  scrollbarTimeouts.set(
    dialog,
    window.setTimeout(() => dialog.classList.remove('is-scrolling'), 720),
  );
}

document.querySelectorAll<HTMLDialogElement>('.project-dialog').forEach((dialog) => {
  const viewport = dialog.querySelector<HTMLElement>('[data-project-dialog-scroll]');
  if (!viewport) return;
  const onScroll = () => updateProjectScrollbar(dialog, true);
  viewport.addEventListener('scroll', onScroll, { passive: true });
  const observer = new ResizeObserver(() => updateProjectScrollbar(dialog));
  observer.observe(viewport);
  if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
  cleanups.push(() => {
    viewport.removeEventListener('scroll', onScroll);
    observer.disconnect();
    const timeout = scrollbarTimeouts.get(dialog);
    if (timeout) window.clearTimeout(timeout);
  });
});

function closeDialog(dialog: HTMLDialogElement, after?: () => void) {
  if (!dialog.open || closing.has(dialog)) return;
  closing.add(dialog);
  const finish = () => {
    dialog.close();
    dialog.classList.remove('is-scrolling');
    gsap.set(dialog, { clearProps: 'transform,opacity' });
    delete document.documentElement.dataset.overlay;
    lenis?.start();
    const trigger = dialogTriggers.get(dialog);
    trigger?.setAttribute('aria-expanded', 'false');
    trigger?.focus({ preventScroll: true });
    closing.delete(dialog);
    after?.();
  };
  if (reducedMotion.matches) {
    finish();
    return;
  }
  gsap.killTweensOf(dialog);
  gsap.to(dialog, {
    ...(dialog.id === 'menu-dialog' ? { xPercent: 100 } : { y: 18, opacity: 0 }),
    duration: 0.26,
    ease: 'power2.in',
    onComplete: finish,
  });
}

document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(dialog));
  });
  // A click outside the dialog rectangle is a backdrop click.
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      closeDialog(dialog);
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-dialog-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen || '');
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
    dialogTriggers.set(dialog, trigger);
    lenis?.stop();
    document.documentElement.dataset.overlay = 'true';
    dialog.showModal();
    if (dialog.classList.contains('project-dialog')) {
      const viewport = dialog.querySelector<HTMLElement>('[data-project-dialog-scroll]');
      if (viewport) viewport.scrollTop = 0;
      requestAnimationFrame(() => updateProjectScrollbar(dialog, true));
    }
    trigger.setAttribute('aria-expanded', 'true');
    if (!reducedMotion.matches) {
      gsap.fromTo(dialog, dialog.id === 'menu-dialog' ? { xPercent: 100 } : { y: 24, opacity: 0 }, {
        xPercent: 0,
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
      });
      if (dialog.id === 'menu-dialog') {
        gsap.fromTo(
          dialog.querySelectorAll('[data-menu-link]'),
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, delay: 0.12, stagger: 0.055, ease: 'power2.out' },
        );
      }
    }
  });
});

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#' || !document.getElementById(hash.slice(1))) return;
    event.preventDefault();
    const dialog = link.closest('dialog');
    if (dialog instanceof HTMLDialogElement && dialog.open)
      closeDialog(dialog, () => scrollToSection(hash));
    else scrollToSection(hash);
  });
});

// Keep the visitor in the same section when changing language.
document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach((link) => {
  link.addEventListener('click', () => {
    const url = new URL(link.href);
    url.hash = location.hash;
    link.href = url.href;
  });
});

const inquiry = document.querySelector<HTMLFormElement>('#project-inquiry');
inquiry?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!inquiry.reportValidity()) return;
  const data = new FormData(inquiry);
  const message = [
    inquiry.dataset.subject,
    `${data.get('name')} · ${data.get('email')}`,
    String(data.get('service')),
    '',
    String(data.get('message')),
  ].join('\n');
  const url = new URL(`https://wa.me/${inquiry.dataset.phone}`);
  url.searchParams.set('text', message);
  window.open(url.href, '_blank', 'noopener,noreferrer');
});

const clocks = document.querySelectorAll<HTMLElement>('[data-local-time]');
function updateClock() {
  const now = new Date();
  const time = `${new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit' }).format(now)} EC`;
  clocks.forEach((clock) => {
    clock.textContent = time;
    clock.setAttribute('datetime', now.toISOString());
  });
}
updateClock();
const clockInterval = window.setInterval(updateClock, 60000);
cleanups.push(() => window.clearInterval(clockInterval));

const projectRows = [...document.querySelectorAll<HTMLElement>('[data-project-index]')];
const projectRevealRows = [
  ...document.querySelectorAll<HTMLElement>('[data-project-reveal-index]'),
];
function focusProject(index: number) {
  projectRows.forEach((row, i) => row.classList.toggle('is-active', i === index));
  projectRevealRows.forEach((row, i) => row.classList.toggle('is-active', i === index));
  document
    .querySelectorAll('[data-work-counter], [data-work-reveal-counter]')
    .forEach((counter) => (counter.textContent = String(index + 1).padStart(2, '0')));
}

const motionMedia = gsap.matchMedia();
async function initMotion() {
  await document.fonts.ready;
  if (document.querySelector('.hero')) {
    motionMedia.add(
      '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      initHeroReveal,
    );
    motionMedia.add(
      '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      initMobileHeroReveal,
    );
    motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
      const lineCount = document.querySelectorAll('main [data-hero-line]').length;
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from(
          '[data-hero-line]',
          {
            yPercent: 105,
            opacity: 0,
            duration: 1.05,
            // Keep each visible line and its decorative color layer in sync.
            stagger: (index) => (index % lineCount) * 0.085,
          },
          0,
        )
        .from('[data-hero-description]', { y: 16, opacity: 0, duration: 0.7 }, 0.4)
        .from('.hero-bottom', { opacity: 0, y: 12, duration: 0.7 }, 0.6);

      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 30,
          opacity: 0.15,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        });
      });

      document.querySelectorAll<HTMLElement>('[data-scroll-scene]').forEach((section) => {
        const label = section.querySelector<HTMLElement>('.section-label');
        const elements = [
          ...(label ? [label] : []),
          ...section.querySelectorAll<HTMLElement>('[data-scroll-reveal]'),
        ];

        elements.forEach((element) => {
          const direction = element.dataset.scrollReveal || 'left';
          const horizontal = direction === 'left' ? -72 : direction === 'right' ? 72 : 0;
          const vertical = direction === 'up' ? 68 : 32;

          gsap.fromTo(
            element,
            { x: horizontal, y: vertical, autoAlpha: 0 },
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'clamp(top 96%)',
                end: 'clamp(top 68%)',
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    });

    motionMedia.add(
      '(min-width: 1100px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)',
      () => {
        ScrollTrigger.create({
          trigger: '.work-motion',
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 1.35)}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => focusProject(Math.min(4, Math.floor(self.progress * 5))),
        });
        gsap.fromTo(
          '.about',
          { clipPath: 'inset(0 8% 0 8%)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            ease: 'none',
            scrollTrigger: { trigger: '.about', start: 'top 95%', end: 'top 35%', scrub: 0.5 },
          },
        );
      },
    );

    motionMedia.add(
      '(min-width: 768px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)',
      () => {
        const triggers = projectRows.map((row, index) =>
          ScrollTrigger.create({
            trigger: row,
            start: 'top 58%',
            end: 'bottom 58%',
            onEnter: () => focusProject(index),
            onEnterBack: () => focusProject(index),
          }),
        );
        return () => triggers.forEach((trigger) => trigger.kill());
      },
    );

    const serviceRows = [...document.querySelectorAll<HTMLElement>('[data-service-index]')];
    serviceRows.forEach((row, index) => {
      const focus = () => {
        serviceRows.forEach((r, i) => r.classList.toggle('is-active', i === index));
        const counter = document.querySelector('[data-service-counter]');
        if (counter) counter.textContent = String(index + 1).padStart(2, '0');
      };
      const trigger = ScrollTrigger.create({
        trigger: row,
        start: 'top 60%',
        end: 'bottom 60%',
        onEnter: focus,
        onEnterBack: focus,
      });
      row.addEventListener('pointerenter', focus);
      cleanups.push(() => trigger.kill());
    });
    ScrollTrigger.refresh();
    // Static locale navigation can contain a hash before pin spacers are calculated.
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        if (lenis) lenis.scrollTo(target, { immediate: true });
        else target.scrollIntoView({ behavior: 'instant' });
      }
    }
  }
  document.documentElement.dataset.ready = 'true';
}
void initMotion();
cleanups.push(() => motionMedia.revert());

window.addEventListener('pagehide', (event) => {
  // Retain listeners and state when entering the browser's back-forward cache.
  if (!event.persisted) cleanups.forEach((cleanup) => cleanup());
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) ScrollTrigger.refresh();
});
