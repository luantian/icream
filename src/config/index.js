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
  },
  security: {
    secretKey: 'abcdefg',
    accessExp: 60 * 60 * 2,
    refreshExp: 60 * 60 * 24 * 30
  },
}

module.exports = config