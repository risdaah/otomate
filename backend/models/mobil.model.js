const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Mobil = sequelize.define('Mobil', {
    id_mobil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nama_mobil: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    merk: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    tableName: 'mobil',
    timestamps: false
  });

  return Mobil;
};
