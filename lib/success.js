const { Success } = require("@core/HttpException")

const success = (result) => {
  throw new Success(result)
}

module.exports = { success }