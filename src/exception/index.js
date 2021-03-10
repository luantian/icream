const { HttpException } = require('@exception/HttpException')
const { BaseError } = require('sequelize')

const Enum = require('@utils/Enum')

// 判断错误类型
const decideErrorType = (error ) => {
  let errorType = ''

  // http级别异常
  if (error instanceof HttpException) errorType = Enum.error.Http

  // 数据库级别异常
  if (error instanceof BaseError) errorType = Enum.error.Sequelize

  console.log('=======================================')
  console.log('异常类型: ', errorType)
  console.log('=======================================')

  return errorType
}

// 判断是否是开发环境，选择性抛出 error
const decideEnvironment = (errorType) => {
  return (
    global.config.environment === Enum.environment.dev
    && errorType !== Enum.error.Http
    && errorType !== Enum.error.Sequelize
  )
}

// 手动抛出的异常和成功返回结果
const forceOrSuccess = (ctx, error) => {
  ctx.body = {
    code: error.code,
    data: error.data || {},
    msg: error.msg
  }
  ctx.status = error.status
}

// 数据库级别异常返回结果
const dbException = (ctx, status = 500) => {
  ctx.body = {
    code: 9999,
    msg: '数据库级别异常，请联系管理员'
  }
  ctx.status = status
}

// 系统级异常返回结果
const sysException = (ctx, status = 500) => {
  ctx.body = {
    code: 9999,
    msg: '服务器异常，未知错误，请记录操作，反馈管理员'
  }
  ctx.status = status
}

// 全局异常捕获函数
const catchError = async (ctx, next) => {

  try {
    await next()
  } catch (error) {

    let errorType = decideErrorType(error)

    if (decideEnvironment(errorType)) throw error

    switch (errorType) {
      case Enum.error.Http:
        forceOrSuccess(ctx, error)
        break
      case Enum.error.Sequelize:
        dbException(ctx)
        break
      default:
        sysException(ctx)
    }
  }
}

module.exports = catchError