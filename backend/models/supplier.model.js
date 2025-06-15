module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const Supplier = sequelize.define('Supplier', {
    id_supplier: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama_supplier: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: 'supplier',
    timestamps: false,
  });

  return Supplier;
};
