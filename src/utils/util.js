const util = {
  isEmail(val) {
    const myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    return myreg.test(val)
  },
  isPhone(val) {
    const myreg=/^[1][3,4,5,6.7,8,9][0-9]{9}$/
    return myreg.test(val)
  }
}

module.exports = util