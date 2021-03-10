const { ParameterException, ExistException } = require('@httpException')
const { User } = require('@model/user')
class UserService {
  static async registor(params) {
    /**
     * 1. 输入账号，密码，确认密码，邮箱，昵称
     * 2. 校验账号规则(未做)
     * 3. 校验密码和确认密码是否相同
     * 4. 校验密码安全度(未做)
     * 5. 校验邮箱是否可用(未做)
     * 6. 校验账号是否存在
     * 7. 密码加密(未做)
     */

    if (params.password !== params.repassword) throw new ParameterException(11000)

    const { account, email, phone } = params

    let user = null
    if (account) user = await User.findOne({where: { account }})
    if (email && !user) user = await User.findOne({where: { email }})
    if (phone && !user) user = await User.findOne({where: { phone }})
    if (user) throw new ExistException(11004)
    await User.create(params)
  }
}

module.exports = { UserService }
