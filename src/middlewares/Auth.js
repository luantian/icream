class Auth {
  get m() {
    return async (ctx, next) => {
      await next()
    }
  }
}

module.exports = Auth
