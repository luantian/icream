const Router = require('@koa/router');

const { UserService } = require('@service/UserService')

const { success } = require('@lib/success')

const Validate = require('@validate');
const { User } = require('../../../model/user');

const router = new Router({
  prefix: '/v1/user'
})


router.post('/login', async (ctx) => {
  // const result = UserService.getUserName()
  let retVo = await new Validate().init(ctx)
  const params = ctx.request.body

  let result = {
    name: "terence",
    age: 18,
    sex: 1
  }

  success(result, retVo)
})

router.post('/registor', async (ctx) => {
  let retVo = await new Validate().init(ctx)
  const params = ctx.request.body

  const user = await User.findOne({ where: { email: params.email } })

  console.log('user', user)

  success(user.dataValues, { 'nickname': 'nickname' })
})

module.exports = router
