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
