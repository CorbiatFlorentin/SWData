const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();
const { Monster } = require('../database/models');

const ICON_DIR   = path.join(__dirname, '..', 'database', 'monsters_icons');
const LATIN_ONLY = /^[A-Za-z0-9 .’\-]+$/; 
const ANGELMON = /angelmon/i    

router.get('/', async (req, res, next) => {
  try {
    const raws = await Monster.findAll({
      where      : { awaken_level: 1 },
      attributes : ['id', 'name', 'image_filename'],
      order      : [['name', 'ASC']]
    });

    const totalAvantFiltrage = raws.length;

    /** Dupe killer  */
    const seenNames = new Set();

    const monsters = raws.reduce((acc, m) => {
      if (!LATIN_ONLY.test(m.name)) return acc; 
      if (ANGELMON.test(m.name)) return acc;           
      if (seenNames.has(m.name)) return acc;               
      const iconPath = path.join(ICON_DIR, m.image_filename);
      if (!fs.existsSync(iconPath)) return acc;           

      seenNames.add(m.name);
      acc.push({
        id   : m.id,
        name : m.name,
        img  : `/static/monsters/${m.image_filename}`
      });
      return acc;
    }, []);

    console.log(`[GET /api/monsters] before : ${totalAvantFiltrage} — after : ${monsters.length}`);

    res.json(monsters);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
