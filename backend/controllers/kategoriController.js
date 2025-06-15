const db = require('../models');
const Kategori = db.Kategori;

exports.getAllKategori = async (req, res) => {
  try {
    const data = await Kategori.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    if (!nama_kategori) {
      return res.status(400).json({ error: 'nama kategori is required' });
    }
    const newKategori = await Kategori.create({ nama_kategori });
    res.status(201).json(newKategori);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori } = req.body;
    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori not found' });
    }
    if (!nama_kategori) {
      return res.status(400).json({ error: 'nama kategori is required' });
    }
    kategori.nama_kategori = nama_kategori;
    await kategori.save();
    res.json(kategori);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori not found' });
    }
    await kategori.destroy();
    res.json({ message: 'Kategori deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori not found' });
    }
    res.json(kategori);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
