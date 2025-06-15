const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder 'uploads' sudah ada
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // simpan di /uploads
  },
  filename: (req, file, cb) => {
    // Buat nama file unik: timestamp-namaasli
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  },
});

// Filter file (opsional): hanya gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;
