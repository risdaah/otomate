const { Pesanan, DetailPesanan, Produk, Supplier, Invoice } = require('../models');


const getAllPesanan = async (req, res) => {
  try {
    const pesananList = await Pesanan.findAll();
    res.status(200).json(pesananList);
  } catch (error) {
    console.error('Error fetching pesanan:', error);
    res.status(500).json({ message: 'Failed to fetch pesanan' });
  }
};

const getPesananById = async (req, res) => {
  try {
    const { id } = req.params;
    const pesanan = await Pesanan.findByPk(id);
    if (!pesanan) {
      return res.status(404).json({ message: 'Pesanan not found' });
    }
    res.status(200).json(pesanan);
  } catch (error) {
    console.error('Error fetching pesanan by id:', error);
    res.status(500).json({ message: 'Failed to fetch pesanan' });
  }
};

//create pesanan
const createPesanan = async (req, res) => {
  console.log("📥 Incoming Body:", req.body);
  const t = await Pesanan.sequelize.transaction();
  try {
    const { id_user, id_supplier, products, catatan } = req.body;

    if (!id_user || !id_supplier || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const total = products.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

    const pesanan = await Pesanan.create({
      id_user,
      id_supplier,
      total,
      status: 'pending',
      catatan,
      created_at: new Date()
    }, { transaction: t });

    for (const item of products) {
      console.log('📦 Creating DetailPesanan:', {
        id_pesanan: pesanan.id, // pastikan ini cocok
        id_produk: item.id_produk,
        jumlah: item.jumlah,
        harga: item.harga
      });

      await DetailPesanan.create({
        id_pesanan: pesanan.id_pesanan,
        id_produk: item.id_produk,
        jumlah: item.jumlah,
        harga: item.harga,
        created_at: new Date()
      }, { transaction: t });
    }

    const invoice = await Invoice.create({
      id_pesanan: pesanan.id_pesanan,
      status: 'unpaid',
      created_at: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Pesanan created successfully',
      pesanan,
      invoice
    });

    console.log("✅ Pesanan berhasil dibuat:", pesanan);

  } catch (error) {
    await t.rollback();
    console.error('❌ Error creating pesanan:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ message: 'Failed to create pesanan', error: error.message });
  }
};


const deletePesanan = async (req, res) => {
  const t = await Pesanan.sequelize.transaction();
  try {
    const { id } = req.params;

    // Check if pesanan exists
    const pesanan = await Pesanan.findByPk(id);
    if (!pesanan) {
      return res.status(404).json({ message: 'Pesanan not found' });
    }

    // Delete related DetailPesanan entries
    await DetailPesanan.destroy({
      where: { id_pesanan: id },
      transaction: t
    });

    // Delete related Invoice entries
    await Invoice.destroy({
      where: { id_pesanan: id },
      transaction: t
    });

    // Delete the Pesanan
    await Pesanan.destroy({
      where: { id_pesanan: id },
      transaction: t
    });

    await t.commit();

    res.status(200).json({ message: 'Pesanan and related data deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting pesanan:', error);
    res.status(500).json({ message: 'Failed to delete pesanan' });
  }
};

const getAllPesananWithDetails = async (req, res) => {
  try {
    const pesananList = await Pesanan.findAll({
      include: [
        {
          model: Supplier, // include model Supplier
          attributes: ['nama_supplier'], // ambil hanya nama_supplier
        },
        {
          model: DetailPesanan,
          include: [
            {
              model: Produk,
              attributes: ['nama'], // ambil nama produk aja
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Flatten response
    const response = pesananList.map(p => ({
      id_pesanan: p.id_pesanan,
      id_user: p.id_user,
      id_supplier: p.id_supplier,
      total: p.total,
      status: p.status,
      catatan: p.catatan,
      nama_supplier: p.Supplier?.nama_supplier || null, // ambil dari relasi Supplier
      created_at: p.created_at,
      detail_pesanan: p.DetailPesanans.map(d => ({
        id_detail_pesanan: d.id_detail_pesanan,
        id_produk: d.id_produk,
        jumlah: d.jumlah,
        harga: d.harga,
        created_at: d.created_at,
        nama_produk: d.Produk?.nama || null
      }))
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching pesanan with details:', error);
    res.status(500).json({ message: 'Failed to retrieve pesanan with details' });
  }
};

// get all pesanan by id_supplier
const getPesananWithDetailsBySupplierId = async (req, res) => {
  try {
    const { id_supplier } = req.params;
    const pesananList = await Pesanan.findAll({
      where: { id_supplier },
      include: [
        { model: Supplier, attributes: ['nama_supplier'] },
        {
          model: DetailPesanan,
          include: [{ model: Produk, attributes: ['nama'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!pesananList || pesananList.length === 0) {
      return res.status(404).json({ message: 'Tidak ada pesanan untuk supplier ini' });
    }

    const response = pesananList.map(p => ({
      id_pesanan: p.id_pesanan,
      id_user: p.id_user,
      id_supplier: p.id_supplier,
      total: p.total,
      status: p.status,
      catatan: p.catatan,
      nama_supplier: p.Supplier?.nama_supplier || null,
      created_at: p.created_at,
      detail_pesanan: p.DetailPesanans.map(d => ({
        id_detail_pesanan: d.id_detail_pesanan,
        id_produk: d.id_produk,
        jumlah: d.jumlah,
        harga: d.harga,
        created_at: d.created_at,
        nama_produk: d.Produk?.nama || null
      }))
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pesanan berdasarkan supplier' });
  }
};


module.exports = {
  getAllPesanan,
  getPesananById,
  createPesanan,
  deletePesanan,
  getAllPesananWithDetails,
  getPesananWithDetailsBySupplierId
}
  


