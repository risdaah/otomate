const { Pesanan, DetailPesanan, Produk, Supplier, Invoice } = require('../models');
const { Sequelize } = require('sequelize');

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

const getCostPesanan  = async (req, res) => {
  try {
    // Sum the total field of Pesanan where status is 'accepted'
    const totalCost = await Pesanan.sum('total', { where: { status: 'accepted' } });
    res.status(200).json({ totalCost });
  } catch (error) {
    console.error('Error calculating total cost of accepted pesanan:', error);
    res.status(500).json({ message: 'Failed to calculate total cost' });
  }
};


// data untuk grafik line chart
const getDailyCostData = async (req, res) => {
  try {
    // Get date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // last 7 days including today

    // Query total cost grouped by date for last 7 days where status is 'accepted'
    const dailyCosts = await Pesanan.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'totalCost']
      ],
      where: {
        status: 'accepted',
        created_at: {
          [Sequelize.Op.gte]: sevenDaysAgo
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
    });

    // Format response as array of { date: 'YYYY-MM-DD', totalCost: number }
    const formatted = dailyCosts.map(item => ({
      date: item.getDataValue('date'),
      totalCost: parseFloat(item.getDataValue('totalCost'))
    }));

    // Fill missing dates with 0 totalCost
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      const found = formatted.find(f => f.date === dateString);
      result.push({
        date: dateString,
        totalCost: found ? found.totalCost : 0
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching daily cost data:', error);
    res.status(500).json({ message: 'Failed to fetch daily cost data' });
  }
};


const countPesananBySupplierId = async (req, res) => {
  try {
    const { id_supplier } = req.params;
    const count = await Pesanan.count({ where: { id_supplier } });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting pesanan by supplier id:', error);
    res.status(500).json({ message: 'Failed to count pesanan' });
  }
};


const countPesananBySupplierIdAccepted = async (req, res) => {
  try {
    const { id_supplier } = req.params;
    const count = await Pesanan.count({ where: { id_supplier, status: 'accepted' } });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting accepted pesanan by supplier id:', error);
    res.status(500).json({ message: 'Failed to count accepted pesanan' });
  }
};

const countTotalRevenueBySupplierId = async (req, res) => {
  try {
    const { id_supplier } = req.params;
    const totalRevenue = await Pesanan.sum('total', { where: { id_supplier, status: 'accepted' } });
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error('Error calculating total revenue by supplier id:', error);
    res.status(500).json({ message: 'Failed to calculate total revenue' });
  }
};

const getDataRevenue = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

const getDailyRevenueBySupplierId = async (req, res) => {
  try {
    const { id_supplier } = req.params;

    if (!id_supplier) {
      return res.status(400).json({ message: 'Supplier ID is required' });
    }

    // Calculate date 6 days ago to cover last 7 days including today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Query Pesanan grouped by date with sum of total for accepted status and given supplier
    const dailyRevenue = await Pesanan.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'totalRevenue']
      ],
      where: {
        id_supplier,
        status: 'accepted',
        created_at: {
          [Sequelize.Op.gte]: sevenDaysAgo
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
    });

    // Format the result to map dates and totalRevenue
    const formatted = dailyRevenue.map(item => ({
      date: item.getDataValue('date'),
      totalRevenue: parseFloat(item.getDataValue('totalRevenue'))
    }));

    // Fill missing dates with 0 totalRevenue
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      const found = formatted.find(f => f.date === dateString);
      result.push({
        date: dateString,
        totalRevenue: found ? found.totalRevenue : 0
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching daily revenue by supplier id:', error);
    res.status(500).json({ message: 'Failed to fetch daily revenue data', error: error.message });
  }
};

module.exports = {
  getAllPesanan,
  getPesananById,
  createPesanan,
  deletePesanan,
  getAllPesananWithDetails,
  getPesananWithDetailsBySupplierId,
  getCostPesanan,
  countPesananBySupplierId,
  countPesananBySupplierIdAccepted,
  countTotalRevenueBySupplierId,
  getDailyCostData,
  getDailyRevenueBySupplierId
}
  


