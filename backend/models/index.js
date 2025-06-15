const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// Import semua model dan oper sequelize + DataTypes
const Kategori = require('./kategori.model')(sequelize, DataTypes);
const User = require('./user.model')(sequelize, DataTypes);
const DetailBengkel = require('./detailBengkel.model')(sequelize, DataTypes);
const Supplier = require('./supplier.model')(sequelize, DataTypes);
const Produk = require('./produk.model')(sequelize, DataTypes);
const Pesanan = require('./pesanan.model')(sequelize, DataTypes);
const Invoice = require('./invoice.model')(sequelize, DataTypes);
const DetailPesanan = require('./detail_pesanan.model')(sequelize, DataTypes);
const JenisStok = require('./jenis_stok.model')(sequelize, DataTypes);
const Mobil = require('./mobil.model')(sequelize, DataTypes);

// Definisikan relasi antar model jika ada
Produk.belongsTo(Kategori, { foreignKey: 'id_kategori' });
Produk.belongsTo(JenisStok, { foreignKey: 'id_jenis_stok' });
Produk.belongsTo(Mobil, { foreignKey: 'id_mobil' });
DetailPesanan.belongsTo(Produk, {foreignKey: 'id_produk'});
// Parent side (satu pesanan bisa punya banyak detail)
Pesanan.hasMany(DetailPesanan, {
  foreignKey: 'id_pesanan'
});
// Child side (tiap detail hanya punya satu pesanan)
DetailPesanan.belongsTo(Pesanan, {
  foreignKey: 'id_pesanan'
});
// untuk data rfq
Pesanan.belongsTo(Supplier, {foreignKey: 'id_supplier'});

// Add association between Invoice and Pesanan
Invoice.belongsTo(Pesanan, { foreignKey: 'id_pesanan' });
Pesanan.hasOne(Invoice, { foreignKey: 'id_pesanan' });

// untuk data supplier
Supplier.belongsTo(User, {foreignKey: 'id_user'});
User.hasOne(Supplier, { foreignKey: 'id_user' });



// Kumpulkan semua model dalam satu objek `db`
const db = {};

db.sequelize = sequelize;

db.Kategori = Kategori;
db.User = User;
db.DetailBengkel = DetailBengkel;
db.Supplier = Supplier;
db.Produk = Produk;
db.Pesanan = Pesanan;
db.Invoice = Invoice;
db.DetailPesanan = DetailPesanan;
db.JenisStok = JenisStok;
db.Mobil = Mobil;

module.exports = db;
