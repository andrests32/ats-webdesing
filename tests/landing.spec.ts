import { test, expect } from '@playwright/test';

for (const lang of ['es', 'en']) {
  test(`${lang}: hero color band keeps its mouse position and expands into work`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(`/${lang}/`);
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
    const reveal = page.locator('.hero-reveal');
    if (isMobile) {
      await expect(reveal).toBeHidden();
      return;
    }

    await expect(reveal).toBeVisible();
    await expect(reveal).toHaveAttribute('aria-hidden', 'true');
    await expect(reveal).toHaveAttribute('inert', '');
    const shell = page.locator('.site-shell');
    const position = () =>
      shell.evaluate((el) =>
        parseFloat(getComputedStyle(el).getPropertyValue('--hero-reveal-position')),
      );
    const width = () =>
      shell.evaluate(
        (el) => parseFloat(getComputedStyle(el).getPropertyValue('--hero-reveal-half-width')) * 2,
      );
    const viewport = page.viewportSize()!;
    for (const fraction of [0.25, 0.75]) {
      await page.mouse.move(viewport.width * fraction, 400, { steps: 8 });
      await expect.poll(position).toBeCloseTo(fraction * 100, 0);
      await expect.poll(width).toBeGreaterThan(60);
    }
    // The color layer must track the real typography in both languages.
    expect(await reveal.locator('.hero-title').boundingBox()).toEqual(
      await page.locator('h1').boundingBox(),
    );
    await page.mouse.move(-10, -10);
    await expect.poll(position).toBeCloseTo(75, 1);
    await expect.poll(width, { timeout: 2500 }).toBeLessThan(2);
    const baseWork = page.locator('.work-chapter:not(.work-chapter-reveal)');
    const revealWork = page.locator('.work-chapter-reveal');
    await expect(baseWork).toHaveCSS('background-color', 'rgb(241, 234, 218)');
    await expect(baseWork.locator('[data-project-index="0"] .project-name')).toHaveCSS(
      'color',
      'rgb(255, 255, 255)',
    );

    const transition = () =>
      shell.evaluate((el) =>
        parseFloat(getComputedStyle(el).getPropertyValue('--hero-reveal-progress')),
      );
    const revealInsets = () =>
      shell.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          left: parseFloat(style.getPropertyValue('--hero-reveal-left')),
          right: parseFloat(style.getPropertyValue('--hero-reveal-right')),
        };
      });
    await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.5, behavior: 'instant' }));
    await expect.poll(transition).toBeGreaterThan(0.35);
    expect((await revealInsets()).left).toBeLessThan(40);

    await page.evaluate(() => {
      const work = document.querySelector<HTMLElement>('.work-chapter:not(.work-chapter-reveal)')!;
      const workTop = work.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: workTop - innerHeight * 0.1, behavior: 'instant' });
    });
    await expect.poll(transition).toBeGreaterThan(0.98);
    await expect.poll(async () => (await revealInsets()).left).toBeLessThan(2);
    await expect.poll(async () => (await revealInsets()).right).toBeLessThan(2);
    await expect(revealWork.locator('[data-project-reveal-index="0"] .project-name')).toHaveCSS(
      'color',
      'rgb(255, 255, 255)',
    );
    await expect(revealWork.locator('[data-project-reveal-index="0"] .axis-number')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    );

    const workStart = await page.locator('.work-motion').evaluate((work) => {
      const bounds = work.getBoundingClientRect();
      return bounds.top + window.scrollY;
    });
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      workStart + viewport.height * 0.68,
    );
    const activeProject = page.locator('[data-project-index="2"]');
    await expect(activeProject).toHaveClass(/is-active/);
    await expect(page.locator('.project-thumbnail')).toHaveCount(0);
    await page.locator('[data-project-index="4"] .project-row').dispatchEvent('pointerenter');
    await expect(activeProject).toHaveClass(/is-active/);
    await expect(page.locator('[data-project-index="4"]')).not.toHaveClass(/is-active/);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(transition).toBeLessThan(0.02);
    await expect.poll(position).toBeCloseTo(75, 1);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(reveal).toBeHidden();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(reveal).toBeVisible();
    await page.mouse.move(viewport.width / 2, 400);
    await expect.poll(position).toBeCloseTo(50, 0);

    // The decorative band must not intercept header controls.
    await page.locator('[data-dialog-open="menu-dialog"]').click();
    await expect(page.locator('#menu-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-dialog')).not.toBeVisible();
  });

  test(`${lang}: content, metadata, projects and responsive layout`, async ({ page, isMobile }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${lang}/`);
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page).toHaveTitle(/Zamora, Ecuador/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(
      lang === 'es' ? 'Diseño y desarrollo' : 'Design and code',
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('#contact-title')).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(page.locator('#estudio')).toHaveCSS('background-color', 'rgb(255, 130, 0)');
    await expect(page.locator('#about-title')).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(
      page.locator(`link[hreflang="${lang === 'es' ? 'es-EC' : 'en'}"]`),
    ).toHaveAttribute('href', new RegExp(`/${lang}/$`));
    expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
      'Zamora Chinchipe',
    );
    await expect(page.locator('.footer-sections a')).toHaveCount(5);
    await expect(page.locator('.footer-sections a').first()).toHaveAttribute('href', '#inicio');
    await expect(page.locator('.footer-sections a').nth(2)).toHaveAttribute('href', '#servicios');
    await expect(page.locator('.footer-legal a')).toHaveCount(3);
    await expect(page.locator('.contact-cta > span:nth-child(2)')).toHaveCSS(
      'white-space',
      'nowrap',
    );
    const baseWork = page.locator('.work-chapter:not(.work-chapter-reveal)');
    await expect(baseWork.locator('.project-name').first()).toHaveText('Billonchok');
    await expect(baseWork.locator('.project-list > li')).toHaveCount(5);
    const numberBox = await baseWork.locator('.project-row .axis-number').first().boundingBox();
    const nameBox = await baseWork.locator('.project-name').first().boundingBox();
    const detailBox = await baseWork.locator('.project-detail').first().boundingBox();
    expect(numberBox).toBeTruthy();
    expect(nameBox).toBeTruthy();
    expect(detailBox).toBeTruthy();
    if (isMobile) {
      expect(nameBox!.x - (numberBox!.x + numberBox!.width)).toBeGreaterThanOrEqual(14);
    } else {
      const spacing = await page
        .locator('.work-chapter:not(.work-chapter-reveal) .project-row')
        .first()
        .evaluate((row) => {
          const name = row.querySelector<HTMLElement>('.project-name')!;
          const number = row.querySelector<HTMLElement>('.axis-number')!;
          const detail = row.querySelector<HTMLElement>('.project-detail')!;
          const nameBox = name.getBoundingClientRect();
          const numberBox = number.getBoundingClientRect();
          const detailBox = detail.getBoundingClientRect();
          return {
            before:
              numberBox.left - (nameBox.right - parseFloat(getComputedStyle(name).paddingRight)),
            after:
              detailBox.left + parseFloat(getComputedStyle(detail).paddingLeft) - numberBox.right,
          };
        });
      expect(spacing.before).toBeGreaterThanOrEqual(45);
      expect(spacing.after).toBeGreaterThanOrEqual(22);
    }
    const serviceNumber = await page.locator('.service-row .axis-number').first().boundingBox();
    const serviceTitle = await page.locator('.service-row h3').first().boundingBox();
    const serviceCopy = await page.locator('.service-row p').first().boundingBox();
    expect(serviceNumber).toBeTruthy();
    expect(serviceTitle).toBeTruthy();
    expect(serviceCopy).toBeTruthy();
    if (isMobile) {
      expect(serviceTitle!.x - (serviceNumber!.x + serviceNumber!.width)).toBeGreaterThanOrEqual(
        14,
      );
    } else {
      const spacing = await page
        .locator('.service-row')
        .first()
        .evaluate((row) => {
          const title = row.querySelector<HTMLElement>('h3')!;
          const number = row.querySelector<HTMLElement>('.axis-number')!;
          const copy = row.querySelector<HTMLElement>('p')!;
          const titleBox = title.getBoundingClientRect();
          const numberBox = number.getBoundingClientRect();
          const copyBox = copy.getBoundingClientRect();
          return {
            before:
              numberBox.left - (titleBox.right - parseFloat(getComputedStyle(title).paddingRight)),
            after: copyBox.left + parseFloat(getComputedStyle(copy).paddingLeft) - numberBox.right,
          };
        });
      expect(spacing.before).toBeGreaterThanOrEqual(45);
      expect(spacing.after).toBeGreaterThanOrEqual(22);
    }
    const processNumber = await page.locator('.process-list .font-mono').first().boundingBox();
    const processTitle = await page.locator('.process-list h3').first().boundingBox();
    expect(processNumber).toBeTruthy();
    expect(processTitle).toBeTruthy();
    if (isMobile) {
      expect(processTitle!.x - (processNumber!.x + processNumber!.width)).toBeGreaterThanOrEqual(
        14,
      );
    } else {
      expect(processTitle!.y - (processNumber!.y + processNumber!.height)).toBeGreaterThanOrEqual(
        30,
      );
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.locator('[data-dialog-open="project-billonchok"]').click();
    const dialog = page.locator('#project-billonchok');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.project-cover')).toBeVisible();
    await expect
      .poll(() =>
        dialog.locator('.project-cover').evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(dialog.locator('a[target="_blank"]')).toHaveAttribute('href', /billonchok\.com/);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('project dialog uses a minimal scrollbar that hides after use', async ({ page }) => {
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width, height: Math.min(viewport.height, 560) });
  await page.goto('/es/');
  await page.locator('[data-dialog-open="project-billonchok"]').click();
  const dialog = page.locator('#project-billonchok');
  const scrollArea = dialog.locator('[data-project-dialog-scroll]');
  const indicator = dialog.locator('[data-dialog-scroll-indicator]');
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => scrollArea.evaluate((element) => element.scrollHeight - element.clientHeight))
    .toBeGreaterThan(1);
  expect(
    await scrollArea.evaluate((element) => getComputedStyle(element, '::-webkit-scrollbar').width),
  ).toBe('0px');

  await scrollArea.evaluate((element) => {
    element.scrollTop = (element.scrollHeight - element.clientHeight) * 0.55;
  });
  await expect(dialog).toHaveClass(/is-scrolling/);
  await expect(indicator).toHaveCSS('opacity', '1');
  await expect(indicator).toHaveCSS('width', '1px');
  await expect(dialog).not.toHaveClass(/is-scrolling/, { timeout: 1500 });
  await expect(indicator).toHaveCSS('opacity', '0');
});

test('menu traps focus, closes with Escape, and navigates to services', async ({ page }) => {
  await page.goto('/es/');
  const toggle = page.locator('[data-dialog-open="menu-dialog"]');
  await toggle.click();
  const menu = page.locator('#menu-dialog');
  await expect(menu).toBeVisible();
  await expect(menu.locator('nav a').first()).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(menu.locator('[data-dialog-close]')).toHaveCSS('color', 'rgb(255, 255, 255)');
  for (let i = 0; i < 9; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('dialog')?.id)).toBe(
    'menu-dialog',
  );
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await expect(page.locator('html')).not.toHaveAttribute('data-overlay');
  await toggle.click();
  await menu.locator('a[href="#servicios"]').click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/#servicios$/);
  await expect
    .poll(
      () => page.locator('#servicios').evaluate((e) => Math.abs(e.getBoundingClientRect().top)),
      { timeout: 5000 },
    )
    .toBeLessThan(30);
});

test('language selector preserves the section and translates content', async ({ page }) => {
  await page.goto('/es/#servicios');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.locator('[data-language][lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/#servicios$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#services-title')).toContainText('How it looks matters.');
});

test('contact validates fields and prepares a correctly encoded WhatsApp draft', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.open = ((url: string | URL | undefined) => {
      document.documentElement.dataset.preparedMessage = String(url);
      return null;
    }) as typeof window.open;
  });
  await page.goto('/es/');
  await page.locator('[data-dialog-open="contact-dialog"]').click();
  const form = page.locator('#project-inquiry');
  await form.locator('button[type="submit"]').click();
  expect(await form.evaluate((f: HTMLFormElement) => f.checkValidity())).toBe(false);
  await form.locator('[name="name"]').fill('María & José');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="message"]').fill('Necesitamos una web para café & chocolate.');
  await form.locator('button[type="submit"]').click();
  const prepared = await page.locator('html').getAttribute('data-prepared-message');
  expect(prepared).toBeTruthy();
  const url = new URL(prepared!);
  expect(url.hostname).toBe('wa.me');
  expect(url.searchParams.get('text')).toContain('María & José');
  expect(url.searchParams.get('text')).toContain('café & chocolate.');
});

test('reduced motion retains content and avoids pinned scroll sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.locator('[data-dialog-open="menu-dialog"]').click();
  await expect(page.locator('#menu-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-dialog')).not.toBeVisible();
});

test('without JavaScript the service content and direct contact links remain available', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/es/`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#services-title')).toBeVisible();
  await expect(page.locator('#contacto a[href="mailto:atsagency@gmail.com"]')).toBeVisible();
  expect(
    await page
      .locator('.work-chapter:not(.work-chapter-reveal)')
      .evaluate((e) => getComputedStyle(e).clipPath),
  ).toBe('none');
  await context.close();
});

