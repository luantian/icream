const util = {
  isEmail(val) {
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    return reg.test(val)
  },
  isPhone(val) {
    const reg = /^[1][3,4,5,6.7,8,9][0-9]{9}$/
    return reg.test(val)
  },
  decideType(val) {
    return Object.prototype.toString.call(val).replace('[object ', '').replace(']', '')
  }

}



module.exports = util