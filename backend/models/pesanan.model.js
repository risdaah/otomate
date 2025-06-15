const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pesanan = sequelize.define('Pesanan', {
    id_pesanan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_supplier: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
    catatan:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'pesanan',
    timestamps: false,
  });

  return Pesanan;
};
