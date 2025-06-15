module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const DetailBengkel = sequelize.define('DetailBengkel', {
    id_detail_bengkel: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    telp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'detail_bengkel',
    timestamps: false,
  });

  return DetailBengkel;
};
