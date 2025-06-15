
const { Invoice, Pesanan, DetailPesanan, Produk, sequelize } = require('../models');


// get all invoice
const getAllInvoice = async (req, res) => {
  try {
    const invoiceList = await Invoice.findAll();
    res.status(200).json(invoiceList);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
};

// get all invoice with data pesanan by id_supplier
const getAllInvoiceBySupplier = async (req, res) => {
  try {
    const { id_supplier } = req.params;
    const invoiceList = await Invoice.findAll({
      include: [
        {
          model: Pesanan,
          where: { id_supplier },
          include: [
            {
              model: DetailPesanan,
              attributes: ['id_detail_pesanan', 'id_pesanan', 'id_produk', 'jumlah', 'harga', 'created_at'],
              include: [
                {
                  model: Produk,
                  attributes: ['id_produk','nama']
                }
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json({ success: true, data: invoiceList });
  } catch (error) {
    console.error('Error fetching invoices by supplier:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoices by supplier' });
  }
};

// get all invoice by id
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice by id:', error);
    res.status(500).json({ message: 'Failed to fetch invoice' });
  }
};

// accept pesanan
const acceptPesanan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ where: { id_pesanan: id }, transaction: t });
    if (!invoice || invoice.status !== 'unpaid') {
      await t.rollback();
      return res.status(404).json({ message: 'Invoice not found or already paid' });
    }

    invoice.status = 'paid';
    await invoice.save({ transaction: t });

    const pesanan = await Pesanan.findByPk(id, { transaction: t });
    if (!pesanan || pesanan.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ message: 'Pesanan is not pending or not found' });
    }

    pesanan.status = 'accepted';
    await pesanan.save({ transaction: t });

    await t.commit();
    res.status(200).json(pesanan);
  } catch (error) {
    await t.rollback();
    console.error('Error accepting pesanan:', error);
    res.status(500).json({ message: 'Failed to accept pesanan' });
  }
};

// reject pesanan
const rejectPesanan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ where: { id_pesanan: id }, transaction: t });
    if (!invoice || invoice.status !== 'unpaid') {
      await t.rollback();
      return res.status(404).json({ message: 'Invoice not found or not unpaid' });
    }

    invoice.status = 'unpaid'; // tetap unpaid
    await invoice.save({ transaction: t });

    const pesanan = await Pesanan.findByPk(id, { transaction: t });
    if (!pesanan || pesanan.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ message: 'Pesanan is not pending or not found' });
    }

    pesanan.status = 'rejected';
    await pesanan.save({ transaction: t });

    await t.commit();
    res.status(200).json(pesanan);
  } catch (error) {
    await t.rollback();
    console.error('Error rejecting pesanan:', error);
    res.status(500).json({ message: 'Failed to reject pesanan' });
  }
};

module.exports = {
  getAllInvoice,
  getInvoiceById,
  acceptPesanan,
  rejectPesanan,
  getAllInvoiceBySupplier}
  
  
