const bcrypt = require('bcryptjs')
const { sequelize } = require('@core/db')
const { Sequelize, DataTypes } = require('sequelize')
const { BaseModel } = require('@model/BaseModel')

class UserModel extends BaseModel {
  
}

UserModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true
  },
  account: {
    type: Sequelize.STRING(32),
    unique: true
  },
  password: {
    type: Sequelize.STRING(60),
    set(val) {
      const salt = bcrypt.genSaltSync(10)
      const psw = bcrypt.hashSync(val, salt)
      this.setDataValue('password', psw)
    }
  },
  phone: {
    type: Sequelize.STRING(11),
    unique: true
  },
  email: {
    type: Sequelize.STRING(32),
    unique: true
  },
  nickname: Sequelize.STRING(100),
  
}, { sequelize, tableName: 'user' })

module.exports = { UserModel }