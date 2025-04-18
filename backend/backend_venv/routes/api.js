const express = require('express');
const router  = express.Router();
const { Monster } = require('../database/models');

// GET /api/monsters
router.get('/monsters', async (req, res, next) => {
  try {
    const monsters = await Monster.findAll({
      attributes: ['id', 'name', 'image_filename'],
      order: [['name', 'ASC']]
    });
    res.json(monsters);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
