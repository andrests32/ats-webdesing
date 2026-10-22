import { test, expect, type Page } from '@playwright/test';

const position = (page: Page) =>
  page
    .locator('.site-shell')
    .evaluate((el: HTMLElement) => parseFloat(el.style.getPropertyValue('--hero-reveal-position')));

async function orient(page: Page, beta: number | null, gamma: number | null) {
  await page.evaluate(
    (reading) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', reading)),
    { beta, gamma },
  );
}

async function openHero(page: Page, lang = 'es') {
  await page.goto(`/${lang}/`);
  await expect(page.locator('.site-shell')).toHaveAttribute('data-hero-reveal-enabled', 'true');
}

test.beforeEach(async ({ isMobile }) => {
  test.skip(!isMobile, 'Device orientation is used on touch devices.');
});

for (const lang of ['es', 'en']) {
  test(`${lang}: tilt starts automatically, calibrates, follows both sides and settles`, async ({
    page,
  }) => {
    await openHero(page, lang);
    const control = page.locator('[data-gyro-enable]');
    await expect(control).toBeVisible();
    await expect(control).toHaveAttribute('aria-pressed', 'false');
    const initial = await position(page);

    await orient(page, 0, 10);
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    expect(await position(page)).toBeCloseTo(initial, 1);
    await orient(page, 0, -10);
    await expect.poll(() => position(page)).toBeCloseTo(initial - 40, 0);
    await orient(page, 0, 25);
    await expect.poll(() => position(page)).toBeCloseTo(initial + 30, 0);
    await expect
      .poll(() =>
        page
          .locator('.site-shell')
          .evaluate((el: HTMLElement) =>
            parseFloat(el.style.getPropertyValue('--hero-reveal-half-width')),
          ),
      )
      .toBeGreaterThan(20);

    // Repeated stationary readings must let the band shrink back to its thin line.
    await orient(page, 0, 25);
    await expect
      .poll(
        () =>
          page
            .locator('.site-shell')
            .evaluate((el: HTMLElement) =>
              parseFloat(el.style.getPropertyValue('--hero-reveal-half-width')),
            ),
        { timeout: 2500 },
      )
      .toBeLessThan(1);
    expect(await position(page)).toBeCloseTo(initial + 30, 0);
    await orient(page, 0, 80);
    await expect.poll(() => position(page)).toBeCloseTo(100, 0);
    await orient(page, 0, -80);
    await expect.poll(() => position(page)).toBeCloseTo(0, 0);

    expect(await page.locator('.hero-reveal .hero-title').boundingBox()).toEqual(
      await page.locator('h1').boundingBox(),
    );
    await control.click();
    await expect(control).toHaveAttribute('aria-pressed', 'false');
    await orient(page, 0, 10);
    expect(await position(page)).toBeCloseTo(0, 0);
  });
}

test('tilting an upright phone moves smoothly across the gamma discontinuity', async ({ page }) => {
  await openHero(page);
  const initial = await position(page);
  await orient(page, 90, 0);
  await orient(page, 80, 90);
  await expect.poll(() => position(page)).toBeCloseTo(initial + 20, 0);
  await orient(page, 100, 90);
  await expect.poll(() => position(page)).toBeCloseTo(initial - 20, 0);
});

test('landscape keeps motion enabled above 767px and recalibrates on rotation', async ({
  page,
}) => {
  await openHero(page);
  await orient(page, 0, 10);
  const initial = await position(page);
  await page.setViewportSize({ width: 900, height: 430 });
  await page.evaluate(() =>
    Object.defineProperty(screen.orientation, 'angle', {
      configurable: true,
      value: 90,
    }),
  );
  await expect(page.locator('[data-gyro-enable]')).toBeVisible();
  await expect(page.locator('.hero-reveal')).toBeVisible();
  await orient(page, 20, 0);
  expect(await position(page)).toBeCloseTo(initial, 1);
  await orient(page, 35, 0);
  await expect.poll(() => position(page)).toBeCloseTo(initial - 30, 0);
  await orient(page, 5, 0);
  await expect.poll(() => position(page)).toBeCloseTo(initial + 30, 0);
});

