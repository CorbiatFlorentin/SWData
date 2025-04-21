// routes/monsterRoutes.js
const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();
const { Monster } = require('../database/models');

const ICON_DIR   = path.join(__dirname, '..', 'database', 'monsters_icons');
const LATIN_ONLY = /^[A-Za-z0-9 .’\-]+$/; 
const ANGELMON = /angelmon/i    // mêmes filtres qu’avant

router.get('/', async (req, res, next) => {
  try {
    const raws = await Monster.findAll({
      where      : { awaken_level: 1 },
      attributes : ['id', 'name', 'image_filename'],
      order      : [['name', 'ASC']]
    });

    /** Memo pour éviter les doublons  */
    const seenNames = new Set();

    const monsters = raws.reduce((acc, m) => {
      if (!LATIN_ONLY.test(m.name)) return acc; 
      if (ANGELMON.test(m.name)) return acc;           // filtrage nom
      if (seenNames.has(m.name)) return acc;               // déjà pris
      const iconPath = path.join(ICON_DIR, m.image_filename);
      if (!fs.existsSync(iconPath)) return acc;            // icône manquante

      seenNames.add(m.name);
      acc.push({
        id   : m.id,
        name : m.name,
        img  : `/static/monsters/${m.image_filename}`
      });
      return acc;
    }, []);

    res.json(monsters);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
