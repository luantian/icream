const Enum = {
  environment: {
    dev: 'dev',
    prod: 'prod'
  },
  error: {
    Http: 'http',
    Sequelize: 'Sequelize'
  },
  apiVersion: {
    v1: 'v1',
    v2: 'v2'
  },
  BaseControllerName: 'BASE',
  role: {
    ALL: 1,
    USER: 8,
    ADMIN: 16,
    SUPER_ADMIN: 32
  }
}

module.exports = Enum
