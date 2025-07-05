// services/UserService.js
const { User } = require('../database/models');
const { Op } = require('sequelize');

async function deleteInactiveUsers() {
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const deleted = await User.destroy({
    where: {
      last_activity: { [Op.lt]: threeYearsAgo }
    }
  });

  console.log(`🧹 ${deleted} user(s) supprimé(s) pour inactivité`);
}

module.exports = { deleteInactiveUsers };
