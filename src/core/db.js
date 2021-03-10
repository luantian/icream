const { Sequelize } = require('sequelize')

const { name, user, password, host, port } = require('@config').database


const sequelize = new Sequelize(name, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: 'createTime',
    updatedAt: 'updateTime',
    deleteAt: 'deleteTime',
    underscored: true
  }
})

sequelize.sync({
  force: false
})

module.exports = {
  sequelize
}