const { ParameterException, Success } = require('@httpException')
class UserService {
  static getUserName() {
    // throw new ParameterException()
    return 'user name is terence'
  }
}

module.exports = { UserService }