const fs = require('fs')
const path = require('path')
const { NotFound, DevParameterException, ParameterException, ToolException } = require('@core/HttpException')
const Enum = require('@enum')
const util = require('@utils/util')

class Validate {

  constructor () {
    this.result = []
    this.ApiDocPath = path.resolve(__dirname, '../static/doc')
  }

  async init(ctx) {
    const fileName = this.ApiDocPath + ctx.url + '.json'
    const { apiDoc, error } = await this.getFileData(fileName)
    if (error) {
      // 记录之日
      throw new NotFound(10404)
    }
    const params = await this.start(apiDoc, ctx)
    if (this.result.length) {
      if (global.config.environment === Enum.environment.dev) {
        throw new DevParameterException(this.result)
      } else {
        throw new ParameterException()
      }
    }
    return {params, retVo: apiDoc.ret}
  }

  async start (apiDoc, ctx) {
    // 实参
    const realParams = ctx.request.body
    // 形参 也就是需要验证的字段
    const dummyParams = apiDoc.params
    let params = {}
    // 需要验证的字段
    const dummyParamsKeys = Object.keys(dummyParams)
    
    // 需要额外验证的默认值，只要参数自动是这些，就默认进行验证
    const defaultKeys = ['email', 'phone']
    
    dummyParamsKeys.map((dummykey) => {
      const oRule = dummyParams[dummykey]
      params[dummykey] = realParams[dummykey]
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
        result = this.checkFunc[`is_${ruleKey}`](realParams, dummykey, ruleValue)
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
   * @param {*} ruleKeys 待验证的字段
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

  async getFileData(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (error, data) => {
        if (error) {
          resolve({error})
        } else {
          resolve({apiDoc: JSON.parse(data)})
        }
      })
    })
  }

  successResult() {
    return { isPass: true }
  }

  failResult(msg) {
    return { isPass: false, msg }
  }

  checkFunc = {
    is_required: (realParams, dummykey, ruleValue) => {
      if (ruleValue) 
        if (!realParams.hasOwnProperty(dummykey)) 
          return this.failResult(`${dummykey}: 缺少必传参数`)
      return this.successResult()
    },
    is_type: (realParams, dummykey, ruleValue) => {
      const r = realParams[dummykey]
      if (r) {
        if (`[object ${ruleValue}]` !== Object.prototype.toString.call(r)) 
          return this.failResult(`${dummykey}: 类型错误`)
      }
      return this.successResult()
    },
    is_length: (realParams, dummykey, ruleValue) => {
      const r = realParams[dummykey]
      const min = ruleValue[0]
      const max = ruleValue[1]
      if (r) {
        if ( r.length < min || r.length > max )
          return this.failResult(`${dummykey}: 长度不在${min}和${max}之间`)
      }
      return this.successResult()
    },
    is_enum: (realParams, dummykey, ruleValue) => {
      const r = realParams[dummykey]
      if (r) {
        if (!ruleValue.includes(r)) 
          return this.failResult(`${dummykey}: 不在可选范围之内`)
      }
      return this.successResult()
    },
    is_trim: (realParams, dummykey, ruleValue) => {
      const r = realParams[dummykey]
      if (r) {
        if (ruleValue)
          realParams[dummykey] = realParams[dummykey].trim()
      }
      return this.successResult()
    },
    is_email: (realParams, dummykey, ruleValue) => {
      const r = realParams[dummykey]
      if (r) {
        if (!util.isEmail(r))
          return this.failResult(`${dummykey}: 邮箱不符合规则`)
      }
      return this.successResult()
    },
    is_phone: (realParams, dummykey, ruleValue) => {
      const r = realParams[dummykey]
      if (r) {
        if (!util.isPhone(r))
          return this.failResult(`${dummykey}: 手机号不符合规则`)
      }
      return this.successResult()
    }
  }

}

module.exports = Validate