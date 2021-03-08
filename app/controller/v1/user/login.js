const Router = require('@koa/router');

const { UserService } = require('@service/UserService')
const { success } = require('@lib/success')

const Validate = require('@validate')

const router = new Router({
  prefix: '/v1/user'
})


router.post('/login', async (ctx) => {
  const params = ctx.request.body
  // const result = UserService.getUserName()
  await new Validate().init(ctx)

  success(params)
})

router.post('/registor', async (ctx) => {
  const params = ctx.request.body
  // const result = UserService.getUserName()

  const result = await new Validate().init(ctx)

  console.log('result', result)

  success(params)
})

module.exports = router
