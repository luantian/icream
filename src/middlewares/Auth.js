const jwt = require('jsonwebtoken')
const { Forbbiden, TokenException } = require('@httpException')
const Enum = require('../utils/Enum')

class Auth {
  
  constructor(role = Enum.role.ALL) {
    this.role = role
  }

  get m() {
    return async (ctx, next) => {

      /**
       * 不验证用户身份，直接通过( 如何 注册，登录接口 )
       */
      if ( this.role === Enum.role.ALL ) await next()

      /**
       * 获取用户 token，并解析用户身份信息
       * userToken 保存着用户id(uid) 用户角色(role)
       */
      const userToken = this.parseToken(ctx)

      /**
       * 如何当前用户的角色值 小于 接口配置的角色 返回 权限不足
       */
      if ( userToken.role < this.role ) throw new Forbbiden()

      /**
       * 权限足够，并将userToken挂载在ctx上下文中
       */
      ctx.auth = userToken
      await next()

    }
  }

  /**
   * 解析token，并返回用户身份信息
   * @param { 上下文 } ctx
   * @returns 
   */
  parseToken(ctx) {
    let header = ctx.request.header
    let token
    if (header.hasOwnProperty('authorization')) {
      token = header.authorization.replace('Bearer ', '')
    }
    let decode
    try {
      decode = jwt.verify(token, global.config.security.secretKey)
    } catch (error) {
      throw new TokenException()
    }
    return decode
  }

}

module.exports = { Auth }
