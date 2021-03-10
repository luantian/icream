const bcrypt = require('bcryptjs')
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
  password: {
    type: Sequelize.STRING(60),
    set(val) {
      const salt = bcrypt.genSaltSync(10)
      const psw = bcrypt.hashSync(val, salt)
      this.setDataValue('password', psw)
    }
  },
  phone: Sequelize.STRING(11),
  email: {
    type: Sequelize.STRING(32),
    unique: true
  },
  nickname: Sequelize.STRING(100),
  
}, { sequelize, tableName: 'user' })

module.exports = { User }