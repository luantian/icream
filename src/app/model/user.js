const { sequelize } = require('@core/db')

const { Sequelize, Model, DataTypes } = require('sequelize')

class User extends Model {
  
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true
  },
  account: Sequelize.STRING(32),
  password: Sequelize.STRING(32),
  phone: Sequelize.STRING(11),
  email: {
    type: Sequelize.STRING(32),
    unique: true
  },
  nickname: Sequelize.STRING(100),
  
}, { sequelize, tableName: 'user' })

module.exports = { User }