test('legal pages publish privacy, service and proportional refund terms', async ({ page }) => {
  await page.goto('/es/legal/cancelaciones-y-reembolsos/');
  await expect(page.locator('h1')).toHaveText('Cancelaciones y reembolsos');
  await expect(page.locator('main')).toContainText('horas efectivamente trabajadas');
  await expect(page.locator('main')).toContainText(
    'No aplicamos automáticamente una penalidad fija del 35 %',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/es\/legal\/cancelaciones-y-reembolsos\/$/,
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    /\/en\/legal\/cancellations-and-refunds\/$/,
  );
  await expect(page.locator('.footer-sections a').nth(2)).toHaveAttribute('href', '/es/#servicios');
  await page.locator('.footer-legal a[href="/es/legal/privacidad/"]').click();
  await expect(page.locator('h1')).toHaveText('Política de privacidad');
  await expect(page.locator('main')).toContainText('no instala cookies publicitarias');
  await expect(page.locator('main')).toContainText('Superintendencia de Protección de Datos');
});

test('404 page follows the studio visual system and offers useful routes', async ({ page }) => {
  const response = await page.goto('/esta-ruta-no-existe/');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Página no encontrada | ATS Web Studio');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('.not-found-number')).toHaveText('404');
  await expect(page.locator('.not-found h1')).toHaveText('Esta página tomó otro camino.');
  await expect(page.locator('.not-found-actions a[href="/es/"]')).toBeVisible();
  await expect(page.locator('.not-found-actions a[href="/es/#proyectos"]')).toBeVisible();
  await page.locator('[data-dialog-open="menu-dialog"]').click();
  await expect(page.locator('#menu-dialog a').nth(1)).toHaveAttribute('href', '/es/#proyectos');
});
