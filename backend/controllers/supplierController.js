const db = require('../models');
const { Supplier, User } = require('../models');

// Controller function to get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await db.Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Failed to get suppliers' });
  }
};

// get suppliers and user
const getAllSupplierUsers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [
        {
          model: User,
          attributes: ['id_user', 'nama', 'email', 'role', 'status', 'created_at'],
          where: { role: 'supplier' },
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    console.error('Error fetching supplier users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier users',
    });
  }
};

module.exports = {
  getAllSuppliers,
  getAllSupplierUsers
};
