
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const User = db.User;
const DetailBengkel = db.DetailBengkel;
const Supplier = db.Supplier;
const sequelize = db.sequelize;

// register/add new admin bengkel
exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nama, email, password, alamat, telp } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role 'bengkel' and status 'active'
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: 'bengkel',
      status: 'active',
    }, { transaction: t });

    // Create detail_bengkel linked to user
    await DetailBengkel.create({
      id_user: newUser.id_user,
      nama,
      alamat,
      telp,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ message: 'Admin bengkel registered successfully', userId: newUser.id_user });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

// register/add new user supplier
exports.registerSupplier = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nama, email, password, telp } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role 'supplier' and status 'active'
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: 'supplier',
      status: 'active',
    }, { transaction: t });

    // Create supplier linked to user
    await Supplier.create({
      id_user: newUser.id_user,
      nama_supplier: nama,
      telp,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ message: 'Supplier registered successfully', userId: newUser.id_user });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

// login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.personal_token = token;
    await user.save();

    // ambil detail berdasarkan role
    let detail = null;

    if (user.role === "bengkel") {
      detail = await DetailBengkel.findOne({
        where: { id_user: user.id_user },
        attributes: ['id_detail_bengkel', 'nama', 'alamat', 'telp']
      });
    } else if (user.role === "supplier") {
      detail = await Supplier.findOne({
        where: { id_user: user.id_user },
        attributes: ['id_supplier', 'nama_supplier', 'telp']
      });
    }

    return res.status(200).json({
      message: "Login successful",
      personal_token: token,
      role: user.role,
      user: {
        id_user: user.id_user,
        email: user.email,
        role: user.role,
        detail: detail
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// logout user
exports.logout = async (req, res) => {
  try {
    const personalToken = req.headers['authorization'];

    if (!personalToken) {
      return res.status(400).json({ error: 'Authorization token is required' });
    }

    const user = await User.findOne({ where: { personal_token: personalToken } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    user.personal_token = null;
    await user.save();
    console.log("Token cleared for user:", user.email);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// delete user and related supplier data if role is supplier
exports.deleteUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!id) {
      await t.rollback();
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findOne({ where: { id_user: id } });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    // Jika user adalah supplier, hapus juga datanya dari tabel Supplier
    if (user.role === 'supplier') {
      await Supplier.destroy({ where: { id_user: id }, transaction: t });
    }

    // Hapus user
    await User.destroy({ where: { id_user: id }, transaction: t });

    await t.commit();
    res.status(200).json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('❌ Delete Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

  
// update user data and related supplier data if role is supplier
exports.updateUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // gunakan `id` sesuai dengan route
    const { nama, email, status, telp, password } = req.body;

    if (!id) {
      await t.rollback();
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!nama && !email && !status && !telp && !password) {
      await t.rollback();
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    const user = await User.findOne({ where: { id_user: id } });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields if provided
    if (nama) user.nama = nama;
    if (email) user.email = email;
    if (status) user.status = status;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save({ transaction: t });

    // Jika user adalah supplier, update juga datanya di tabel Supplier
    if (user.role === 'supplier') {
      const supplier = await Supplier.findOne({ where: { id_user: id } });
      if (supplier) {
        if (nama) supplier.nama_supplier = nama;
        if (telp) supplier.telp = telp;
        await supplier.save({ transaction: t });
      }
    }

    await t.commit();
    res.status(200).json({ message: 'User and related supplier updated successfully' });
  } catch (error) {
    await t.rollback();
    console.error('❌ Update Error:', error); // tampilkan error ke console
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
// lupa password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email, role: 'bengkel' } });
    if (!user) {
      return res.status(404).json({ error: 'User with this email and role bengkel not found' });
    }

    // Generate reset token and expiration (1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour from now

    user.reset_password_token = resetToken;
    user.reset_password_expires = new Date(resetExpires);
    await user.save();

    // TODO: Send email with resetToken to user.email (not implemented)

    res.status(200).json({ message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get jumlah supplier
exports.getSupplierCount = async (req, res) => {
  try {
    const count = await User.count({ where: { role: 'supplier' } });
    res.status(200).json({ totalSuppliers: count });
  } catch (error) {
    console.error('Error counting suppliers:', error);
    res.status(500).json({ message: 'Failed to count suppliers' });
  }
};







