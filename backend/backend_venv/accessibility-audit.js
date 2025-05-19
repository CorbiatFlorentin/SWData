const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5000/api/patchnotes', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForSelector('pre', {
    timeout: 20000,
    visible: true
  });

  await page.addScriptTag({
    path: require.resolve('axe-core/axe.min.js')
  });

  const résultats = await page.evaluate(async () => {
    return await axe.run({
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    });
  });

  if (résultats.violations.length === 0) {
    console.log('✔ Aucune violation d’accessibilité détectée.');
  } else {
    console.log(`${résultats.violations.length} violation(s) d’accessibilité détectée(s) :\n`);
    résultats.violations.forEach((violation) => {
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
