
const Enum = require('@utils/Enum')

const config = {
  // prod
  environment: Enum.environment.dev,
  apiDocPath: '/static/doc',
  database: {
    name: 'icream',
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '08240621'
  }
}

module.exports = config