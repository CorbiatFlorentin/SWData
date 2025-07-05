const fs = require('fs');
const path = require('path');
const { Monster } = require('../database/models');

const ICON_DIR = path.join(__dirname, '..', 'database', 'monsters_icons');
const LATIN_ONLY = /^[A-Za-z0-9 .’\-]+$/;
const ANGELMON = /angelmon/i;

const MonsterService = {
  async getFilteredMonsters() {
    const raws = await Monster.findAll({
      where: { awaken_level: 1 },
      attributes: ['id', 'name', 'image_filename'],
      order: [['name', 'ASC']]
    });

    const seenNames = new Set();

    const filtered = raws.reduce((acc, m) => {
      if (!LATIN_ONLY.test(m.name)) return acc;
      if (ANGELMON.test(m.name)) return acc;
      if (seenNames.has(m.name)) return acc;
      const iconPath = path.join(ICON_DIR, m.image_filename);
      if (!fs.existsSync(iconPath)) return acc;

      seenNames.add(m.name);
      acc.push({
        id: m.id,
        name: m.name,
        img: `/static/monsters/${m.image_filename}`
      });
      return acc;
    }, []);

    return { total: raws.length, filtered };
  }
};

module.exports = MonsterService;
