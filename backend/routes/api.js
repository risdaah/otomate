const express = require('express');
const router = express.Router();


const kategoriController = require('../controllers/kategoriController');
const userController = require('../controllers/userController');
const supplierController = require('../controllers/supplierController');
const produkController = require('../controllers/produkController');
const pesananController = require('../controllers/pesananController');
const invoiceController = require('../controllers/invoiceController');
const mobilController = require('../controllers/mobilController');
const jeniStokController = require('../controllers/jenisStokController');
const roleMiddleware = require('../middlewares/roleMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Public routes
router.post('/register', userController.register);
router.post('/register-supplier', userController.registerSupplier);
router.post('/login', userController.login);       // Unified login
router.post('/logout', userController.logout);     // Unified logout
router.post('/forgot-password', userController.forgotPassword);


// suplier
router.get('/supplier', supplierController.getAllSuppliers);
router.get('/supplier-user', supplierController.getAllSupplierUsers);
router.delete('/supplier/:id', userController.deleteUser);
router.put('/supplier/:id', userController.updateUser);
router.get('/supplier-count', userController.getSupplierCount);

// kategori
router.get('/kategori', kategoriController.getAllKategori);
router.get('/kategori/:id', kategoriController.getKategoriById);
router.post('/kategori', kategoriController.createKategori);
router.put('/kategori/:id', kategoriController.updateKategori);
router.delete('/kategori/:id', kategoriController.deleteKategori);
router.get('/kategori-count', kategoriController.getKategoriCount);

// produk
router.get('/produk', produkController.getAllProduk);
router.get('/produk-count', produkController.getProdukCount);
router.get('/produk-stock-per-kategori', produkController.getStockPerCategory);
router.get('/produk/:id', produkController.getProdukById);
router.post('/produk', produkController.createProduk);
router.put('/produk/:id', produkController.updateProduk);
router.delete('/produk/:id', produkController.deleteProduk);

// pesanan
router.get('/pesanan', pesananController.getAllPesanan);
router.get('/pesanan/:id', pesananController.getPesananById);
router.post('/pesanan', pesananController.createPesanan);
router.delete('/pesanan/:id', pesananController.deletePesanan);
router.get('/pesanan-detail', pesananController.getAllPesananWithDetails);
router.get('/pesanan-detail/:id_supplier', pesananController.getPesananWithDetailsBySupplierId);
router.get('/total-count', pesananController.getCostPesanan);

// dashboard supplier
router.get('/pesanan-count/:id_supplier', pesananController.countPesananBySupplierId);
router.get('/pesanan-count-accepted/:id_supplier', pesananController.countPesananBySupplierIdAccepted);
router.get('/pesanan-total-revenue/:id_supplier', pesananController.countTotalRevenueBySupplierId);
router.get('/invoice-count/:id_supplier', invoiceController.countInvoiceBySupplierId);
router.get('/daily-cost-data', pesananController.getDailyCostData);
router.get('/pesanan/daily-revenue/:id_supplier', pesananController.getDailyRevenueBySupplierId);

// invoice
router.get('/invoice', invoiceController.getAllInvoice);
router.get('/invoice/:id', invoiceController.getInvoiceById);
router.get('/invoice-pesanan/:id_supplier', invoiceController.getAllInvoiceBySupplier);
router.post('/invoice/:id/acceptPesanan', invoiceController.acceptPesanan);
router.post('/invoice/:id/rejectPesanan', invoiceController.rejectPesanan);

// New route for downloading invoice PDF
router.get('/invoice/:id/download', invoiceController.downloadInvoicePDF);

// mobil
router.get('/mobil', mobilController.getAllMobil);

// jenis stok
router.get('/jenis-stok', jeniStokController.getAllJenisStok);

module.exports = router;
