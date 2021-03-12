const { ParameterException, ExistException, NotFound } = require('@httpException')
const { UserModel } = require('@model/user')
class UserController {

  static async login(params) {
    
    const { account } = params

    const user = await UserModel.findOne({ where: { account } })
    if (!user) throw new ExistException(11005)

    return user

  }

  static async registor(params) {
    /**
     * 1. 输入账号，密码，确认密码，邮箱，昵称
     * 2. 校验账号规则(未做)
     * 3. 校验密码和确认密码是否相同
     * 4. 校验密码安全度(未做)
     * 5. 校验邮箱是否可用(未做)
     * 6. 校验账号是否存在
     * 7. 密码加密(已完成)
     */

    if (params.password !== params.repassword) throw new ParameterException(11000)

    const { account, email, phone } = params

    let user = null
    if (account) user = await UserModel.findOne({where: { account }})
    if (email && !user) user = await UserModel.findOne({where: { email }})
    if (phone && !user) user = await UserModel.findOne({where: { phone }})
    if (user) throw new ExistException(11004)
    await UserModel.create(params)
  }

  static async delete(params) {
    const { id } = params.id

    const result = await UserModel.destroy({ where: { id } })

    if (!result) throw new NotFound()

  }

  static async list(params) {

    const { page = 1, limit = 3 } = params

    const { count, rows } = await UserModel.findAndCountAll({ offset: (page - 1) * limit, limit })

    return {
      records: rows,
      total: count
    }
  }

  static async test(params) {
    return params
  }
  
}



module.exports = { UserController }
