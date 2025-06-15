const { Mobil } = require('../models');


exports.getAllMobil = async (req, res) => {
  try {
    const mobilList = await Mobil.findAll();
    res.status(200).json(mobilList);
  } catch (error) {
    console.error('Error fetching pesanan:', error);
    res.status(500).json({ message: 'Failed to fetch pesanan' });
  }
};