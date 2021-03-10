const Router = require('@koa/router');

const { UserService } = require('@service/UserService')
const { ParameterException } = require('@httpException')
const { success } = require('@lib/success')

const Validate = require('@validate');

const router = new Router({
  prefix: '/v1/user'
})

router.post('/login', async (ctx) => {
  
  success()
})

router.post('/registor', async (ctx) => {

  let { params } = await new Validate().init(ctx)

  await UserService.registor(params)

  success()
})

module.exports = router