test('missing sensor data reports a fallback, touch works, and late readings recover', async ({
  page,
}) => {
  await openHero(page);
  const control = page.locator('[data-gyro-enable]');
  await orient(page, null, null);
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await expect(control).toHaveText('Reintentar movimiento', { timeout: 6000 });
  await expect(page.locator('#hero-motion-hint')).toContainText('permiso de sensores');
  const hero = page.locator('main > .hero');
  await hero.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 80 });
  await hero.dispatchEvent('pointermove', { pointerType: 'touch', clientX: 120 });
  const touchedPosition = (120 / page.viewportSize()!.width) * 100;
  await expect.poll(() => position(page)).toBeCloseTo(touchedPosition, 0);
  await orient(page, 0, 15);
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  expect(await position(page)).toBeCloseTo(touchedPosition, 0);
  await hero.dispatchEvent('pointerup', { pointerType: 'touch' });
  await orient(page, 0, 15);
  expect(await position(page)).toBeCloseTo(touchedPosition, 0);
  await orient(page, 0, 25);
  await expect.poll(() => position(page)).toBeCloseTo(touchedPosition + 20, 0);
});

for (const permission of ['granted', 'denied', 'error']) {
  test(`permission-based browser: ${permission} is handled after a tap`, async ({ page }) => {
    await page.addInitScript((result) => {
      Object.defineProperty(DeviceOrientationEvent, 'requestPermission', {
        value: () => {
          document.documentElement.dataset.sensorPermissionRequested = 'true';
          return result === 'error'
            ? Promise.reject(new Error('Sensor blocked'))
            : Promise.resolve(result);
        },
      });
    }, permission);
    await openHero(page);
    const control = page.locator('[data-gyro-enable]');
    await expect(page.locator('html')).not.toHaveAttribute('data-sensor-permission-requested');
    await expect(control).toHaveText('Activar movimiento');
    await control.click();
    await expect(page.locator('html')).toHaveAttribute('data-sensor-permission-requested', 'true');
    await expect(control).toHaveAttribute('aria-pressed', 'false');
    await orient(page, 0, 0);
    if (permission === 'granted') {
      await expect(control).toHaveAttribute('aria-pressed', 'true');
    } else {
      await expect(control).toHaveText('Reintentar movimiento');
      await expect(control).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('#hero-motion-hint')).toContainText('permiso de sensores');
    }
  });
}

test('motion pauses behind a dialog and cleans up when reduced motion is enabled', async ({
  page,
}) => {
  await openHero(page);
  await orient(page, 0, 0);
  const initial = await position(page);
  await page.locator('[data-dialog-open="menu-dialog"]').click();
  await expect(page.locator('#menu-dialog')).toBeVisible();
  await orient(page, 0, 20);
  expect(await position(page)).toBeCloseTo(initial, 1);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute('data-overlay');
  await orient(page, 0, 20);
  await orient(page, 0, 10);
  await expect.poll(() => position(page)).toBeCloseTo(initial - 20, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-reveal')).toBeHidden();
  await expect(page.locator('[data-gyro-enable]')).toBeHidden();
  await orient(page, 0, 30);
  await expect(page.locator('.site-shell')).not.toHaveAttribute('data-hero-reveal-enabled');
  expect(Number.isNaN(await position(page))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('[data-gyro-enable]')).toBeVisible();
  await orient(page, 0, 10);
  await expect(page.locator('[data-gyro-enable]')).toHaveAttribute('aria-pressed', 'true');
});

test('a late permission response cannot restart motion after cleanup', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(DeviceOrientationEvent, 'requestPermission', {
      value: () =>
        new Promise((resolve) => {
          window.addEventListener('test-grant-motion', () => resolve('granted'), { once: true });
        }),
    });
  });
  await openHero(page);
  await page.locator('[data-gyro-enable]').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.dispatchEvent(new Event('test-grant-motion')));
  await orient(page, 0, 0);
  await orient(page, 0, 20);
  await expect(page.locator('[data-gyro-enable]')).toHaveAttribute('aria-pressed', 'false');
  expect(Number.isNaN(await position(page))).toBe(true);
});
