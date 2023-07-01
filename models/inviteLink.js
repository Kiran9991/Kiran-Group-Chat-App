const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const InviteLink = sequelize.define('invitelink', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    inviteLink: Sequelize.STRING,
    sender: Sequelize.STRING,
    toUserId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER
  });
  
  module.exports = InviteLink;