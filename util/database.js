const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_complete', 'root', 'kirtimish.8383', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;