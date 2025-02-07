const axe = require('axe-core');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to the page and wait for the DOM to be loaded
  await page.goto('http://localhost:5000/api/patchnotes', { waitUntil: 'domcontentloaded' });

  // Log the page content for debugging
  const pageContent = await page.content();
  console.log(pageContent); // Check if the content is loading properly

  // Wait for a different selector or the page itself to load
  await page.waitForSelector('.articles-container', { timeout: 20000, visible: true });

  // Inject and run axe-core
  const results = await page.evaluate(async () => {
    return await axe.run({
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'] // Test criteria
      }
    });
  });

  // Display violations
  console.log('Detected Errors:', results.violations);

  await browser.close();
})();
