const Sequelize = require('sequelize');

const sequelize = new Sequelize('chatapp','root','nodecomplete', {
    dialect: 'mysql', 
    host: 'localhost'
})

module.exports = sequelize;