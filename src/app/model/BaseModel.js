const { Model } = require('sequelize')

/**
 * 基于 Sequelize的 Model不能实例化，坑坑坑
 */
class BaseModel extends Model {

}

module.exports = { BaseModel }