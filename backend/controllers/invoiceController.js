
// Import pdfkit for PDF generation
const PDFDocument = require('pdfkit');
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
      console.error(`Invoice check failed for id_pesanan=${id}:`, invoice);
      await t.rollback();
      return res.status(404).json({ message: 'Invoice not found or already paid' });
    }

    invoice.status = 'paid';
    await invoice.save({ transaction: t });

    const pesanan = await Pesanan.findByPk(id, { transaction: t });
    if (!pesanan || pesanan.status !== 'pending') {
      console.error(`Pesanan check failed for id=${id}:`, pesanan);
      await t.rollback();
      return res.status(400).json({ message: 'Pesanan is not pending or not found' });
    }

    pesanan.status = 'accepted';
    await pesanan.save({ transaction: t });

    // Fetch DetailPesanan entries for the pesanan
    const detailPesananList = await DetailPesanan.findAll({
      where: { id_pesanan: id },
      transaction: t
    });

    // Update Produk stok for each DetailPesanan
    for (const detail of detailPesananList) {
      const produk = await Produk.findByPk(detail.id_produk, { transaction: t });
      if (produk) {
        produk.stok += detail.jumlah;
        await produk.save({ transaction: t });
      }
    }

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
  getAllInvoiceBySupplier,
  
  // New method to generate and send invoice PDF
  downloadInvoicePDF: async (req, res) => {
    try {
      const { id } = req.params;
      // Try to find invoice by id_invoice first
      let invoice = await Invoice.findByPk(id, {
        include: [
          {
            model: Pesanan,
            include: [
              {
                model: DetailPesanan,
                include: [Produk]
              }
            ]
          }
        ]
      });
      // If not found, try to find invoice by id_pesanan
      if (!invoice) {
        invoice = await Invoice.findOne({
          where: { id_pesanan: id },
          include: [
            {
              model: Pesanan,
              include: [
                {
                  model: DetailPesanan,
                  include: [Produk]
                }
              ]
            }
          ]
        });
      }
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      // Create a new PDF document
      const doc = new PDFDocument();

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice_${id}.pdf`);

      // Pipe PDF document to response
      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text(`Invoice #${invoice.id_invoice}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Customer Name: ${invoice.customer_name || 'Bengkel Nugraha Jaya'}`);
      doc.text(`Date: ${invoice.created_at.toLocaleDateString()}`);
      doc.text(`Status: ${invoice.status}`);
      doc.moveDown();

      doc.text('Order Details:', { underline: true });
      doc.moveDown(0.5);

      const details = invoice.Pesanan?.DetailPesanans || [];
      details.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.Produk?.nama || 'Unknown Product'} - Qty: ${item.jumlah} - Price: Rp ${Number(item.harga).toLocaleString('id-ID')}`
        );
      });

      doc.moveDown();
      doc.text(`Total: Rp ${Number(invoice.Pesanan?.total || 0).toLocaleString('id-ID')}`, { bold: true });

      // Finalize PDF and end the stream
      doc.end();
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      res.status(500).json({ message: 'Failed to generate invoice PDF' });
    }
  }
};
  
  
