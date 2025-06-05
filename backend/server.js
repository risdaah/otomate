const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const db = require('./models');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await db.sequelize.sync(); // atau sync({ force: true }) untuk drop-create ulang
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
