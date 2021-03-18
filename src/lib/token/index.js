const jwt = require('jsonwebtoken')

class Token {

  /**
   * accessToken的默认有效期
   */
  accessExp = global.config.security.accessExp || 60 * 60 * 2 // 2h

  /**
   * refreshToken的默认有效期
   */
  refreshExp = global.config.security.refreshExp || 60 * 60 * 24 * 30 // 1 month

  /**
   * 生成token的默认加密字段
   */
  secretKey = global.config.security.secretKey || 'abcdefg'

  /**
   * token 类型 常量
   */
  static AccessType = 'AccessToken'
  static RefreshType = 'RefreshToken'

  constructor( secret, accessExp, refreshExp ) {
    secret && (this.secret = secret)
    accessExp && (this.accessExp = accessExp)
    refreshExp && (this.refreshExp = refreshExp)
  }

  /**
   * 生成 AccessToken
   * @param { 用户id } uid 
   * @param { 用户角色 } role
   * @returns 
   */
  generateAccess(uid, role) {
    const token = jwt.sign(
      { uid, role }, this.secretKey, { expiresIn: this.accessExp }
    )
    return token
  }

  /**
   * 生成 RefreshToken
   * @param { 用户id } uid 
   * @param { 用户角色 } role
   * @returns 
   */
  generateRefresh(uid, role) {
    const token = jwt.sign(
      { uid, role }, this.secretKey, { expiresIn: this.refreshExp }
    )
    return token
  }

}

module.exports = { Token }
