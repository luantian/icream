const {HttpException} = require('@core/HttpException')

const catchError = async (ctx, next)=>{
  try {
    await next()
  } catch (error) {
    // 开发环境
    // 生产环境
    // 开发环境 不是 HttpException
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'
    
    if(isDev && !isHttpException){
      throw error
    }
    
    if(isHttpException) {
      ctx.body = {
        code: error.code,
        data: error.data || null,
        msg: error.msg
      }
      ctx.status = error.status
    } else {
      ctx.body = {
        code: 9999,
        msg: '服务器错误'
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError