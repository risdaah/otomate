const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('DetailPesanan', {
    id_detail_pesanan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pesanan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_produk: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'detail_pesanan',
    timestamps: false
  });
