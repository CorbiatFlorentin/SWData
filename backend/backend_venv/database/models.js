const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'mydatabase.db'),
  logging: false
});

const Monster = sequelize.define('Monster', {
  id:             { type: DataTypes.INTEGER, primaryKey: true },
  name:           DataTypes.TEXT,
  image_filename: DataTypes.TEXT
}, {
  tableName: 'monsters',
  timestamps: false
});

module.exports = { sequelize, Monster };
