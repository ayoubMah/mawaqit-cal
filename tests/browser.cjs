const { chromium } = require('../.local/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe' });
  const errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'America/Los_Angeles' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8766/');
    await page.locator('#app').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#prayer-list li').count(), 5);
    assert.equal(await page.locator('#phone-links a[href*="syncselect"]').count(), 1);
    assert.match(await page.locator('#phone-steps').textContent(), /iPhone/);
    assert.equal(await page.locator('#preview-panel').getAttribute('aria-labelledby'), 'mosque-name');
    await page.screenshot({ path: '.local/desktop.png', fullPage: true });
    await page.locator('#search').fill('creteil');
    assert.equal(await page.locator('.mosque-option').count(), 1);
    await page.locator('#search').fill('not-a-mosque');
    assert.equal(await page.locator('#no-results').isVisible(), true);
    await page.locator('#search').fill('');
    await page.locator('[data-provider="apple"]').click();
    assert.equal(await page.locator('#phone-links a[href*="syncselect"]').count(), 0);
    assert.doesNotMatch(await page.locator('#phone-steps').textContent(), /Google/);
    assert.equal(await page.locator('#open-calendar').getAttribute('aria-disabled'), 'true');
    assert.equal(await page.locator('#local-warning').isVisible(), true);
    await page.locator('#confirmed').check();
    assert.match(await page.locator('#confirmed-message').textContent(), /prêt/);
    await page.locator('[data-provider="outlook"]').click();
    assert.equal(await page.locator('#work-outlook').getAttribute('href'), 'https://outlook.office.com/calendar/');
    assert.equal(await page.locator('#work-outlook').isVisible(), true);
    assert.equal(await page.locator('#confirmed').isChecked(), false);
    assert.equal(await page.locator('#setup-steps li').count(), 4);
    await page.locator('#language').selectOption('en');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.match(await page.locator('#setup-heading').textContent(), /Outlook/);
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('denied'); } } }); });
    await page.locator('#copy').click();
    await page.waitForFunction(() => document.getElementById('copy-status').textContent.includes('manually'));
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.copiedLink = text; } } }); });
    await page.locator('#copy').click();
    await page.waitForFunction(() => document.getElementById('copy-status').textContent === 'Link copied.');
    assert.equal(await page.evaluate(() => window.copiedLink), await page.locator('#feed-url').inputValue());

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#language').selectOption('ar');
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.match(await page.locator('.prayer-name').first().textContent(), /الفجر/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: '.local/mobile-ar.png', fullPage: true });
    await page.locator('#language').selectOption('fr');
    await page.locator('[data-provider="google"]').click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: '.local/mobile-fr.png', fullPage: true });
    await page.setViewportSize({ width: 320, height: 700 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

    const catalog = JSON.parse(await fs.readFile('public/catalog.json', 'utf8'));
    const original = catalog.mosques[0];
    const second = { ...original, id: 'other', name: '<img src=x onerror=alert(1)>', feed: 'other.ics' };
    const scenario = async (data, status = 200, production = false) => {
      const p = await context.newPage();
      p.on('pageerror', error => errors.push(error.message));
      if (production) {
        await p.route('https://salat.example/mawaqit-cal/**', async route => {
          const name = new URL(route.request().url()).pathname.split('/').pop() || 'index.html';
          if (name === 'catalog.json') return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
          const types = { 'index.html': 'text/html', 'app.js': 'text/javascript', 'styles.css': 'text/css' };
          await route.fulfill({ contentType: types[name] || 'text/plain', body: await fs.readFile(path.join('public', name)) });
        });
      } else {
        await p.route('**/catalog.json', route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) }));
      }
      return p;
    };
    const hosted = await scenario({ version: 1, mosques: [original, second] }, 200, true);
    // At the start of the catalog's Paris day, the viewer in California is
    // still on the previous date. Derive this from the build, not a fixed date.
    const offset = original.events[0].start.match(/[+-]\d{2}:\d{2}$/)[0];
    await hosted.clock.install({ time: new Date(original.events[0].date + 'T00:30:00' + offset) });
    await hosted.goto('https://salat.example/mawaqit-cal/?mosque=' + original.id + '&lang=en');
    await hosted.locator('#app').waitFor({ state: 'visible' });
    assert.equal(await hosted.locator('#phone-links a[href*="syncselect"]').count(), 1);
    assert.equal(await hosted.locator('#open-calendar').getAttribute('href'), 'https://calendar.google.com/calendar/r/settings/addbyurl');
    assert.equal(await hosted.locator('#prayer-list li').count(), 5);
    assert.equal(await hosted.locator('#feed-url').inputValue(), 'https://salat.example/mawaqit-cal/' + original.feed);
    await hosted.locator('[data-provider="apple"]').click();
    assert.equal(await hosted.locator('#open-calendar').getAttribute('href'), 'webcal://salat.example/mawaqit-cal/' + original.feed);
    assert.equal(await hosted.locator('#local-warning').isVisible(), false);
    await hosted.locator('#confirmed').check();
    await hosted.locator('.mosque-option').nth(1).focus();
    await hosted.keyboard.press('Enter');
    assert.equal(await hosted.locator('#mosque-name').textContent(), second.name);
    assert.equal(await hosted.locator('#mosque-name img').count(), 0);
    assert.equal(await hosted.locator('#confirmed').isChecked(), false);
    assert.equal(await hosted.evaluate(() => document.activeElement.dataset.mosqueId), 'other');
    assert.match(hosted.url(), /mosque=other/);

    for (const requested of ['unavailable', '']) {
      const p = await scenario({ version: 1, mosques: [original, second] });
      await p.goto('http://127.0.0.1:8766/?mosque=' + requested + '&lang=en');
      await p.locator('#app').waitFor({ state: 'visible' });
      assert.equal(await p.locator('#selection-notice').isVisible(), true);
      assert.equal(await p.locator('#preview-panel').isVisible(), false);
      assert.equal(await p.locator('#subscribe-panel').isVisible(), false);
      assert.equal(await p.locator('#phone-panel').isVisible(), false);
      assert.equal(await p.locator('.mosque-option[aria-pressed="true"]').count(), 0);
      assert.equal(new URL(p.url()).searchParams.get('mosque'), requested);
      await p.locator('#language').selectOption('ar');
      assert.equal(new URL(p.url()).searchParams.get('lang'), 'ar');
      assert.equal(await p.locator('#selection-notice').isVisible(), true);
      assert.equal(new URL(p.url()).searchParams.get('mosque'), requested);
      await p.locator('.mosque-option').nth(1).click();
      assert.equal(await p.locator('#selection-notice').isVisible(), false);
      assert.equal(await p.locator('#preview-panel').isVisible(), true);
      assert.equal(new URL(p.url()).searchParams.get('mosque'), second.id);
      assert.equal(await p.locator('#feed-url').inputValue(), 'http://127.0.0.1:8766/other.ics');
      await p.close();
    }

    const reload = await scenario({ version: 1, mosques: [original, second] });
    await reload.goto('http://127.0.0.1:8766/?mosque=other&lang=en');
    await reload.locator('#app').waitFor({ state: 'visible' });
    assert.equal(await reload.locator('#mosque-name').textContent(), second.name);
    await reload.close();

    // Reuse the last successful snapshot after a missed daily refresh. The
    // second following local day still needs five prayers in the preview.
    const previewDates = [...new Set(original.events.map(event => event.date))];
    assert.equal(previewDates.length, 3);
    const thirdDay = original.events.find(event => event.date === previewDates[2]);
    const missed = await scenario({ version: 1, mosques: [original] });
    await missed.clock.install({ time: new Date(thirdDay.start) });
    await missed.goto('http://127.0.0.1:8766/?lang=en');
    await missed.locator('#app').waitFor({ state: 'visible' });
    assert.equal(await missed.locator('#prayer-list li').count(), 5);
    assert.equal(await missed.locator('#no-times').isVisible(), false);
    const subscription = await missed.locator('#feed-url').inputValue();
    await missed.clock.setSystemTime(new Date(new Date(thirdDay.start).getTime() + 36 * 60 * 60 * 1000));
    await missed.clock.fastForward(60_000);
    assert.equal(await missed.locator('#no-times').isVisible(), true);
    assert.equal(await missed.locator('#stale').isVisible(), true);
    assert.equal(await missed.locator('#subscribe-panel').isVisible(), true);
    assert.equal(await missed.locator('#feed-url').inputValue(), subscription);
    for (const [lang, previewWord, subscriptionWord] of [
      ['fr', 'aperçu', 'abonnement'], ['en', 'preview', 'subscription'], ['ar', 'معاينة', 'اشتراك'],
    ]) {
      await missed.locator('#language').selectOption(lang);
      const notice = await missed.locator('#no-times').textContent();
      assert.ok(notice.includes(previewWord) && notice.includes(subscriptionWord));
    }
    await missed.close();

    for (const [label, data, status] of [
      ['empty', { version: 1, mosques: [] }, 200],
      ['unavailable', {}, 503],
      ['invalid', { version: 1, mosques: [{ id: 'bad' }] }, 200],
      ['stale', { version: 1, mosques: [{ ...original, source_fetched_at: '2020-01-01T00:00:00Z' }] }, 200],
      ['missing-day', { version: 1, mosques: [{ ...original, events: [] }] }, 200],
    ]) {
      const p = await scenario(data, status);
      await p.goto('http://127.0.0.1:8766/');
      if (label === 'stale' || label === 'missing-day') {
        await p.locator('#app').waitFor({ state: 'visible' });
        assert.equal(await p.locator(label === 'stale' ? '#stale' : '#no-times').isVisible(), true);
      } else {
        await p.waitForFunction(() => document.getElementById('load-status').textContent !== 'Chargement des mosquées…');
        assert.equal(await p.locator('#app').isVisible(), false);
        await p.locator('#language').selectOption('ar');
      }
      await p.close();
    }
    assert.deepEqual(errors, []);
    console.log('PASS: three-day preview after missed build and preview-only expiry messages in FR/EN/AR; desktop, 390/320px mobile, FR/EN/AR + RTL; Google syncselect and iPhone branch, Apple direct flow, Outlook work/school; unknown/empty mosque selection and explicit recovery; search, copy fallback, confirmation reset, keyboard focus, share URLs, production subpath/webcal, mosque-timezone day, escaped names, stale/missing/invalid/empty/error states; zero browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
