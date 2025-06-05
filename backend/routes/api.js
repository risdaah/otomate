const express = require('express');
const router = express.Router();

const kategoriController = require('../controllers/kategoriController');


router.get('/kategori', kategoriController.getAllKategori);


module.exports = router;
