import { test, expect, type Locator } from '@playwright/test';

async function expectEntered(element: Locator) {
  await expect(element).toBeVisible();
  await expect(element).toHaveCSS('opacity', '1');
  await expect
    .poll(() =>
      element.evaluate((el) => {
        const matrix = new DOMMatrix(getComputedStyle(el).transform);
        return Math.abs(matrix.m41) + Math.abs(matrix.m42);
      }),
    )
    .toBeLessThan(1);
}

test('all sections enter with scrolling and all six projects remain reachable', async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await expectEntered(page.locator('h1'));
  await expect(page.locator('.pin-spacer')).toHaveCount(0);

  for (const selector of [
    '#work-title',
    '[data-project-index="3"] .project-row',
    '[data-project-index="5"] .project-row',
    '#services-title',
    '[data-service-index="3"]',
    '#about-title',
    '#contact-title',
    '.footer-brand',
    '.footer-bottom',
  ]) {
    const element = page.locator(selector);
    if (await element.evaluate((el) => el.getBoundingClientRect().top > innerHeight)) {
      expect(await element.evaluate((el) => parseFloat(getComputedStyle(el).opacity))).toBeLessThan(
        1,
      );
    }
    await element.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expectEntered(element);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }

  // Returning to a row updates the counter and keeps the two desktop layers aligned.
  const last = page.locator('[data-project-index="5"]');
  await last.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(last).toHaveClass(/is-active/);
  await expect(page.locator('[data-work-counter]')).toHaveText('06');
  if (!isMobile) {
    await expectEntered(last.locator('.project-row'));
    expect(
      await page.locator('[data-project-reveal-index="5"] .project-row').boundingBox(),
    ).toEqual(await last.locator('.project-row').boundingBox());
  }

  await page
    .locator('[data-project-index="3"]')
    .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.locator('[data-dialog-open="project-la-queseria"]').click();
  const dialog = page.locator('#project-la-queseria');
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      dialog.locator('.project-cover').evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(dialog.locator('a[target="_blank"]')).toHaveAttribute(
    'href',
    'https://la-queseria.vercel.app/',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile has no line, sensor listeners or permission controls in either orientation', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Touch devices do not use the mouse reveal.');
  await page.addInitScript(() => {
    const addListener = window.addEventListener;
    window.addEventListener = (...args: Parameters<typeof window.addEventListener>) => {
      const [type] = args;
      if (type === 'deviceorientation' || type === 'devicemotion') {
        document.documentElement.dataset.sensorListener = 'true';
      }
      return Reflect.apply(addListener, window, args);
    };
  });
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  for (const viewport of [
    { width: 393, height: 852 },
    { width: 900, height: 430 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.hero-reveal')).toBeHidden();
    await expect(page.locator('.site-shell')).not.toHaveAttribute('data-hero-reveal-enabled');
    await expect(page.locator('[data-gyro-enable], [data-motion-hint]')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-sensor-listener');
    expect(
      await page.locator('main > .hero').evaluate((el) => getComputedStyle(el, '::after').display),
    ).toBe('none');
    await page.evaluate(() =>
      window.dispatchEvent(
        new DeviceOrientationEvent('deviceorientation', { beta: 40, gamma: 25 }),
      ),
    );
    expect(
      await page
        .locator('.site-shell')
        .evaluate((el: HTMLElement) => el.style.getPropertyValue('--hero-reveal-position')),
    ).toBe('');
  }
});

test('reduced motion restores every section when toggled after animation setup', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const elements = page.locator('[data-scroll-scene] [data-scroll-reveal]');
  for (const element of await elements.all()) {
    await expect(element).toHaveCSS('opacity', '1');
    expect(await element.evaluate((el: HTMLElement) => el.style.transform)).toBe('');
    if (await element.evaluate((el) => getComputedStyle(el).display !== 'none')) {
      await expect(element).toBeVisible();
    }
  }
  await expect(page.locator('.hero-reveal')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page
    .locator('#services-title')
    .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expectEntered(page.locator('#services-title'));
});
