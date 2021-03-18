
const codeMessage = require('@core/codeMessage')

class HttpException extends Error {
  constructor(params = { msg: '服务器异常', code: 9999, status: 500 }) {
    super()
    this.code = params.code
    this.status = params.status
    this.msg = params.msg
  }
}

class DevParameterException extends HttpException {
  constructor(data) {
    super()
    this.status = this.code = 400
    this.msg = codeMessage[this.code]
    this.data = data
  }
}

class ParameterException extends HttpException {
  constructor(code = 400, msg = '') {
    super()
    this.status = 400
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

class Success extends HttpException {
  constructor(data) {
    super()
    this.status = 200
    this.code = 200
    this.msg = codeMessage[this.code]
    this.data = data
  }
}

class NotFound extends HttpException {
  constructor(code = 404, msg = '') {
    super()
    this.status = 404
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

class AuthFailed extends HttpException {
  constructor(code = 401, msg = '') {
    super()
    this.status = 401
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

class Forbbiden extends HttpException {
  constructor(code = 403, msg = '') {
    super()
    this.status = 403
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

class ToolException extends HttpException {
  constructor(code = 10500, msg = '') {
    super()
    this.status = 400
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

class ExistException extends HttpException {
  constructor(code = 11001, msg = '') {
    super()
    this.status = 400
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

class TokenException extends HttpException {
  constructor(code = 11007, msg = '') {
    super()
    this.status = 401
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

module.exports = {
  HttpException, DevParameterException, ParameterException, Success, NotFound,
  AuthFailed, Forbbiden, ToolException, ExistException, TokenException
}
