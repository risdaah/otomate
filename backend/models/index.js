const { sequelize } = require('../config/db');

const Kategori = require('./kategori.model')(sequelize);

const db = {};
db.sequelize = sequelize;
db.Kategori = Kategori;

module.exports = db;
