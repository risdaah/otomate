// const express = require('express');
// const router = express.Router();

// const kategoriController = require('../controllers/kategoriController');
// const userController = require('../controllers/userController');
// const supplierController = require('../controllers/supplierController');
// const produkController = require('../controllers/produkController');
// const pesananController = require('../controllers/pesananController');
// const invoiceController = require('../controllers/invoiceController');
// const authMiddleware = require('../middleware/authMiddleware');

// // Public routes (no auth)
// router.post('/register', userController.register);
// router.post('/register-supplier', userController.registerSupplier);
// router.post('/login', userController.loginAdmin);
// router.post('/login-supplier', userController.loginSupplier);
// router.post('/forgot-password', userController.forgotPassword);  // Added forgot password route

// // Protected routes (with auth)
// router.post('/logout', authMiddleware, userController.logoutAdmin);
// router.post('/logout-supplier', authMiddleware, userController.logoutSupplier);

// router.get('/supplier', authMiddleware, supplierController.getAllSuppliers);

// router.get('/kategori', authMiddleware, kategoriController.getAllKategori);
// router.get('/kategori/:id', authMiddleware, kategoriController.getKategoriById);
// router.post('/kategori', authMiddleware, kategoriController.createKategori);
// router.put('/kategori/:id', authMiddleware, kategoriController.updateKategori);
// router.delete('/kategori/:id', authMiddleware, kategoriController.deleteKategori);

// router.get('/produk', authMiddleware, produkController.getAllProduk);
// router.get('/produk/:id', authMiddleware, produkController.getProdukById);
// router.post('/produk', authMiddleware, produkController.createProduk);
// router.put('/produk/:id', authMiddleware, produkController.updateProduk);
// router.delete('/produk/:id', authMiddleware, produkController.deleteProduk);

// router.get('/pesanan', authMiddleware, pesananController.getAllPesanan);
// router.get('/pesanan/:id', authMiddleware, pesananController.getPesananById);
// router.post('/pesanan', authMiddleware, pesananController.createPesanan);
// router.delete('/pesanan/:id', authMiddleware, pesananController.deletePesanan);

// router.get('/invoice', authMiddleware, invoiceController.getAllInvoice);
// router.get('/invoice/:id', authMiddleware, invoiceController.getInvoiceById);
// router.post('/invoice/:id/acceptPesanan', authMiddleware, invoiceController.acceptPesanan);

// module.exports = router;
