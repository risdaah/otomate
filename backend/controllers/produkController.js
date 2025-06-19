const db = require('../models');
const Produk = db.Produk;
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const Kategori = db.Kategori; // untuk relasi get nama_kategori
const JenisStok = db.JenisStok; //untuk relasi get jenis
const Mobil = db.Mobil; // untuk relasi get nama_mobil

// GET semua produk + nama_kategori
const getAllProduk = async (req, res) => {
  try {
    const produkList = await Produk.findAll({
      include: [
        {
          model: Kategori,
          attributes: ['nama_kategori'],
        },
        {
          model: JenisStok,
          attributes: ['jenis'],
        },
        {
          model: Mobil,
          attributes: ['nama_mobil'],
        }
      ]
    });

    // flatten data kalau mau lebih rapi
    const response = produkList.map(p => ({
      id_produk: p.id_produk,
      id_kategori: p.id_kategori,
      id_mobil: p.id_mobil,
      id_jenis_stok: p.id_jenis_stok,
      nama: p.nama,
      stok: p.stok,
      harga: p.harga,
      created_at: p.created_at,
      nama_kategori: p.Kategori?.nama_kategori || null,
      jenis: p.JenisStok?.jenis || null,
      nama_mobil: p.Mobil?.nama_mobil || null
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching produk:', error);
    res.status(500).json({ message: 'Failed to retrieve produk' });
  }
};


// GET produk berdasarkan ID
const getProdukById = async (req, res) => {
  try {
    const id = req.params.id;
    const produk = await Produk.findByPk(id);
    if (!produk) return res.status(404).json({ message: 'Produk not found' });
    res.status(200).json(produk);
  } catch (error) {
    console.error('Error fetching produk by ID:', error);
    res.status(500).json({ message: 'Failed to retrieve produk' });
  }
};

// POST buat produk baru
const createProduk = async (req, res) => {
  try {
    const {
      id_kategori,
      id_mobil,
      id_jenis_stok,
      nama,
      stok,
      harga
    } = req.body;

    const newProduk = await Produk.create({
      id_kategori,
      id_mobil,
      id_jenis_stok,
      nama,
      stok,
      harga
    });

    res.status(201).json(newProduk);
  } catch (error) {
    console.error("Error creating produk:", error);
    res.status(500).json({ error: "Failed to create produk" });
  }
};

// PUT update produk
const updateProduk = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      id_kategori,
      id_mobil,
      id_jenis_stok,
      nama,
      stok,
      harga
    } = req.body;

    const produk = await Produk.findByPk(id);
    if (!produk) return res.status(404).json({ message: 'Produk not found' });

    // Update data jika ada perubahan
    produk.id_kategori = id_kategori ?? produk.id_kategori;
    produk.id_mobil = id_mobil ?? produk.id_mobil;
    produk.id_jenis_stok = id_jenis_stok ?? produk.id_jenis_stok;
    produk.nama = nama ?? produk.nama;
    produk.stok = stok ?? produk.stok;
    produk.harga = harga ?? produk.harga;

    await produk.save();
    res.status(200).json(produk);
  } catch (error) {
    console.error('Error updating produk:', error);
    res.status(500).json({ message: 'Failed to update produk' });
  }
};

// DELETE produk
const deleteProduk = async (req, res) => {
  try {
    const id = req.params.id;
    const produk = await Produk.findByPk(id);
    if (!produk) return res.status(404).json({ message: 'Produk not found' });

    await produk.destroy();
    res.status(200).json({ message: 'Produk deleted successfully' });
  } catch (error) {
    console.error('Error deleting produk:', error);
    res.status(500).json({ message: 'Failed to delete produk' });
  }
};

module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const Kategori = sequelize.define('Kategori', {
    id_kategori: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_kategori: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'kategori',
    timestamps: false
  });

  return Kategori;
};


const getProdukCount = async (req, res) => {
  try {
    const count = await Produk.count();
    res.status(200).json({ totalProduk: count });
  } catch (error) {
    console.error('Error counting produk:', error);
    res.status(500).json({ message: 'Failed to count produk' });
  }
};

const getStockPerCategory = async (req, res) => {
  try {
    const stockData = await Produk.findAll({
      attributes: [
        'id_kategori',
        [Sequelize.fn('SUM', Sequelize.col('stok')), 'total_stok']
      ],
      include: [
        {
          model: Kategori,
          attributes: ['nama_kategori']
        }
      ],
      group: ['id_kategori', 'Kategori.id_kategori', 'Kategori.nama_kategori']
    });

    console.log('Stock data raw:', stockData);

    const response = stockData.map(item => ({
      id_kategori: item.id_kategori,
      nama_kategori: item.Kategori?.nama_kategori || 'Unknown',
      total_stok: parseInt(item.dataValues.total_stok, 10)
    }));

    console.log('Stock data response:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching stock per category:', error.stack || error);
    res.status(500).json({ message: 'Failed to retrieve stock per category' });
  }
};

module.exports = {
  getAllProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
  getProdukCount,
  getStockPerCategory
};
