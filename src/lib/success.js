const { Success } = require("@httpException")

const success = (result = {}, retVo = {}) => {

  let keys = Object.keys(retVo)
  let ret = {}
  keys.map((key) => {
    ret[key] = result[key]
    if (result[key] == undefined) ret[key] = null
  })

  throw new Success(ret)
}

module.exports = { success }