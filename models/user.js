const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    phoneNumber: Sequelize.DOUBLE,
    password: Sequelize.STRING,
  });
  
  module.exports = User;