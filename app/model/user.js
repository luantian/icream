const { sequelize } = require('@core/db')

const { Sequelize, Model } = require('sequelize')

class User extends Model {
  getName () {
    return 'terence'
  }
}

User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  account: Sequelize.STRING(32),
  password: Sequelize.STRING(32),
  nickname: Sequelize.STRING(100),
  email: {
    type: Sequelize.STRING(32),
    unique: true
  },
  
}, { sequelize, tableName: 'user' })

module.exports = { User }