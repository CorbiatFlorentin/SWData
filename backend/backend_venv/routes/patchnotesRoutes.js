const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

router.get('/patchnotes', async (req, res) => {
  try {
    const url = 'https://sw.com2us.com/fr/skyarena/news/list?category=update';
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const patchNotes = await page.evaluate(() => {
      const notes = [];
      document.querySelectorAll('strong.news_tit').forEach((el) => {
        const title = el.textContent.trim();
        const link = el.closest('a')?.href;
        if (title && link) notes.push({ title, link });
      });
      return notes;
    });

    await browser.close();
    res.json(patchNotes);
  } catch (err) {
    console.error('Error Puppeteer:', err.message);
    res.status(500).json({ error: 'Error while scrapping' });
  }
});

module.exports = router;
