const express = require('express');
const router = express.Router();
const MonsterService = require('../services/MonsterService');

router.get('/', async (req, res, next) => {
  try {
    const { total, filtered } = await MonsterService.getFilteredMonsters();
    console.log(`[GET /api/monsters] before : ${total} — after : ${filtered.length}`);
    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
