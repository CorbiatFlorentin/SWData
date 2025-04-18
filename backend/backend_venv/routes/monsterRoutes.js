const express = require('express');
const router  = express.Router();
const { Monster } = require('../database/models'); // <-- modèle Sequelize

// GET /api/monsters  →  liste complète
router.get('/', async (req, res, next) => {
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
