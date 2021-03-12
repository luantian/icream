const fs = require('fs')
const path = require('path')
const {
  NotFound,
  DevParameterException,
  ParameterException,
  ToolException
} = require('@httpException')
const Enum = require('@utils/Enum')
const util = require('@utils/util')

class Validate {

  constructor () {
    this.result = []
    // this.ApiDocPath = path.resolve(__dirname, '../../static/doc')
  }

  /**
   * 参数验证初始化
   * @param { 上下文 } ctx 
   * @param { 读取接口定义的json数据 } apiDoc 
   * @returns 返回验证后或处理后的数据，和需要返回给前端的字段
   */
  async init(ctx, apiDoc) {
    
    const params = await this.start(apiDoc, ctx)
    if (this.result.length) {
      if (global.config.environment === Enum.environment.dev) {
        throw new DevParameterException(this.result)
      } else {
        throw new ParameterException()
      }
    }
    return { params, retVo: apiDoc.ret }
  }

  /**
   * 参数转换，将query，params，body的参数统一整理返回给controller
   * 
   * @param {上下文} ctx 
   * @returns 
   */
  conversParams(ctx) {
    let query = JSON.parse(JSON.stringify(ctx.request.query)) || {}
    let params = ctx.request.params || {}
    let body = ctx.request.body || {}

    return Object.assign(query, params, body)
  }

  /**
   * 开始验证
   * @param { 上下文 } ctx 
   * @param { 读取接口定义的json数据 } apiDoc 
   * @returns 
   */
  async start (apiDoc, ctx) {
    // 实参
    const realParams = this.conversParams(ctx)

    // console.log('realParams', realParams)

    // 形参 也就是需要验证的字段
    const dummyParams = apiDoc.params
    let params = {}
    // 需要验证的字段
    const dummyParamsKeys = Object.keys(dummyParams)
    
    // 需要额外验证的默认值，只要参数自动是这些，就默认进行验证
    const defaultKeys = ['email', 'phone']
    
    // 过滤用户传过来的多余参数
    dummyParamsKeys.map((dummykey) => {
      const oRule = dummyParams[dummykey]
      if (realParams[dummykey]) {
        params[dummykey] = realParams[dummykey]
      }
      if (defaultKeys.includes(dummykey)) {
        oRule[dummykey] = true
      }
      this.singleCheck(params, dummykey, oRule)
    })
    return params
  }

  /**
   * 单个字段验证，包含所有规则验证
   * @param {*} realParams 用户实际传过来的参数
   * @param {*} dummykey 需要验证的字段
   * @param {*} oRule 需要验证的所有规则
   */
  singleCheck(realParams, dummykey, oRule) {
    // console.log('当前需要验证的字段: ' + dummykey)
    // console.log('需要验证的规则: ' + ruleKeys)
    // console.log('dummykey', dummykey)
    // console.log('oRule', oRule)
    // console.log('ruleKeys', ruleKeys)

    const ruleKeys = this.filterKey(Object.keys(oRule))

    ruleKeys.map((ruleKey) => {
      const ruleValue = oRule[ruleKey]
      let result 
      try {
        result = this[`is_${ruleKey}`](realParams, dummykey, ruleValue)
      } catch (error) {
        throw new ToolException(`参数: ${dummykey}字段有错误，请联系管理员`)
      }

      if (!result.isPass) {
        this.result.push(result.msg)
      }
    })
  }

  /**
   * 过滤不需要验证的字段 label
   * @param { 待验证的字段 } ruleKeys 
   * @returns 返回过滤后的字段
   */
  filterKey(ruleKeys) {
    // 不需要的字段
    const filterKeys = ['label']
    filterKeys.map((filterKey) => {
      if (ruleKeys.includes(filterKey)) {
        const index = ruleKeys.indexOf(filterKey)
        ruleKeys.splice(index, 1)
      }
    })
    return ruleKeys
  }

  /**
   * 验证成功返回的数据结构
   * @returns 
   */
  successResult() {
    return { isPass: true }
  }

  /**
   * 验证失败返回的数据结构
   * @returns 
   */
  failResult(msg) {
    return { isPass: false, msg }
  }
  
  /**
   * 验证必传字段是否存在
   * @param { 用户上传的真实参数 } realParams 
   * @param { 验证的字段 } dummykey 
   * @param { 验证规则的值 } ruleValue 
   * @returns 
   */
  is_required (realParams, dummykey, ruleValue) {
    if (ruleValue) 
      if (!realParams.hasOwnProperty(dummykey)) 
        return this.failResult(`${dummykey}: 缺少必传参数`)
    return this.successResult()
  }

  // 验证字段类型
  is_type (realParams, dummykey, ruleValue) {
    const r = realParams[dummykey]
    if (r) {
      if (ruleValue !== util.decideType(r)) 
        return this.failResult(`${dummykey}: 类型错误`)
    }
    return this.successResult()
  }

  // 验证字段长度
  is_len (realParams, dummykey, ruleValue) {
    const r = realParams[dummykey]
    if (r) {
      switch (util.decideType(ruleValue)) {
        case 'Array':
          const min = ruleValue[0]
          const max = ruleValue[1]
          if ( r.length < min || r.length > max )
            return this.failResult(`${dummykey}: 长度不在${min}和${max}之间`)
          break
        case 'Number':
          if ( r.length !== ruleValue )
            return this.failResult(`${dummykey}: 长度不等于${ruleValue}`)
          break
        default:
          return this.failResult(`${dummykey}: 接口的json文件 len 的值类型错误`)
      }
    }
    return this.successResult()
  }

  // 验证字段的值是否在可选值内
  is_enum (realParams, dummykey, ruleValue) {
    const r = realParams[dummykey]
    if (r) {
      if (!ruleValue.includes(r)) 
        return this.failResult(`${dummykey}: 不在可选范围之内`)
    }
    return this.successResult()
  }

  // 验证是否需要去除两端空格
  is_trim (realParams, dummykey, ruleValue) {
    const r = realParams[dummykey]
    if (r) {
      if (ruleValue)
        realParams[dummykey] = realParams[dummykey].trim()
    }
    return this.successResult()
  }

  // 验证是否是邮箱格式
  is_email (realParams, dummykey, ruleValue) {
    const r = realParams[dummykey]
    if (r) {
      if (!util.isEmail(r))
        return this.failResult(`${dummykey}: 邮箱不符合规则`)
    }
    return this.successResult()
  }

  // 验证是否是手机格式
  is_phone(realParams, dummykey, ruleValue) {
    const r = realParams[dummykey]
    if (r) {
      if (!util.isPhone(r))
        return this.failResult(`${dummykey}: 手机号不符合规则`)
    }
    return this.successResult()
  }

}

module.exports = Validate