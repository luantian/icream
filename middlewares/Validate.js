const fs = require('fs')
const path = require('path')
const { NotFound, DevParameterException, ToolException } = require('@core/HttpException')

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

    this.start(apiDoc, ctx)

    if (this.result.length) {
      throw new DevParameterException(this.result)
    }

    console.log('ctx.request.body', ctx.request.body)

    return 333;

  }

  start (apiDoc, ctx) {
    // 实参
    const realParams = ctx.request.body
    // 形参 也就是需要验证的字段
    const dummyParams = apiDoc.params
    // 需要验证的字段
    const dummyParamsKeys = Object.keys(dummyParams)
    dummyParamsKeys.map((dummykey) => {
      const oRule = dummyParams[dummykey]
      this.singleCheck(realParams, dummykey, oRule)
    })
  }

  /**
   * 单个字段验证，包含所有规则验证
   * @param {*} realParams 用户实际传过来的参数
   * @param {*} dummykey 需要验证的字段
   * @param {*} oRule 需要验证的所有规则
   */
  singleCheck(realParams, dummykey, oRule) {
    
    const ruleKeys = this.filterKey(Object.keys(oRule))

    // console.log('当前需要验证的字段: ' + dummykey)
    // console.log('需要验证的规则: ' + ruleKeys)
    // console.log('dummykey', dummykey)
    // console.log('oRule', oRule)
    // console.log('ruleKeys', ruleKeys)

    ruleKeys.map((ruleKey) => {
      const ruleValue = oRule[ruleKey]
      let result 
      try {
        result = this.checkFunc[`is_${ruleKey}`](realParams, dummykey, ruleValue)
      } catch (error) {
        throw new ToolException(ruleKey)
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
          return this.failResult(`${dummykey}: 必传参数`)
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
        if (ruleValue) {
          realParams[dummykey] = realParams[dummykey].trim()
        }
      }
      return this.successResult()
    }
  }
}

module.exports = Validate