const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const JenisStok = sequelize.define('JenisStok', {
    id_jenis_stok: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    jenis: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'jenis_stok',
    timestamps: false
  });

  return JenisStok;
};
