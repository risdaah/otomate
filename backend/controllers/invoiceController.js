
const { Invoice, Pesanan, sequelize } = require('../models');

const getAllInvoice = async (req, res) => {
  try {
    const invoiceList = await Invoice.findAll();
    res.status(200).json(invoiceList);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
};

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

const acceptPesanan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // invoice id
    const invoice = await Invoice.findByPk(id, { transaction: t });
    if (!invoice) {
      await t.rollback();
      return res.status(404).json({ message: 'Invoice not found' });
    }
    if (invoice.status !== 'unpaid') {
      await t.rollback();
      return res.status(400).json({ message: 'Invoice is not unpaid' });
    }

    // Update invoice status to 'paid'
    invoice.status = 'paid';
    await invoice.save({ transaction: t });

    // Find related pesanan
    const pesanan = await Pesanan.findByPk(invoice.id_pesanan, { transaction: t });
    if (!pesanan) {
      await t.rollback();
      return res.status(404).json({ message: 'Pesanan not found' });
    }
    if (pesanan.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ message: 'Pesanan is not pending' });
    }

    // Update pesanan status to 'accepted'
    pesanan.status = 'accepted';
    await pesanan.save({ transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Pesanan accepted and invoice paid successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error accepting pesanan:', error);
    res.status(500).json({ message: 'Failed to accept pesanan' });
  }
};

module.exports = {
  getAllInvoice,
  getInvoiceById,
  acceptPesanan}
  
  
