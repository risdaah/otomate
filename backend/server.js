const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // ✅ untuk resolve path dengan aman
const { connectDB } = require('./config/db');
const db = require('./models');

dotenv.config();

const app = express();

// ✅ Middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Middleware parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (gambar) dari folder 'uploads'
// contoh: http://localhost:5000/uploads/nama-gambar.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Register API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await db.sequelize.sync(); // kamu bisa pakai sync({ force: true }) kalau butuh reset

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal start server:', error);
  }
};

startServer();
