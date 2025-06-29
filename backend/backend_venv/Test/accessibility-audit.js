const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/api/patchnotes', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForSelector('pre', {
    timeout: 100000,
    visible: true
  });

  const axePath = require.resolve('axe-core/axe.min.js');
  console.log('➡ Injection de axe-core depuis :', axePath);

  try {
    await page.addScriptTag({ path: axePath });
    console.log('✅ Script axe-core injecté.');
  } catch (err) {
    console.error('❌ Échec de l’injection de axe-core :', err);
    await browser.close();
    return;
  }

  const axeReady = await page.evaluate(() => typeof window.axe !== 'undefined');
  if (!axeReady) {
    console.error('❌ axe-core est introuvable dans le contexte de la page.');
    await page.screenshot({ path: 'debug-page.png' }); // Capture la page pour debug
    await browser.close();
    throw new Error('axe-core ne s’est pas chargé correctement dans la page');
  }

  const resultats = await page.evaluate(async () => {
    return await window.axe.run({
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    });
  });

  if (resultats.violations.length === 0) {
    console.log('✔ Aucune violation d’accessibilité détectée.');
  } else {
    console.log(`${esultats.violations.length} violation(s) détectée(s) :\n`);
    resultats.violations.forEach((violation) => {
      console.log(`Règle : ${violation.id}`);
      console.log(`Description : ${violation.description}`);
      console.log(`Documentation : ${violation.helpUrl}`);
      violation.nodes.forEach((node, i) => {
        console.log(`  ${i + 1}. Élément : ${node.html}`);
        console.log(`     Détail de l’échec : ${node.failureSummary}`);
      });
      console.log('');
    });
  }

  await browser.close();
})();
