
const Enum = require('@enum')

const config = {
  // prod
  environment: Enum.environment.dev,
  database:{
    dbName:'7yue',
    host:'localhost',
    port:3306,
    user:'root',
    password:'123456',
  },
  host:'http://localhost:3000/'
}

module.exports = config