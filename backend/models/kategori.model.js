const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Kategori', {
    id_kategori: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_kategori: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'kategori',
    timestamps: false
  });
