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

    // UserService.registor(params)
    const { account } = params

    const result = await User.findOne({where: { account: account }})

    if (result) throw new ExistException()

    const user = User.build()

    console.log('user', user)

    await User.create(params)

  }
}

module.exports = { UserService }
