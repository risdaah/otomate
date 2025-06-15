module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('bengkel', 'supplier'),
      allowNull: false,
      defaultValue: 'bengkel',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    personal_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user',
    timestamps: false,
  });

  return User;
};

    // reset_password_token: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    // },
    // reset_password_expires: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },