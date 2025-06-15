module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const Produk = sequelize.define('Produk', {
    id_produk: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_kategori: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_mobil: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_jenis_stok: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    stok: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    harga: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'produk',
    timestamps: false,
  });

  return Produk;
};
