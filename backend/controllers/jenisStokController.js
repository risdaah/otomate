const { JenisStok } = require('../models');


exports.getAllJenisStok = async (req, res) => {
  try {
    const jenisStokList = await JenisStok.findAll();
    res.status(200).json(jenisStokList);
  } catch (error) {
    console.error('Error fetching pesanan:', error);
    res.status(500).json({ message: 'Failed to fetch pesanan' });
  }
};