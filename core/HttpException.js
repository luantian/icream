
const codeMessage = require('@core/codeMessage')

class HttpException extends Error {
  constructor(params = {msg: '服务器异常', code: 10000, status: 400}) {
    super()
    this.code = params.code
    this.status = params.status
    this.msg = params.msg
  }
}

class DevParameterException  extends HttpException {
  constructor(data) {
    super()
    this.status = this.code = 400
    this.msg = codeMessage[this.code]
    this.data = data
  }
}

class ParameterException extends HttpException {
  constructor(code = 400) {
    super()
    this.status = 400
    this.msg = codeMessage[code]
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
  constructor(code = 404) {
    super()
    this.status = 404
    this.msg = codeMessage[code]
    this.code = code
  }
}

class AuthFailed extends HttpException {
  constructor(code = 401) {
    super()
    this.status = 401
    this.msg = codeMessage[code]
    this.code = code
  }
}

class Forbbiden extends HttpException {
  constructor(code = 403) {
    super()
    this.status = 403
    this.msg = codeMessage[code]
    this.code = code
  }
}

class ToolException extends HttpException {
  constructor(msg = '', code = 10500) {
    super()
    this.status = 400
    this.msg = msg || codeMessage[code]
    this.code = code
  }
}

module.exports = {
  HttpException,
  DevParameterException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden,
  ToolException
}
